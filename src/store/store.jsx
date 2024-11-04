
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/slices/userSlice';
import noteReducer from '../store/slices/noteSlice'; 
const store = configureStore({
  reducer: {
    user: userReducer,
    notes: noteReducer,
   
  },
});

export default store;
