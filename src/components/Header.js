import React from "react";

const Header = ({ darkMode, onToggleDarkMode }) => (
  <div className="flex items-center mt-4 mb-6 justify-end">
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
        onChange={onToggleDarkMode}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-gray"></div>
    </label>
  </div>
);

export default Header;
