const axios = require('axios');

const getSEOSuggestions = async (html) => {
  const prompt = `
  Analyze this webpage HTML for SEO and provide specific recommendations:
  ${html.substring(0, 2000)}... [truncated]
  
  Focus on:
  1. Title tag optimization
  2. Meta description improvement
  3. Header structure
  4. Content quality
  5. Image alt attributes
  
  Provide concise bullet points:`;

  try {
    const MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.1";
    
    // Correct endpoint format
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${MODEL_NAME}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 500,
          return_full_text: false,
          temperature: 0.7,
          do_sample: true
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // Increased timeout
      }
    );
    
    // Handle different response formats
    if (Array.isArray(response.data)) {
      return response.data[0]?.generated_text || "No suggestions generated";
    } else if (response.data.generated_text) {
      return response.data.generated_text;
    } else {
      return "Unexpected response format";
    }

  } catch (error) {
    console.error('Hugging Face error:', error.response?.data || error.message);

    if (error.response?.status === 404) {
      return "Model not found. Please check the model name or try a different model.";
    }
    
    if (error.response?.status === 429) {
      return "AI is currently overloaded. Please try again later.";
    }
    
    if (error.response?.status === 503) {
      return "Model is currently loading. Please wait a moment and try again.";
    }

    return "Could not generate suggestions at this time.";
  }
};

// Alternative with a more reliable model
const getSEOSuggestionsAlternative = async (html) => {
  const prompt = `Analyze this HTML and provide SEO recommendations:
${html.substring(0, 1500)}

Please provide specific suggestions for:
- Title optimization
- Meta description
- Headers
- Content quality
- Image alt text`;

  try {
    // Using a more stable model
    const MODEL_NAME = "microsoft/DialoGPT-medium";
    
    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${MODEL_NAME}`,
      {
        inputs: prompt,
        parameters: {
          max_length: 512,
          temperature: 0.7,
          pad_token_id: 50256
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );
    
    return response.data[0]?.generated_text || "No suggestions generated";

  } catch (error) {
    console.error('Alternative model error:', error.response?.data || error.message);
    return "Could not generate suggestions with alternative model.";
  }
};

// Function to test API connection
const testHuggingFaceAPI = async () => {
  try {
    const response = await axios.get('https://api-inference.huggingface.co/models', {
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`
      }
    });
    console.log('API connection successful');
    return true;
  } catch (error) {
    console.error('API connection failed:', error.response?.status, error.response?.data);
    return false;
  }
};

module.exports = { 
  getSEOSuggestions, 
  getSEOSuggestionsAlternative, 
  testHuggingFaceAPI 
};