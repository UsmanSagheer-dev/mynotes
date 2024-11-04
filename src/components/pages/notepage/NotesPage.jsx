import React, { useEffect,useState } from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import Navbar from "../../shared/navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotes, deleteNote } from "../../../store/slices/noteSlice"; // Fetch and delete actions
import { auth } from "../../../config/firebase/firebase";

function NotesPage() {
  const dispatch = useDispatch();

  // Use optional chaining with a fallback to ensure `notes` is always an array
  const notes = useSelector((state) => state.notes?.notes || []);
  console.log("Redux state notes:", notes); // Debugging log to confirm notes in state

  const userId = auth.currentUser ? auth.currentUser.uid : null; // Ensure user is logged in
  const isLoading = useSelector((state) => state.notes.fetchNoteLoading);
  const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        if (userId) {
          dispatch(fetchNotes(userId)).then((action) => {
            if (action.meta.requestStatus === 'fulfilled') {
              console.log("Fetched notes successfully:", action.payload);
              setDataLoaded(true); // Set flag to trigger re-render
            }
          });
        }
      }, [userId, dispatch]);

  const handleDeleteNote = (noteId) => {
    dispatch(deleteNote(noteId)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        console.log("Note successfully deleted:", noteId);
      } else {
        console.error("Error deleting note:", result.payload);
      }
    });
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Your Saved Notes
      </Typography>

      {isLoading ? (
        <Typography>Loading notes...</Typography>
      ) : Array.isArray(notes) && notes.length > 0 ? (
        notes.map((note) => (
          <Card key={note.id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">{note.title || "Untitled"}</Typography>
              <Typography color="textSecondary">
                {note.category || "No Category"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {note.date?.toDate().toLocaleString() || "No Date"}
              </Typography>
              <Typography>{note.content || "No Content"}</Typography>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => handleDeleteNote(note.id)}
                sx={{ marginTop: 2 }}
              >
                Delete Note
              </Button>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No notes available.</Typography>
      )}
    </Box>
  );
}

export default NotesPage;
