import axios from 'axios';

export const analyzeImageWithVision = async (imageFile) => {
  try {
    const base64Data = await convertToBase64(imageFile);
    
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${process.env.REACT_APP_VISION_API_KEY}`,
      {
        requests: [{
          image: { content: base64Data },
          features: [
            { type: 'WEB_DETECTION', maxResults: 5 },
            { type: 'TEXT_DETECTION' }
          ]
        }]
      }
    );

    const webDetection = response.data.responses[0].webDetection;
    
    // Try to find movie title through different methods
    const possibleTitles = [
      ...(webDetection.bestGuessLabels || []).map(l => l.label),
      ...(webDetection.webEntities || [])
        .filter(e => e.description && e.description.match(/movie|film/i))
        .map(e => e.description),
      ...(response.data.responses[0].textAnnotations || [])
        .map(t => t.description)
    ];

    // Find the most movie-like title
    const movieTitle = possibleTitles.reduce((best, current) => {
      const score = current.match(/([A-Z][a-z]+)(?:\s+[A-Z][a-z]+)*/) ? 1 : 0;
      return score > best.score ? { title: current, score } : best;
    }, { title: null, score: 0 });

    return movieTitle.title || null;

  } catch (error) {
    console.error('Vision API Error:', error.response?.data || error.message);
    return null;
  }
};

const convertToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = error => reject(error);
}); 