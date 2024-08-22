import React from "react";

const MovieCard = ({ movie, isFavorite, onClick, onFavoriteToggle, darkMode }) => (
  <div
    key={movie.imdbID}
    className="relative cursor-pointer p-4 rounded-2xl shadow-2xl hover:shadow-indigo-500/40 transition-shadow"
    onClick={onClick}
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
        onFavoriteToggle();
      }}
      className={`absolute top-2 right-2 p-2 rounded-full ${
        isFavorite ? "bg-red-500" : "bg-gray-500"
      } text-white`}
    >
      <i className={`fas fa-star`}></i>
    </button>
  </div>
);

export default MovieCard;
