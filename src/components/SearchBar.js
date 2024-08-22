import React from "react";

const SearchBar = ({ searchTerm, onSearch, darkMode }) => (
  <input
    type="text"
    placeholder="Search for a movie..."
    value={searchTerm}
    onChange={onSearch}
    className={`w-full p-4 border ${
      darkMode
        ? "border-gray-700 bg-gray-800 text-white"
        : "border-gray-300 bg-white text-black"
    } rounded-lg mb-6 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600`}
  />
);

export default SearchBar;
