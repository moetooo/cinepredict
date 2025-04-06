import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { StarIcon } from '@heroicons/react/24/solid';
import Navbar from '../components/Navbar';

const MovieResults = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null); // For trailer URL
  const location = useLocation();

  // Extract the movie ID from the query parameters
  const queryParams = new URLSearchParams(location.search);
  const movieId = queryParams.get('id');

  // Fetch movie details
  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!movieId) {
        setError('No movie ID provided.');
        setLoading(false);
        return;
      }

      try {
        // Fetch movie details
        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        setMovie(movieResponse.data);

        // Fetch movie trailers
        const trailerResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        const trailer = trailerResponse.data.results.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailer) {
          setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Failed to fetch movie details.');
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieId]);

  if (loading) {
    return <div className="min-h-screen bg-dark text-white flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen bg-dark text-white flex items-center justify-center">{error}</div>;
  }

  if (!movie) {
    return <div className="min-h-screen bg-dark text-white flex items-center justify-center">No movie found.</div>;
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      <Navbar />

      {/* Movie Details Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Movie Poster */}
          <div className="w-full md:w-1/3">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* Movie Information */}
          <div className="w-full md:w-2/3">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
            <p className="text-lg text-gray-300 mb-6">{movie.overview}</p>

            {/* Ratings */}
            <div className="flex items-center gap-2 mb-6">
              <StarIcon className="h-6 w-6 text-yellow-400" />
              <p className="text-white">{movie.vote_average}/10</p>
              <p className="text-gray-400">({movie.vote_count} votes)</p>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-gray-400">Release Date:</p>
                <p className="text-white">{movie.release_date}</p>
              </div>
              <div>
                <p className="text-gray-400">Runtime:</p>
                <p className="text-white">{movie.runtime} minutes</p>
              </div>
              <div>
                <p className="text-gray-400">Genres:</p>
                <p className="text-white">
                  {movie.genres.map((genre) => genre.name).join(', ')}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Language:</p>
                <p className="text-white">{movie.original_language}</p>
              </div>
            </div>

            {/* Trailer Button */}
            {trailerUrl && (
              <div className="mb-8">
                <a
                  href={trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  Watch Trailer
                </a>
              </div>
            )}

            {/* Reviews */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Reviews</h2>
              <p className="text-gray-300">Reviews from critics and audiences will be displayed here.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovieResults; 