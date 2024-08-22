// src/middleware/logger.js
const logger = (store) => (next) => (action) => {
    console.log('Action Type:', action.type);
    console.log('Previous State:', store.getState());
  
    const result = next(action); // Dispatch the action
  
    console.log('Next State:', store.getState());
  
    return result; // Return the result from the next middleware or the reducer
  };
  
  export default logger;
  