import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { StarIcon } from '@heroicons/react/24/solid';

const MovieResults = () => {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null); // For trailer URL
  const [streamingServices, setStreamingServices] = useState([]);
  const [cast, setCast] = useState([]);
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
        // Fetch movie details from TMDB
        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        if (!movieResponse.data) {
          throw new Error('No movie data found in the response.');
        }
        if (movieResponse.data.adult) {
          throw new Error('Adult content filtered out');
        }
        setMovie(movieResponse.data);

        // Fetch movie trailers from TMDB
        const trailerResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        const trailer = trailerResponse.data.results.find(
          (video) => video.type === 'Trailer' && video.site === 'YouTube'
        );
        if (trailer) {
          setTrailerUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
        } else {
          console.warn('No trailers found for this movie.');
        }

        // Fetch streaming services
        const streamingResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/watch/providers?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        if (streamingResponse.data.results.US) {
          setStreamingServices(streamingResponse.data.results.US.flatrate || []);
        }

        // Fetch cast
        const castResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        setCast(castResponse.data.cast.slice(0, 5));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        } else if (error.request) {
          console.error('No response received:', error.request);
        } else {
          console.error('Error:', error.message);
        }
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
      {/* Movie Details Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Movie Poster */}
          <div className="w-full md:w-1/3 relative">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="rounded-lg shadow-2xl transform hover:scale-105 transition-transform duration-300"
            />
            {/* User Score */}
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-pink-600 to-violet-600 rounded-full p-2 shadow-lg hover:scale-105 transition-transform">
              <div className="flex items-center gap-1">
                <StarIcon className="h-5 w-5 text-yellow-400" />
                <span className="text-white font-bold text-sm">
                  {Math.round(movie.vote_average * 10)}%
                </span>
              </div>
            </div>
          </div>

          {/* Movie Information */}
          <div className="w-full md:w-2/3">
            <h1 className="text-4xl font-bold mb-6">{movie.title}</h1>
            <p className="text-lg text-gray-300 mb-6">{movie.overview}</p>

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
                  className="inline-block px-6 py-3 bg-gradient-to-r from-pink-600 to-violet-600 text-white rounded-lg hover:from-pink-700 hover:to-violet-700 transition-colors transform hover:scale-105"
                >
                  Watch Trailer
                </a>
              </div>
            )}

            {/* Add Streaming Services Section */}
            {streamingServices.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Available On</h2>
                <div className="flex gap-4">
                  {streamingServices.map((service) => (
                    <div key={service.provider_id} className="flex items-center gap-2">
                      <img
                        src={`https://image.tmdb.org/t/p/w200${service.logo_path}`}
                        alt={service.provider_name}
                        className="w-8 h-8 rounded-md"
                      />
                      <span className="text-white">{service.provider_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cast Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Cast</h2>
              <div className="flex gap-4">
                {cast.map((actor) => (
                  <div key={actor.id} className="text-center">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                      className="w-24 h-24 rounded-full object-cover mb-2 shadow-lg hover:shadow-pink-500/50 transition-shadow"
                    />
                    <p className="text-white">{actor.name}</p>
                    <p className="text-gray-400">{actor.character}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MovieResults; 