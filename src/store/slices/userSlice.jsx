// src/store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db } from '../../config/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';



// Signup thunk
export const signUp = createAsyncThunk(
  'user/signUp',
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        displayName,
        email: user.email,
        createdAt: serverTimestamp(),
      });

      return {
        userId: user.uid,
        displayName,
        email: user.email,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Login thunk
export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      return {
        userId: user.uid,
        displayName: user.displayName,
        email: user.email,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isAuthenticated: false,
    user: null,
    signupError: null,
    loginError: null,
  },
  reducers: {
    setUser(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    clearUser(state) {
      state.isAuthenticated = false;
      state.user = null;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.loginError = null; // Clear any login errors on logout
      state.signupError = null; // Clear signup errors as well
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup cases
      .addCase(signUp.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.signupError = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.signupError = action.payload;
      })
      // Login cases
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loginError = null; // Clear any previous login errors
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loginError = action.payload; // Store the error message
      });
  },
});

export const { logout, setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
