import OcrResults from './pages/OcrResults';
import MovieResults from './pages/MovieResults';

function App() {
  return (
    <Routes>
      {/* ... existing routes ... */}
      <Route path="/ocr-results" element={<OcrResults />} />
      <Route path="/movie-results" element={<MovieResults />} />
    </Routes>
  );
} 