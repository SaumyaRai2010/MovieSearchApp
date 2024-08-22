// src/reducers/index.js
import { combineReducers } from 'redux';
import movieReducer from './movieReducer';

const rootReducer = combineReducers({
  movieData: movieReducer,
});

export default rootReducer;
