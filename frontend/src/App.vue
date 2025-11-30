<script setup>
import { ref } from 'vue';
import axios from 'axios';

const inputText = ref('');
const result = ref(null);
const loading = ref(false);
const error = ref(null);

// POINT THIS TO YOUR LOCAL FIREBASE EMULATOR OR DEPLOYED URL
// Local default: http://127.0.0.1:5001/demo-techshare/us-central1/analyzeSop
// Note: In production (Firebase Hosting), we use a relative path handled by rewrites
const API_URL = import.meta.env.PROD 
  ? '/analyzeSop' 
  : 'http://127.0.0.1:5001/demo-techshare/us-central1/analyzeSop'; 

const analyzeSop = async () => {
  if (!inputText.value) return;
  
  loading.value = true;
  error.value = null;
  result.value = null;

  try {
    const response = await axios.post(API_URL, {
      text: inputText.value
    });
    result.value = response.data;
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.error || "Failed to analyze. Check backend (is emulator running?).";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="container">
    <h1>SOP AI Analyzer 🤖</h1>
    <p class="subtitle">Tech Share Demo: Secure API Call + Structured JSON</p>

    <div class="input-section">
      <textarea 
        v-model="inputText" 
        placeholder="Paste your SOP paragraph here (min 10 chars)..."
        rows="6"
        :disabled="loading"
      ></textarea>
      <button @click="analyzeSop" :disabled="loading || !inputText">
        {{ loading ? 'Analyzing...' : 'Analyze' }}
      </button>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="error-box">
      ⚠️ {{ error }}
    </div>

    <!-- Result Display (Structured) -->
    <div v-if="result" class="result-box">
      <h3>Summary</h3>
      <p>{{ result.summary }}</p>
      
      <h3>Improvements</h3>
      <ul>
        <li v-for="(item, index) in result.improvements" :key="index">
          {{ item }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.container { max-width: 600px; margin: 0 auto; padding: 2rem; font-family: sans-serif; text-align: left; }
h1 { margin-bottom: 0.5rem; }
.subtitle { color: #666; margin-bottom: 2rem; }

textarea { 
  width: 100%; 
  padding: 15px; 
  margin-bottom: 15px; 
  border-radius: 8px; 
  border: 1px solid #ccc; 
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;
}

button { 
  background-color: #42b883; 
  color: white; 
  border: none; 
  padding: 12px 24px; 
  border-radius: 8px; 
  cursor: pointer; 
  font-size: 1rem; 
  font-weight: bold;
  transition: background-color 0.2s;
}
button:hover { background-color: #3aa876; }
button:disabled { background-color: #a8d5c2; cursor: not-allowed; }

.result-box { margin-top: 2rem; padding: 1.5rem; background: #f9f9f9; border-radius: 12px; border: 1px solid #eee; }
.error-box { margin-top: 1rem; color: #d32f2f; background: #ffcdd2; padding: 15px; border-radius: 8px; }

h3 { margin-top: 0; margin-bottom: 0.5rem; color: #2c3e50; }
ul { padding-left: 20px; margin-bottom: 0; }
li { margin-bottom: 5px; }
</style>
