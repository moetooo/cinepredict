export const reverseImageSearch = async (imageFile) => {
  try {
    const base64Data = await convertToBase64(imageFile);
    const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
    const cx = process.env.REACT_APP_GOOGLE_CX;

    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&searchType=image`,
      {
        method: 'POST',
        body: JSON.stringify({
          image: {
            image: base64Data
          }
        })
      }
    );

    const data = await response.json();
    return parseMovieTitle(data.items);
    
  } catch (error) {
    console.error('Reverse Image Search Error:', error);
    return null;
  }
};

const parseMovieTitle = (items) => {
  if (!items || items.length === 0) return null;

  const titlePatterns = [
    /"([^"]+)" screenshot/i,
    /screenshot from (.+?) \(\d{4}\)/i,
    /(.+?) (?:movie|film) (?:clip|scene)/i,
    /^(.*?)(?:\s*\(\d{4}\)|\s*-?\s*scene|screenshot)/i
  ];

  const titles = items.flatMap(item => {
    const sources = [item.title, item.snippet, item.link];
    
    return sources.flatMap(text => {
      if (!text) return [];
      
      // Try all patterns
      for (const pattern of titlePatterns) {
        const match = text.match(pattern);
        if (match) return [match[1].trim()];
      }
      
      // Fallback: Split common separators
      return text.split(/[•|-|—|·]/)[0].trim();
    });
  });

  // Find the most common title candidate
  const titleCounts = titles.reduce((acc, title) => {
    acc[title] = (acc[title] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(titleCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
};

const convertToBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result.split(',')[1]);
  reader.onerror = error => reject(error);
}); 