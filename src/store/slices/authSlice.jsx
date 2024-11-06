
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db, storage } from '../../config/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getCurrentUser } from './userSlice'; 

const getInitialState = () => {
  const userData = localStorage.getItem('user');
  return userData 
    ? { isAuthenticated: true, user: JSON.parse(userData).user } 
    : { isAuthenticated: false, user: null };
};

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({ email, password, displayName, bio, address, image }, { rejectWithValue }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName });

      let imageUrl = '';
      if (image) {
        const storageRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      await setDoc(doc(db, 'users', user.uid), {
        userId: user.uid,
        displayName,
        email: user.email,
        bio,
        address,
        imageUrl,
        createdAt: serverTimestamp(),
      });

      const userPayload = {
        userId: user.uid,
        displayName,
        email: user.email,
        bio,
        address,
        imageUrl,
      };
      localStorage.setItem('user', JSON.stringify({ isAuthenticated: true, user: userPayload }));
      return userPayload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await dispatch(getCurrentUser({ userId: user.uid }));

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

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    clearAuth(state) {
      localStorage.removeItem('user');
      state.isAuthenticated = false;
      state.user = null;
      state.signupError = null;
      state.loginError = null;
    },
    logout(state) {
      clearAuth(state);
    },
    setUser(state, action) {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.signupError = null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.signupError = action.payload;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loginError = null;
        localStorage.setItem('user', JSON.stringify({ isAuthenticated: true, user: action.payload }));
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loginError = action.payload;
      });
  },
});


export const { logout, setUser, clearAuth } = authSlice.actions;

export default authSlice.reducer;
