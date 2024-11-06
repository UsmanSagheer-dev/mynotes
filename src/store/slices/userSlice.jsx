
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase/firebase';
import { doc, getDoc } from 'firebase/firestore';
export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async ({ userId }, { rejectWithValue }) => {
    if (userId) {
      try {
        const userDocRef = doc(db, 'users', userId);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          return docSnapshot.data(); 
        } else {
          return rejectWithValue("No user found.");
        }
      } catch (error) {
        return rejectWithValue("Failed to fetch user data.");
      }
    } else {
      return rejectWithValue("No user is currently logged in.");
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loginError: null,
    isAuthenticated: false,  
  },
  reducers: {
    clearUser(state) {
      state.user = null;
      state.loginError = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loginError = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loginError = action.payload;
      });
  },
});

export const { clearUser } = userSlice.actions;
export default userSlice.reducer;
