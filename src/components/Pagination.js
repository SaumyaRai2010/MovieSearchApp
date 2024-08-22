import React from "react";

const Pagination = ({ currentPage, totalResults, onPageChange, darkMode }) => (
  <div className="flex justify-center mt-8">
    <button
      onClick={() => onPageChange(currentPage - 1)}
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
      onClick={() => onPageChange(currentPage + 1)}
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
);

export default Pagination;
