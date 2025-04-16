import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import MovieResults from './pages/MovieResults';
import ImagePredictions from './pages/ImagePredictions';
import MoodPicker from './pages/MoodPicker';
import RandomMovie from './pages/RandomMovie';
import AIRecommendations from './pages/AIRecommendations';
import SimilarMovies from './pages/SimilarMovies';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/movie-results" element={<MovieResults />} />
          <Route path="/image-predictions" element={<ImagePredictions />} />
          <Route path="/mood-picker" element={<MoodPicker />} />
          <Route path="/random-movie" element={<RandomMovie />} />
          <Route path="/ai-recommendations" element={<AIRecommendations />} />
          <Route path="/similar-movies" element={<SimilarMovies />} />
          {/* Add other routes as needed */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;