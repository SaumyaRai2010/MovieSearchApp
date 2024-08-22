import { createStore } from 'redux';
import { combineReducers } from 'redux';

const initialState = {
  favorites: [],
};

function favoritesReducer(state = initialState, action) {
  switch (action.type) {
    case 'ADD_FAVORITE':
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favorites: state.favorites.filter(movie => movie.imdbID !== action.payload),
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  favorites: favoritesReducer,
});

const store = createStore(rootReducer);

export default store;
