import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import MovieResults from './pages/MovieResults';
import AIRecommendations from './pages/AIRecommendations';
import RandomMovie from './pages/RandomMovie';
import AdvancedResults from './pages/AdvancedResults';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/movie-results" element={<MovieResults />} />
        <Route path="/ai-recommendations" element={<AIRecommendations />} />
        <Route path="/random-movie" element={<RandomMovie />} />
        <Route path="/advanced-results" element={<AdvancedResults />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;