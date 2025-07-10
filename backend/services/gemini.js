const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getSEOSuggestions = async (html) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `
  As an SEO expert, analyze this webpage HTML and provide specific recommendations:
  ${html.substring(0, 10000)} 
  
  Focus on:
  1. Title Tag - Suggest optimized version (under 60 chars)
  2. Meta Description - Improved version (under 160 chars)
  3. Header Structure - Check hierarchy (H1-H6)
  4. Content Quality - Identify thin content
  5. Images - Missing alt attributes
  
  Format as bullet points with severity ratings (Low/Medium/High):`;

  try {
    const result = await model.generateContent(prompt);
    console.log(result);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini Error:', error);
    return "Failed to generate suggestions. Please try again later.";
  }
};

module.exports = { getSEOSuggestions };