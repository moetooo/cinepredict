import React from 'react';
import { useLocation } from 'react-router-dom';

const ImagePredictions = () => {
  const location = useLocation();
  const { predictions } = location.state || { predictions: [] };

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-4xl md:text-6xl font-bold mb-12 bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">
          Image Predictions
        </h1>

        {predictions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {predictions.map((movie) => (
              <div key={movie.id} className="bg-gray-800/50 rounded-xl p-6 border border-violet-900/30 hover:border-violet-500 transition-all">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                <p className="text-sm text-gray-400 mb-2">{movie.release_date?.split('-')[0]}</p>
                <p className="text-sm text-gray-300">{movie.overview}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No predictions found.</p>
        )}
      </div>
    </div>
  );
};

export default ImagePredictions; 