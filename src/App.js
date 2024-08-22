import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import debounce from "lodash/debounce";
import Modal from "./components/Modal";
import { API_KEY, topRatedMovies } from "./constants";
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState(topRatedMovies);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // Fetch favorites from local storage on mount
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  const debouncedFetchMovies = useCallback(
    debounce(async (query, page = 1) => {
      setLoading(true);
      setShowFavorites(false);
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${page}`
        );
        setMovies(response.data.Search || []);
        setTotalResults(response.data.totalResults || 0);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    }, 1000),
    []
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    debouncedFetchMovies(searchTerm, newPage);
  };

  const handleSearch = (event) => {
    setCurrentPage(1);
    setSearchTerm(event.target.value);
    if (event.target.value.length > 2) {
      debouncedFetchMovies(event.target.value);
    }
  };

  const fetchMovieDetails = async (id) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
      );
      setSelectedMovie(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const addToFavorites = (movie) => {
    const updatedFavorites = [...favorites, movie];
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (movieId) => {
    const updatedFavorites = favorites.filter(
      (movie) => movie.imdbID !== movieId
    );
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.imdbID === movieId);
  };

  const toggleFavoritesVisibility = () => {
    setShowFavorites(!showFavorites);
  };

  return (
    <div
      className={`mainDiv p-4 transition-colors duration-500 h-full w-full ${
        darkMode ? "bg-gray-900" : "bg-white"
      }`}
    >
      <div className="flex items-center mt-4 justify-end">
        <span
          className={`mr-2 text-lg font-medium ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          {darkMode ? "Dark Mode" : "Light Mode"}
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={toggleDarkMode}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray"></div>
        </label>
      </div>
      <div className="flex flex-col items-center mb-8">
        <h1
          className={`text-3xl md:text-4xl lg:text-5xl font-extrabold font-serif text-center ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Movie Search App
        </h1>
      </div>

      <input
        type="text"
        placeholder="Search for a movie..."
        value={searchTerm}
        onChange={handleSearch}
        className={`w-full p-4 border ${
          darkMode
            ? "border-gray-700 bg-gray-800 text-white"
            : "border-gray-300 bg-white text-black"
        } rounded-lg mb-6 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
      />
      <button
        onClick={toggleFavoritesVisibility}
        className={`w-full py-2 mb-6 text-lg font-medium text-center rounded-lg ${
          darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {showFavorites ? "Hide Favorites" : "Show Favorites"}
      </button>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      ) : showFavorites ? (
        favorites.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favorites.map((movie) => (
                <div
                  key={movie.imdbID}
                  className="relative cursor-pointer p-4 rounded-2xl shadow-2xl hover:shadow-indigo-500/40 transition-shadow"
                  onClick={() => fetchMovieDetails(movie.imdbID)}
                >
                  <img
                    src={movie.Poster}
                    alt={movie.Title}
                    className="w-full h-auto rounded-md mb-2"
                  />
                  <h2
                    className={`text-lg md:text-xl lg:text-2xl font-semibold text-center ${
                      darkMode ? "text-white" : "text-black"
                    }`}
                  >
                    {movie.Title} ({movie.Year})
                  </h2>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFavorite(movie.imdbID)) {
                        removeFromFavorites(movie.imdbID);
                      } else {
                        addToFavorites(movie);
                      }
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full ${
                      isFavorite(movie.imdbID) ? "bg-red-500" : "bg-gray-500"
                    } text-white`}
                  >
                    <i className={`fas fa-star`}></i>
                  </button>
                </div>
              ))}
            </div>
            {isModalOpen && (
              <Modal
                movie={selectedMovie}
                onClose={closeModal}
                darkMode={darkMode}
              />
            )}
          </>
        ) : (
          <p
            className={`text-center text-lg font-medium ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            No Favorites Added!!
          </p>
        )
      ) : movies && movies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <div
                key={movie.imdbID}
                className="relative cursor-pointer p-4 rounded-2xl shadow-2xl hover:shadow-indigo-500/40 transition-shadow"
                onClick={() => fetchMovieDetails(movie.imdbID)}
              >
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full h-auto rounded-md mb-2"
                />
                <h2
                  className={`text-lg md:text-xl lg:text-2xl font-semibold text-center ${
                    darkMode ? "text-white" : "text-black"
                  }`}
                >
                  {movie.Title} ({movie.Year})
                </h2>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isFavorite(movie.imdbID)) {
                      removeFromFavorites(movie.imdbID);
                    } else {
                      addToFavorites(movie);
                    }
                  }}
                  className={`absolute top-2 right-2 p-2 rounded-full ${
                    isFavorite(movie.imdbID) ? "bg-red-500" : "bg-gray-500"
                  } text-white`}
                >
                  <i className={`fas fa-star`}></i>
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className={`px-4 py-2 mx-2 bg-gray-800 text-white rounded ${
                currentPage === 1 ? "hidden" : ""
              }`}
            >
              <i
                className={`fas fa-chevron-left ${
                  darkMode ? "text-white" : "text-black"
                }`}
              ></i>
            </button>
            <span
              className={`px-4 py-2 mx-2 ${
                darkMode ? "text-white" : "text-black"
              }`}
            >
              Page {currentPage}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-4 py-2 mx-2 ${
                darkMode ? "bg-gray-800" : "bg-gray-200"
              } text-white rounded ${totalResults <= 10 ? "hidden" : ""}`}
            >
              <i
                className={`fas fa-chevron-right ${
                  darkMode ? "text-white" : "text-black"
                }`}
              ></i>
            </button>
          </div>
          {isModalOpen && (
            <Modal
              movie={selectedMovie}
              onClose={closeModal}
              darkMode={darkMode}
            />
          )}
        </>
      ) : (
        <p
          className={`text-center text-lg font-medium ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          No Results Were Found!!
        </p>
      )}
    </div>
  );
}

export default App;
