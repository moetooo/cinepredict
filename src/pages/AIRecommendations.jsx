import { useState } from 'react';
import { analyzeTextWithGemini } from '../utils/gemini';

const AIRecommendations = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const movieNames = await analyzeTextWithGemini(query);
      setResults(movieNames);
    } catch (error) {
      console.error('AI Recommendation Error:', error);
      alert('Failed to get recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-violet-400">
            AI Movie Recommendations
          </h1>
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe your perfect movie..."
              className="flex-1 p-3 rounded-lg bg-gray-800 border border-violet-900/30"
            />
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Get Recommendations'}
            </button>
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-violet-300">Suggested Movies</h2>
            <ul className="list-disc pl-6 space-y-2">
              {results.map((movie, index) => (
                <li key={index} className="text-gray-300">
                  {movie}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIRecommendations; 