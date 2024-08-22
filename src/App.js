import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleDarkMode,
  setMovies,
  setCurrentPage,
  setLoading,
  setTotalResults,
  setSearchTerm
} from "./actions/movieActions";
import debounce from "lodash/debounce";
import Modal from "./components/Modal";
import { API_KEY, topRatedMovies } from "./constants";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  const [selectedMovie, setSelectedMovie] = useState(null); // this is the selected movie for which the user wants details
  const [isModalOpen, setIsModalOpen] = useState(false);//this is the condition for movie details modal toggle
  const [favorites, setFavorites] = useState([]);// this contains the array of favs in local storage
  const [showFavorites, setShowFavorites] = useState(false);// this is to toggle the show favs section

  const { darkMode, movies, currentPage, loading, totalResults, searchTerm } = useSelector(
    (state) => state.movieData
  ); //using useSelector to access the redux store

  useEffect(() => {
    dispatch(setMovies(topRatedMovies));
  }, [dispatch]);
  //initially we set the movies to be the top rated movies on mount

  // here we fetch favorites from local storage on mount
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
    []
  );

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
    debouncedFetchMovies(searchTerm, newPage);
  };

  
  const handleSearch = (event) => {
    dispatch(setSearchTerm(event.target.value));
    if (event.target.value.length > 2) {
      dispatch(setCurrentPage(1));
      //here we set current page to be 1 again in case the user is on page 100 and then he performs a search
      //so in that case we need to reset the current page value to be 1 again
      debouncedFetchMovies(event.target.value);
    }
  };

  //using this function we fetch the details of movie when clicked on it
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
  }; // we close the modal and set the selected movie to be null

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  }; //this is used to toggle dark mode

  const addToFavorites = (movie) => {
    const updatedFavorites = [...favorites, movie];
    setFavorites(updatedFavorites); // here we update the fav movies in localStorage
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const removeFromFavorites = (movieId) => {
    const updatedFavorites = favorites.filter(
      (movie) => movie.imdbID !== movieId
    );
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    // here we remove some movies from the favMovies in localStorage
  };

  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.imdbID === movieId);
  }; //this is to check if a movie is favourite or not so that we can conditionally render a fav star icon on top
  // as well as delete or add it to the localStorage

  const isFavoriteSectionVisible = () => {
    setShowFavorites(!showFavorites);
  }; //this is to toggle the visibility for the fav movies section

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
            onChange={handleToggleDarkMode}
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
        onClick={isFavoriteSectionVisible}
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
            No Favorites Added!
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
              className={`px-4 py-2 mx-2 ${
                darkMode ? "bg-gray-800" : "bg-gray-200"
              } text-white rounded ${currentPage === 1 ? "hidden" : ""}`}
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
          No Results Were Found!
        </p>
      )}
    </div>
  );
}

export default App;
