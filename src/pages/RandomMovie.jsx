import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import Navbar from '../components/Navbar';

const RandomMovie = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchRandomMovie = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
      );
      const movies = response.data.results;
      const randomIndex = Math.floor(Math.random() * movies.length);
      setMovie(movies[randomIndex]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching random movie:', error);
      setError('Failed to fetch movie. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomMovie();
  }, []);

  return (
    <div className="min-h-screen bg-dark text-white">
      <Navbar />
      
      <section className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">
              Surprise Cinema
            </h1>
            <p className="text-gray-400 text-sm">
              Discover random movie gems from our curated collection
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin mb-3">
                <SparklesIcon className="h-10 w-10 text-violet-400" />
              </div>
              <p className="text-violet-300 text-lg">Crafting your cinematic surprise...</p>
            </div>
          ) : error ? (
            <div className="text-center p-6 bg-red-900/20 rounded-xl border border-red-900/30">
              <p className="text-red-400 text-lg">{error}</p>
            </div>
          ) : movie ? (
            <div className="group relative bg-gray-800/50 rounded-xl p-6 border border-violet-900/30 backdrop-blur-sm transition-all hover:border-violet-500">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="rounded-lg shadow-xl transform group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-600/30 to-pink-500/30 rounded-lg blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
                </div>

                <div className="w-full md:w-2/3 space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">{movie.title}</h2>
                    <div className="flex items-center gap-3 text-gray-400 text-sm">
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                      <span>•</span>
                      <span>{movie.runtime} mins</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <SparklesIcon className="h-3.5 w-3.5 text-yellow-400" />
                        {movie.vote_average}/10
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed">{movie.overview}</p>

                  {/* Safely handle genres */}
                  {movie.genres && movie.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {movie.genres.map(genre => (
                        <span 
                          key={genre.id}
                          className="px-2.5 py-0.5 bg-violet-900/30 text-violet-300 rounded-full text-xs"
                        >
                          {genre.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => navigate(`/movie-results?id=${movie.id}`)}
                      className="px-5 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-violet-900/30 hover:shadow-violet-900/40 text-sm"
                    >
                      <SparklesIcon className="h-4 w-4" />
                      View Details
                    </button>
                    <button
                      onClick={fetchRandomMovie}
                      className="px-5 py-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-pink-900/30 hover:shadow-pink-900/40 text-sm"
                    >
                      <ArrowPathIcon className="h-4 w-4" />
                      Try Another
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
};

export default RandomMovie; 