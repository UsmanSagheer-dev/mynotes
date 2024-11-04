
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db, storage } from '../../config/firebase/firebase';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const signUp = createAsyncThunk(
  'user/signUp',
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

      return {
        userId: user.uid,
        displayName,
        email: user.email,
        bio,
        address,
        imageUrl,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

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
      state.loginError = null;
      state.signupError = null;
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
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.loginError = action.payload;
      });
  },
});

export const { logout, setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
