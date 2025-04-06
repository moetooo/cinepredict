import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RandomMovie = () => {
  const [randomMovie, setRandomMovie] = useState(null);

  const fetchRandomMovie = async () => {
    try {
      const response = await axios.get(
        'https://api.themoviedb.org/3/movie/popular?api_key=e63fbd9c340f0d5ee2a2260864fb8abf'
      );
      const movies = response.data.results;
      const randomIndex = Math.floor(Math.random() * movies.length);
      setRandomMovie(movies[randomIndex]);
    } catch (error) {
      console.error('Error fetching random movie:', error);
    }
  };

  useEffect(() => {
    fetchRandomMovie();
  }, []);

  return (
    <div className="min-h-screen bg-dark text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Your Own Random Movie Recommendation</h1>
      {randomMovie ? (
        <div className="flex flex-col items-center gap-4">
          <img
            src={`https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`}
            alt={randomMovie.title}
            className="rounded-lg shadow-lg"
          />
          <h2 className="text-2xl font-bold">{randomMovie.title}</h2>
          <p className="text-lg">{randomMovie.overview}</p>
          <button
            onClick={fetchRandomMovie}
            className="mt-4 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
          >
            Get Another Recommendation
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default RandomMovie; 