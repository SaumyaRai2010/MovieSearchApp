// src/actions/movieActions.js
import {
    SET_MOVIES,
    SET_SEARCH_TERM,
    SET_CURRENT_PAGE,
    SET_TOTAL_RESULTS,
    SET_LOADING,
    TOGGLE_DARK_MODE
  } from './actionTypes';
  
  export const setMovies = (movies) => ({
    type: SET_MOVIES,
    payload: movies,
  });
  
  export const setSearchTerm = (term) => ({
    type: SET_SEARCH_TERM,
    payload: term,
  });
  
  export const setCurrentPage = (page) => ({
    type: SET_CURRENT_PAGE,
    payload: page,
  });
  
  export const setTotalResults = (total) => ({
    type: SET_TOTAL_RESULTS,
    payload: total,
  });
  
  export const setLoading = (loading) => ({
    type: SET_LOADING,
    payload: loading,
  });
  
  export const toggleDarkMode = () => ({
    type: TOGGLE_DARK_MODE,
  });
