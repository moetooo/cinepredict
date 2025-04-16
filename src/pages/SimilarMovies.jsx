import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const SimilarMovies = () => {
  const location = useLocation();
  const { movies, originalQuery } = location.state || {};

  return (
    <div className="min-h-screen bg-dark text-white p-8">
      <section className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-violet-400">
          Movies Similar to "{originalQuery}"
        </h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies?.map(movie => (
            <Link 
              key={movie.id}
              to={`/movie-results?id=${movie.id}`}
              className="group block rounded-xl overflow-hidden hover:scale-105 transition-transform"
            >
              <div className="relative aspect-[2/3] bg-gray-800">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-3 bg-gray-800/50 backdrop-blur-sm">
                <h3 className="font-medium truncate">{movie.title}</h3>
                <p className="text-sm text-violet-400">
                  {movie.release_date?.split('-')[0]}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {!movies?.length && (
          <div className="text-center text-violet-400 py-12">
            No similar movies found
          </div>
        )}
      </section>
    </div>
  );
};

export default SimilarMovies; 