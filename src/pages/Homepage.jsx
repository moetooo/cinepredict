import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  SparklesIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Navbar from '../components/Navbar';

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('simple');
  const [imagePreview, setImagePreview] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const navigate = useNavigate();

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);

  const fetchSuggestions = async (query) => {
    if (query.trim() === '' || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${query}`
      );
      const filteredSuggestions = response.data.results
        .filter(movie => movie.popularity > 5 && movie.poster_path)
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleSearch = async () => {
    if (searchMode === 'advanced' && searchQuery.trim()) {
      try {
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const prompt = `Identify the movie based on this description: "${searchQuery}". 
          Follow this format exactly:
          1. [Exact Movie Title] ([Release Year]) - [Confidence%] - [Brief Reason]
          2. ... (up to 5 movies)
          Include only movies from 1970-2023 with theatrical releases.`;
        
        const result = await model.generateContent(prompt);
        const text = (await result.response).text();
        const movies = await enhanceWithTMDBData(text);
        
        if (movies.length > 0) {
          navigate('/advanced-results', { state: { predictions: movies } });
        } else {
          alert('No movies found matching your description');
        }
      } catch (error) {
        console.error('Gemini Error:', error);
        // Fallback to TMDB keyword search
        const fallbackResults = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}`,
          {
            params: {
              query: searchQuery,
              include_adult: false,
              page: 1
            }
          }
        );

        const validResults = fallbackResults.data.results
          .filter(m => m.title && m.id)
          .slice(0, 5)
          .map(m => ({
            title: m.title,
            confidence: Math.min(Math.floor(m.popularity), 100),
            id: m.id,
            overview: m.overview
          }));

        if (validResults.length > 0) {
          navigate('/advanced-results', { state: { predictions: validResults } });
        } else {
          navigate('/advanced-results', { state: { predictions: [] } });
        }
      }
    } else if (searchMode === 'simple' && searchQuery.trim()) {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&query=${searchQuery}`
        );
        const movies = response.data.results;
        if (movies.length > 0) {
          // Navigate to the first movie's details
          navigate(`/movie-results?id=${movies[0].id}`);
        } else {
          alert('No movies found for your search.');
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
        alert('Failed to fetch movie details.');
      }
    } else if (searchMode === 'image' && imagePreview) {
      navigate(`/results?image=${encodeURIComponent(imagePreview)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
    // Keep existing arrow key navigation for simple mode
    else if (suggestions.length > 0 && searchMode === 'simple') {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex((prevIndex) => 
          prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex((prevIndex) => 
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        const selectedMovie = suggestions[highlightedIndex];
        setSearchQuery(selectedMovie.title);
        setSuggestions([]);
        navigate(`/movie-results?id=${selectedMovie.id}`);
      }
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchMode === 'simple') {
        fetchSuggestions(searchQuery);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchMode]);

  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target.result);
      setSearchQuery(event.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSuggestionClick = (movieId) => {
    navigate(`/movie-results?id=${movieId}`);
  };

  const enhanceWithTMDBData = async (geminiText) => {
    const lines = geminiText.split('\n').filter(line => line.trim().match(/^\d+\./));
    const movies = [];
    
    for (const line of lines) {
      const match = line.match(/(.+?)\s\((\d{4})\)\s+-\s+(\d+)%?\s+-\s+(.+)/);
      if (match) {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}`,
            {
              params: {
                query: match[1],
                year: match[2],
                include_adult: false
              }
            }
          );
          
          if (response.data.results.length > 0) {
            const bestMatch = response.data.results[0];
            movies.push({
              ...bestMatch,
              confidence: match[3],
              explanation: match[4],
              id: bestMatch.id
            });
          }
        } catch (error) {
          console.error('TMDB Search Error:', error);
        }
      }
    }
    return movies;
  };

  return (
    <div>
      <div className="min-h-screen bg-dark text-white overflow-hidden">
        <Navbar />

        {/* Search Section */}
        <section className="container mx-auto px-4 py-24 text-center h-[calc(100vh-80px)] overflow-y-hidden">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-violet-400 to-pink-500 bg-clip-text text-transparent">
            AI Meets Your Movie Match
          </h1>

          <form className="max-w-3xl mx-auto">
            {/* Search Input Area */}
            <div className="relative group">
              {searchMode === 'image' && imagePreview ? (
                <div className="w-full p-5 pr-20 rounded-xl bg-gray-900 border-2 border-violet-900/50 focus:border-violet-500 outline-none transition-all shadow-lg shadow-violet-900/20 relative flex items-center">
                  <div className="w-20 h-6 rounded-lg overflow-hidden border-2 border-violet-900/50 flex-shrink-0 relative">
                    <img 
                      src={imagePreview} 
                      alt="Uploaded preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => {
                        setImagePreview(null);
                        setSearchQuery('');
                      }}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full bg-black hover:bg-black/90 transition-colors border border-gray-700"
                      aria-label="Remove image"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      const url = e.target.value;
                      setSearchQuery(url);
                      
                      if (url && searchMode === 'image') {
                        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
                        const isImage = imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
                        
                        if (isImage) {
                          const img = new Image();
                          img.onload = () => {
                            setImagePreview(url);
                          };
                          img.onerror = () => {
                            alert('The URL does not point to a valid image.');
                            setSearchQuery('');
                            setImagePreview(null);
                          };
                          img.src = url;
                        } else {
                          alert('Please enter a valid image URL.');
                          setSearchQuery('');
                          setImagePreview(null);
                        }
                      }
                    }}
                    onFocus={() => {
                      if (searchMode === 'image') {
                        setSearchMode('image');
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      searchMode === 'simple' 
                        ? 'Search movies...' 
                        : searchMode === 'advanced' 
                        ? 'Describe a movie scene, plot, or elements...'
                        : 'Paste image URL...'
                    }
                    className="w-full p-5 pr-20 rounded-xl bg-gray-900 border-2 border-violet-900/50 focus:border-violet-500 outline-none text-white placeholder-violet-400/70 transition-all shadow-lg shadow-violet-900/20"
                  />
                  {searchMode === 'simple' && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-gray-800 rounded-lg shadow-lg border border-violet-900/30">
                      {suggestions.map((movie, index) => (
                        <div
                          key={movie.id}
                          className={`p-1 hover:bg-gray-700/50 cursor-pointer text-white flex items-center gap-2 transition-colors ${
                            index === highlightedIndex ? 'bg-gray-700/50' : ''
                          }`}
                          onClick={() => handleSuggestionClick(movie.id)}
                        >
                          <img
                            src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                            alt={movie.title}
                            className="w-8 h-12 rounded-md object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{movie.title}</p>
                            <p className="text-xs text-gray-400 truncate">{movie.release_date?.split('-')[0]}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Search Button */}
              <button
                type="button"
                onClick={handleSearch}
                className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-br from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 transition-all shadow-lg shadow-violet-900/30 hover:shadow-violet-900/40 active:scale-95 group/search-btn"
              >
                <MagnifyingGlassIcon className="h-6 w-6 text-white transform group-hover/search-btn:scale-110 transition-transform" />
              </button>
            </div>

            {/* Search Mode Selector */}
            <div className="mt-6 flex items-center justify-center gap-2 bg-gray-800/30 rounded-xl p-1.5 border border-violet-900/30">
              <button
                type="button"
                onClick={() => setSearchMode('simple')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${
                  searchMode === 'simple'
                    ? 'bg-violet-600/80 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700/20'
                }`}
              >
                <CommandLineIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Simple</span>
              </button>
              
              <button
                type="button"
                onClick={() => setSearchMode('advanced')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${
                  searchMode === 'advanced'
                    ? 'bg-violet-600/80 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700/20'
                }`}
              >
                <SparklesIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Advanced</span>
              </button>
              
              <button
                type="button"
                onClick={() => setSearchMode('image')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg transition-all ${
                  searchMode === 'image'
                    ? 'bg-violet-600/80 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700/20'
                }`}
              >
                <PhotoIcon className="h-5 w-5" />
                <span className="text-sm font-medium">Image</span>
              </button>
            </div>

            {/* Content Sections */}
            {searchMode === 'advanced' && (
              <div className="mt-6 text-left p-4 bg-gray-800/50 rounded-xl border border-violet-900/30 animate-fade-in">
                <h3 className="text-violet-300 mb-3 flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5" />
                  Advanced Filters (Optional)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Genre preferences (e.g., Action, Comedy)"
                    className="w-full p-3 rounded-lg bg-gray-700 border border-violet-900/30 text-white focus:outline-none focus:border-violet-500"
                  />
                  <input
                    type="text"
                    placeholder="Language (e.g., English, Spanish, Hindi)"
                    className="w-full p-3 rounded-lg bg-gray-700 border border-violet-900/30 text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            )}

            {searchMode === 'image' && (
              <div className="mt-6 p-8 border-2 border-dashed border-violet-900/50 rounded-xl hover:border-violet-500 transition-all cursor-pointer group/image-upload animate-fade-in overflow-hidden"
                   onDragOver={(e) => {
                     e.preventDefault();
                     e.currentTarget.classList.add('border-violet-500');
                   }}
                   onDragLeave={(e) => {
                     e.preventDefault();
                     e.currentTarget.classList.remove('border-violet-500');
                   }}
                   onDrop={(e) => {
                     e.preventDefault();
                     e.currentTarget.classList.remove('border-violet-500');
                     const file = e.dataTransfer.files[0];
                     if (file && file.type.startsWith('image/')) {
                       handleImageUpload(file);
                     } else {
                       alert('Please drop an image file only.');
                     }
                   }}
                   onClick={() => document.getElementById('fileInput').click()}
              >
                <div className="flex flex-col items-center gap-3 text-violet-300 group-hover/image-upload:text-violet-400 transition-colors">
                  <PhotoIcon className="h-12 w-12" />
                  <p className="text-center">
                    Drag & drop image here <br />
                    or <span className="text-violet-400">click to upload</span>
                  </p>
                </div>
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file && file.type.startsWith('image/')) {
                      handleImageUpload(file);
                    } else {
                      alert('Please select an image file only.');
                    }
                  }}
                />
              </div>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};

export default Homepage;