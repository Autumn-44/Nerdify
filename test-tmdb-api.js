// Test script to verify TMDB API key
import axios from 'axios';

const API_KEY = 'feade1c6afce47ef56a28cafe1e6efcf';

console.log('Testing TMDB API Key...\n');

// Test 1: Using API Key in query params (old method)
console.log('Test 1: API Key in query params');
axios.get('https://api.themoviedb.org/3/movie/popular', {
  params: { api_key: API_KEY }
})
  .then(response => {
    console.log('✅ API Key method works!');
    console.log(`Found ${response.data.results.length} movies\n`);
  })
  .catch(error => {
    console.log('❌ API Key method failed:');
    console.log(error.response?.data || error.message);
    console.log('\n');
  });

// Test 2: Using Bearer Token (new method)
console.log('Test 2: Bearer Token method');
axios.get('https://api.themoviedb.org/3/movie/popular', {
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'accept': 'application/json'
  }
})
  .then(response => {
    console.log('✅ Bearer Token method works!');
    console.log(`Found ${response.data.results.length} movies\n`);
  })
  .catch(error => {
    console.log('❌ Bearer Token method failed:');
    console.log(error.response?.data || error.message);
    console.log('\n');
  });

console.log('\n=== Instructions ===');
console.log('If both tests fail, you need to get a new API Read Access Token:');
console.log('1. Go to https://www.themoviedb.org/settings/api');
console.log('2. Scroll down to "API Read Access Token (v4 auth)"');
console.log('3. Copy the token (it starts with "eyJ...")');
console.log('4. Replace VITE_TMDB_API_KEY in your .env file');

// Made with Bob
