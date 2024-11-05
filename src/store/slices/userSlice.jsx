import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, db, storage } from '../../config/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const getInitialState = () => {
  const userData = localStorage.getItem('user');
  return userData ? { isAuthenticated: true, user: JSON.parse(userData).user } : { isAuthenticated: false, user: null };
};

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
  initialState: getInitialState(),
  reducers: {
    clearUser(state) {
      localStorage.removeItem('user');
      state.isAuthenticated = false;
      state.user = null;
      state.signupError = null;
      state.loginError = null;
    },
    logout(state) {
      clearUser(state);
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
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loginError = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loginError = action.payload;
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

export const { logout, setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
