import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import noteReducer from "./slices/noteSlice";
import useReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: useReducer,
    notes: noteReducer,
  },
});

export default store;
