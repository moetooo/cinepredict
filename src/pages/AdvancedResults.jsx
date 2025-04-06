import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { SparklesIcon, FilmIcon } from '@heroicons/react/24/solid';

const AdvancedResults = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const predictions = state?.predictions || [];

  return (
    <div className="min-h-screen bg-dark text-white">
      <Navbar />
      
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4 bg-gradient-to-r from-violet-600 to-pink-500 p-3 rounded-2xl">
              <SparklesIcon className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">
                AI-Powered Matches
              </h1>
            </div>
            <p className="text-gray-400 max-w-xl mx-auto">
              Based on your unique description, we found these perfect matches
            </p>
          </div>

          {/* Predictions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predictions.map((movie, index) => (
              <div
                key={movie.id || index}
                className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/30 rounded-2xl p-6 border border-violet-900/30 hover:border-violet-500 transition-all cursor-pointer hover:shadow-2xl hover:shadow-violet-900/20"
                onClick={() => movie.id && navigate(`/movie-results?id=${movie.id}`)}
              >
                <div className="flex items-start gap-4">
                  {/* Confidence Indicator */}
                  <div className="relative w-14 h-14 flex-shrink-0">
                    <div className="absolute inset-0 bg-violet-900/20 rounded-full blur-md" />
                    <div className="relative flex items-center justify-center w-full h-full">
                      <svg className="w-full h-full" viewBox="0 0 100 100">
                        <circle
                          className="text-violet-900/30"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className="text-violet-400"
                          strokeWidth="8"
                          strokeDasharray={`${movie.confidence * 2.51} 251`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                      <span className="absolute text-sm font-bold text-violet-300">
                        {movie.confidence}%
                      </span>
                    </div>
                  </div>

                  {/* Movie Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-violet-100 truncate mb-1">
                      {movie.title}
                    </h3>
                    {movie.explanation && (
                      <p className="text-gray-400 text-sm leading-snug line-clamp-2">
                        {movie.explanation}
                      </p>
                    )}
                    {movie.release_date && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-violet-400">
                        <FilmIcon className="h-4 w-4" />
                        <span>{new Date(movie.release_date).getFullYear()}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {predictions.length === 0 && (
            <div className="mt-16 text-center">
              <div className="inline-block p-6 bg-violet-900/20 rounded-2xl mb-6">
                <SparklesIcon className="h-16 w-16 text-violet-400 mx-auto" />
              </div>
              <h2 className="text-2xl font-semibold text-violet-200 mb-3">
                No Matches Found
              </h2>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Our AI couldn't find perfect matches. Try being more specific or using different keywords.
              </p>
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 mx-auto"
              >
                <SparklesIcon className="h-4 w-4" />
                Try New Search
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default AdvancedResults; 