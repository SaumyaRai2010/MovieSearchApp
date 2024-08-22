import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

const Modal = ({ movie, onClose, darkMode }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className={`rounded-lg p-8 z-50 relative max-w-lg mx-auto w-full ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
        <button className={`absolute top-4 right-4 text-gray-500 hover:text-gray-700 ${darkMode ? "dark:hover:text-gray-300" : ""}`} onClick={onClose}>
          <AiOutlineClose size={24} />
        </button>
        <h2 className="text-2xl font-bold mb-4">{movie.Title}</h2>
        <p><strong>Director:</strong> {movie.Director}</p>
        <p><strong>Actors:</strong> {movie.Actors}</p>
        <p><strong>Plot:</strong> {movie.Plot}</p>
        <p><strong>Rating:</strong> {movie.imdbRating}</p>
      </div>
    </div>
  );
};

export default Modal;
