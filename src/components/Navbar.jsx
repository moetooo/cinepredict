import { Link } from 'react-router-dom';
import { SparklesIcon, FilmIcon, FaceSmileIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  return (
    <nav className="py-4 border-b border-violet-900/30 bg-darker sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold">
          <SparklesIcon className="h-7 w-7 text-violet-400" />
          <span>CinePredict</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/mood-picker" className="nav-link flex items-center gap-1 hover:text-violet-300 transition-colors">
            <FaceSmileIcon className="h-6 w-5" />
            <span>Explore by Emotion</span>
          </Link>
          <Link to="/random-movie" className="nav-link flex items-center gap-1 hover:text-violet-300 transition-colors">
            <FilmIcon className="h-6 w-5" />
            <span>Random</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 