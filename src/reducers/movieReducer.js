import {
  SET_MOVIES,
  SET_SEARCH_TERM,
  SET_CURRENT_PAGE,
  SET_TOTAL_RESULTS,
  SET_LOADING,
  TOGGLE_DARK_MODE,
} from "../actions/actionTypes";

const initialState = {
  movies: [],
  searchTerm: "",
  currentPage: 1,
  totalResults: 0,
  loading: false,
  favorites: JSON.parse(localStorage.getItem("favorites")) || [],
  darkMode: false,
  selectedMovie: null,
};

const movieReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MOVIES:
      return {
        ...state,
        movies: action.payload,
      };

    case SET_SEARCH_TERM:
      return {
        ...state,
        searchTerm: action.payload,
      };

    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.payload,
      };

    case SET_TOTAL_RESULTS:
      return {
        ...state,
        totalResults: action.payload,
      };

    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case TOGGLE_DARK_MODE:
      return {
        ...state,
        darkMode: !state.darkMode,
      };

    default:
      return state;
  }
};

export default movieReducer;
