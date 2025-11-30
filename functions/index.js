const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const OpenAI = require("openai");
const cors = require("cors")({ origin: true });

// Initialize OpenAI
// In a real deployment, use defineSecret from firebase-functions/params
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

exports.analyzeSop = onRequest((req, res) => {
  // 1. Handle CORS
  cors(req, res, async () => {
    try {
      // Only allow POST
      if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
      }

      const { text } = req.body;

      if (!text || text.length < 20) {
        res.status(400).json({ error: "Input text too short (min 20 chars)" });
        return;
      }

      // 2. Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are an expert academic admissions consultant. 
            Analyze the given Statement of Purpose (SOP) text.
            Return ONLY a raw JSON object (no markdown formatting) with the following structure:
            {
              "summary": "A concise summary of the content",
              "improvements": ["List of 3 specific, actionable improvements"]
            }`
          },
          {
            role: "user",
            content: text
          }
        ],
        response_format: { type: "json_object" }, // Force JSON mode
        max_tokens: 1000,
      });

      // 3. Parse and return result
      const content = completion.choices[0].message.content;
      const result = JSON.parse(content);

      res.status(200).json(result);

    } catch (error) {
      logger.error("Error calling OpenAI:", error);
      
      // Error handling demonstration
      if (error.response && error.response.status === 429) {
        res.status(429).json({ error: "Rate limit exceeded. Please try again later." });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  });
});

