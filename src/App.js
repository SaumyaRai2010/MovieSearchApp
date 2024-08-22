import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleDarkMode,
  setMovies,
  setCurrentPage,
  setLoading,
  setTotalResults,
  setSearchTerm,
} from "./actions/movieActions";
import debounce from "lodash/debounce";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import MovieCard from "./components/MovieCard";
import Pagination from "./components/Pagination";
import Modal from "./components/Modal";
import { API_KEY, topRatedMovies } from "./constants";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  const { darkMode, movies, currentPage, loading, totalResults, searchTerm } =
    useSelector((state) => state.movieData);

  useEffect(() => {
    dispatch(setMovies(topRatedMovies));
  }, [dispatch]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetchMovies = useCallback(
    debounce(async (query, page = 1) => {
      dispatch(setLoading(true));
      setShowFavorites(false);
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${page}`
        );
        dispatch(setMovies(response.data.Search || []));
        dispatch(setTotalResults(response.data.totalResults || 0));
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        dispatch(setLoading(false));
      }
    }, 1000),
    [dispatch]
  );

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
    debouncedFetchMovies(searchTerm, newPage);
  };

  const handleSearch = (event) => {
    dispatch(setSearchTerm(event.target.value));
    if (event.target.value.length > 2) {
      dispatch(setCurrentPage(1));
      debouncedFetchMovies(event.target.value);
    }
  };

  const fetchMovieDetails = async (id) => {
    dispatch(setLoading(true));
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`
      );
      setSelectedMovie(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
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
      <Header darkMode={darkMode} onToggleDarkMode={handleToggleDarkMode} />

      <SearchBar
        searchTerm={searchTerm}
        onSearch={handleSearch}
        darkMode={darkMode}
      />

      <button
        onClick={toggleFavoritesVisibility}
        className={`w-full py-2 mb-6 text-lg font-medium text-center rounded-lg ${
          darkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-black"
        }`}
      >
        {showFavorites ? "Hide Favorites" : "Show Favorites"}
      </button>
      {isModalOpen && (
        <Modal movie={selectedMovie} onClose={closeModal} darkMode={darkMode} />
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-transparent border-solid rounded-full animate-spin"></div>
        </div>
      ) : showFavorites ? (
        favorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                isFavorite={isFavorite(movie.imdbID)}
                onClick={() => fetchMovieDetails(movie.imdbID)}
                onFavoriteToggle={() =>
                  isFavorite(movie.imdbID)
                    ? removeFromFavorites(movie.imdbID)
                    : addToFavorites(movie)
                }
                darkMode={darkMode}
              />
            ))}
          </div>
        ) : (
          <p
            className={`text-center text-lg font-medium ${
              darkMode ? "text-white" : "text-black"
            }`}
          >
            No Favorites Added!
          </p>
        )
      ) : movies && movies.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                isFavorite={isFavorite(movie.imdbID)}
                onClick={() => fetchMovieDetails(movie.imdbID)}
                onFavoriteToggle={() =>
                  isFavorite(movie.imdbID)
                    ? removeFromFavorites(movie.imdbID)
                    : addToFavorites(movie)
                }
                darkMode={darkMode}
              />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalResults={totalResults}
            onPageChange={handlePageChange}
            darkMode={darkMode}
          />
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
          No Results Were Found!
        </p>
      )}
    </div>
  );
}

export default App;
