import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  FaceFrownIcon, HeartIcon, 
  BoltIcon, FilmIcon, FireIcon, 
  MoonIcon, SunIcon, PuzzlePieceIcon, SparklesIcon
} from '@heroicons/react/24/outline';

const moodOptions = [
  { 
    id: 1, 
    name: 'Tense', 
    icon: MoonIcon, 
    genres: [27], // Horror
    color: 'bg-red-800',
    description: 'Heart-pounding suspense and chilling moments'
  },
  { 
    id: 2, 
    name: 'Light-hearted', 
    icon: SunIcon, 
    genres: [35], // Comedy
    color: 'bg-yellow-400',
    description: 'Laugh-out-loud fun and cheerful stories'
  },
  { 
    id: 3, 
    name: 'Passionate', 
    icon: HeartIcon, 
    genres: [10749], // Romance
    color: 'bg-pink-600',
    description: 'Deep connections and heartfelt emotions'
  },
  { 
    id: 4, 
    name: 'Thrilling', 
    icon: BoltIcon, 
    genres: [28], // Action
    color: 'bg-orange-500',
    description: 'Adrenaline-pumping excitement'
  },
  { 
    id: 5, 
    name: 'Emotional', 
    icon: FaceFrownIcon, 
    genres: [18], // Drama
    color: 'bg-blue-600',
    description: 'Powerful human stories'
  },
  { 
    id: 6, 
    name: 'Imaginative', 
    icon: SparklesIcon, 
    genres: [878], // Sci-Fi
    color: 'bg-purple-500',
    description: 'Futuristic visions and possibilities'
  },
  { 
    id: 7, 
    name: 'Magical', 
    icon: FilmIcon, 
    genres: [14], // Fantasy
    color: 'bg-indigo-500',
    description: 'Enchanted worlds and adventures'
  },
  { 
    id: 8, 
    name: 'Intriguing', 
    icon: PuzzlePieceIcon, 
    genres: [9648], // Mystery
    color: 'bg-gray-600',
    description: 'Mind-bending puzzles'
  },
  { 
    id: 9, 
    name: 'Nervous', 
    icon: FireIcon, 
    genres: [53], // Thriller
    color: 'bg-red-600',
    description: 'Edge-of-your-seat tension'
  }
];

const MoodPicker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleMoodSelect = async (mood, newPage = 1) => {
    setSelectedMood(mood);
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie`,
        {
          params: {
            api_key: process.env.REACT_APP_TMDB_API_KEY,
            with_genres: mood.genres.join(','),
            sort_by: 'popularity.desc',
            page: newPage,
            language: 'en-US',
            include_adult: false,
            primary_release_date: '',
            page_size: 8
          }
        }
      );

      if (!response.data?.results) {
        throw new Error('Invalid API response structure');
      }

      const limitedResults = response.data.results
        .filter(movie => !movie.adult && movie.poster_path)
        .slice(0, 8);
      
      setMovies(prev => newPage === 1 ? limitedResults : [...prev, ...limitedResults]);
      setTotalPages(response.data.total_pages);
      setPage(newPage);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError(`Failed to load movies: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      handleMoodSelect(selectedMood, page + 1);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <section className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-violet-400 to-violet-600 bg-clip-text text-transparent">
          Choose Your Movie Vibe
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 max-w-4xl mx-auto">
          {moodOptions.map(mood => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood)}
              className={`flex flex-col items-center p-4 rounded-xl transition-all duration-200 ${
                selectedMood?.id === mood.id
                  ? 'bg-violet-600 scale-105 shadow-lg ring-2 ring-violet-400'
                  : 'bg-gray-800 hover:bg-gray-700/50'
              }`}
            >
              <mood.icon className={`h-7 w-7 mb-2 ${
                selectedMood?.id === mood.id ? 'text-white' : 'text-violet-300'
              }`} />
              <span className={`text-sm font-medium ${
                selectedMood?.id === mood.id ? 'text-white' : 'text-violet-200'
              }`}>
                {mood.name}
              </span>
              <span className="text-xs mt-1 text-gray-400/80">
                {mood.description}
              </span>
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center text-violet-400">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-current border-t-transparent"></div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-400 mb-4">
            {error}
          </div>
        )}

        {movies.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {movies.map(movie => (
                <Link 
                  key={movie.id} 
                  to={`/movie-results?id=${movie.id}`}
                  className="group block rounded-lg overflow-hidden hover:scale-[1.02] transition-transform duration-300 shadow-lg hover:shadow-violet-900/30"
                >
                  <div className="relative aspect-[2/3] bg-gray-700">
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-3 bg-gray-800">
                    <p className="text-sm font-medium truncate">{movie.title}</p>
                    <p className="text-xs text-violet-400">
                      {movie.release_date?.split('-')[0]}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {page < totalPages && (
              <div className="flex justify-center">
                <button
                  onClick={handleLoadMore}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded-lg transition-colors text-sm"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Show More'}
                </button>
              </div>
            )}
          </div>
        )}

        {!loading && !error && movies.length === 0 && (
          <div className="text-center text-violet-400">
            Select a mood to discover movies
          </div>
        )}
      </section>
    </div>
  );
};

export default MoodPicker; 