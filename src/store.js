import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers';
import logger from './middleware/logger';

const store = createStore(
  rootReducer,
  applyMiddleware(logger), // Apply the logger middleware
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
