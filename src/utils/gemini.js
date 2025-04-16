import axios from 'axios';
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

export const analyzeImageWithGemini = async (imageFile) => {
  try {
    console.log('Analyzing image with Gemini...', {
      name: imageFile.name,
      type: imageFile.type,
      size: imageFile.size,
      lastModified: imageFile.lastModified
    });

    const base64Data = await convertToBase64(imageFile);
    
    const promptText = `Analyze this image strictly as a movie poster or film still. 
Identify the exact official English title. Follow these rules:
1. Respond ONLY with the movie title
2. No punctuation or explanations
3. If unsure, respond with 'unknown'
4. Ignore text overlays or watermarks
Example valid responses: "Inception", "The Dark Knight", "Spider-Man: No Way Home"`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${process.env.REACT_APP_GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [
            { text: promptText },
            { inline_data: { mime_type: imageFile.type, data: base64Data } }
          ]
        }]
      }
    );

    const movieName = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('Gemini raw response:', response.data);
    console.log('Extracted movie name:', movieName);
    
    const cleanName = movieName
      .replace(/["']/g, '') // Remove quotes
      .replace(/\(\d{4}\)$/g, '') // Remove year parentheses
      .trim();

    if (!cleanName || cleanName.toLowerCase() === 'unknown' || cleanName.length < 2) {
      return null;
    }
    
    console.log('Full Gemini response:', JSON.stringify(response.data, null, 2));
    return cleanName;

  } catch (error) {
    console.error('Gemini API Error:', error.response?.data || error.message);
    return null;
  }
};

const convertToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = error => reject(error);
});

export const analyzeTextWithGemini = async (text) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    
    const prompt = `Analyze this movie description and suggest 5-7 relevant movies: "${text}". 
      Return only the movie titles in a numbered list format, nothing else. 
      Exclude any adult content or R-rated movies.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();
    
    return textResponse.split('\n')
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(Boolean);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to analyze text with Gemini');
  }
}; 