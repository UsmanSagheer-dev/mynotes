import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { db } from "../../config/firebase/firebase";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

export const addNote = createAsyncThunk(
  "notes/addNote",
  async (
    { title, category, content, userId, imageURL },
    { rejectWithValue }
  ) => {
    try {
      if (!userId) {
        throw new Error("User ID is missing. Make sure the user is logged in.");
      }
      const noteRef = doc(collection(db, "notes"));
      const newNote = {
        noteId: noteRef.id, // Get the unique ID from Firestore
        userId,
        title,
        category,
        content,
        imageURL,
        date: serverTimestamp(),
      };
      await setDoc(noteRef, newNote);
      return newNote; // Return newNote so noteId can be used in the reducer
    } catch (error) {
      console.error("Error in addNote thunk:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (userId, { rejectWithValue }) => {
    try {
      const q = query(collection(db, "notes"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const notes = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      return notes;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (noteId, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      return noteId; // Return noteId for use in the reducer
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async ({ noteId, updatedData }, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, "notes", noteId), updatedData);
      return { noteId, ...updatedData };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
    notes: [], // Ensure this is an array
    loading: false,
    error: null,
    addNoteLoading: false,
    fetchNoteLoading: false,
    deleteNoteLoading: false,
    updateNoteLoading: false,
  };
  

// Create notes slice with extra reducers for async thunks
const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(addNote.pending, (state) => {
        state.addNoteLoading = true;
        state.error = null;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.addNoteLoading = false;
        state.notes.push(action.payload);
      })
      .addCase(addNote.rejected, (state, action) => {
        state.addNoteLoading = false;
        state.error = action.payload;
      })
      
      // Fetch Notes
      .addCase(fetchNotes.pending, (state) => {
        state.fetchNoteLoading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.fetchNoteLoading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.fetchNoteLoading = false;
        state.error = action.payload;
      })
      
      // Delete Note
      .addCase(deleteNote.pending, (state) => {
        state.deleteNoteLoading = true;
        state.error = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.deleteNoteLoading = false;
        state.notes = state.notes.filter((note) => note.noteId !== action.payload); // Remove deleted note
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.deleteNoteLoading = false;
        state.error = action.payload;
      })
      
      // Update Note
      .addCase(updateNote.pending, (state) => {
        state.updateNoteLoading = true;
        state.error = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.updateNoteLoading = false;
        const index = state.notes.findIndex(
          (note) => note.noteId === action.payload.noteId
        );
        if (index !== -1) {
          state.notes[index] = { ...state.notes[index], ...action.payload };
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.updateNoteLoading = false;
        state.error = action.payload;
      });
  },
});

export default noteSlice.reducer;
