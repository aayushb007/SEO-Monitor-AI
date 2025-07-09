// const axios = require('axios');

// const getSEOSuggestions = async (html) => {

//   const prompt = `
//   Analyze this webpage HTML for SEO and provide specific recommendations:
//   ${html.substring(0, 2000)}... [truncated]

//   Focus on:
//   1. Title tag optimization
//   2. Meta description improvement
//   3. Header structure
//   4. Content quality
//   5. Image alt attributes

//   Provide concise bullet points:`;

//   try {
//     console.log(process.env.OPENAI_API_KEY);

//     const response = await axios.post(
//       'https://api.openai.com/v1/chat/completions',
//       {
//         model: "gpt-3.5-turbo",
//         messages: [{ role: "user", content: prompt }],
//         temperature: 0.7
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//           'Content-Type': 'application/json'
//         }
//       }
//     );
//     // const response = await axios.post(
//     //   'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct',
//     //   { inputs: `Analyze for SEO: ${html}` },
//     //   { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
//     // );
//     return response.data.choices[0].message.content;
//   } catch (error) {
//     console.error('OpenAI error:', error.response?.data || error.message);
//     return "Could not generate suggestions at this time.";
//   }
// };

// module.exports = { getSEOSuggestions };


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
    // const response = await axios.post(
    //   'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct',
    //   { 
    //     inputs: prompt,
    //     parameters: {
    //       max_new_tokens: 500,
    //       temperature: 0.7
    //     }
    //   },
    //   { 
    //     headers: { 
    //       Authorization: `Bearer ${process.env.HF_API_KEY}`,
    //       'Content-Type': 'application/json'
    //     } 
    //   }
    // );

    const MODEL_NAME = "mistralai/Mistral-7B-Instruct-v0.1";
    // or "google/gemma-7b-it" 
    // or "meta-llama/Llama-2-7b-chat-hf"

    const response = await axios.post(
      `https://api-inference.huggingface.co/models/${MODEL_NAME}`,
      {
        inputs: prompt,
        parameters: { max_new_tokens: 500 }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000 // Increased timeout
      }
    );
    return response.data[0]?.generated_text || "No suggestions generated";

  } catch (error) {
    console.log(error);

    console.error('Hugging Face error:', error.response?.data || error.message);

    // Handle rate limiting (common with free tier)
    if (error.response?.status === 429) {
      return "AI is currently overloaded. Please try again later.";
    }

    return "Could not generate suggestions at this time.";
  }
};

module.exports = { getSEOSuggestions };