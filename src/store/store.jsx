// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/slices/userSlice'; // Import the userSlice reducer

const store = configureStore({
  reducer: {
    user: userReducer,
    // Add other reducers here if needed
  },
});

export default store;
