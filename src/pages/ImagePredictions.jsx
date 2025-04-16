import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ImagePredictions = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const predictions = state?.predictions || [];
  const searchTerm = state?.searchTerm || '';

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">
          {searchTerm ? `Results for "${searchTerm}"` : 'Image Predictions'}
        </h1>

        {predictions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.map((movie) => (
              <div 
                key={movie.id}
                onClick={() => navigate(`/movie-results?id=${movie.id}`)}
                className="cursor-pointer bg-gray-800/50 rounded-xl p-6 border border-violet-900/30 hover:border-violet-500 transition-all"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                <p className="text-sm text-gray-400">
                  {movie.release_date?.split('-')[0]}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-violet-300 text-xl mb-4">No predictions found</p>
            <button
              onClick={() => navigate(-1)}
              className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2 rounded-lg"
            >
              Try Another Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePredictions; 