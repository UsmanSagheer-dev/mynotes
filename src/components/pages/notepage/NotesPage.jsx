import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button, CardMedia, CircularProgress, Divider } from "@mui/material";
import Navbar from "../../shared/navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotes, deleteNote } from "../../../store/slices/noteSlice";
import { auth } from "../../../config/firebase/firebase";

function NotesPage() {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes?.notes || []);
  const isLoading = useSelector((state) => state.notes.fetchNoteLoading);
  const [dataLoaded, setDataLoaded] = useState(false);

  const userId = auth.currentUser ? auth.currentUser.uid : null;

  useEffect(() => {
    if (userId) {
      dispatch(fetchNotes(userId)).then((action) => {
        if (action.meta.requestStatus === "fulfilled") {
          console.log("Fetched notes successfully:", action.payload);
          setDataLoaded(true);
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

  const formatDate = (date) => {
    if (!date) return "No Date";
    if (typeof date.toDate === "function") {
      return date.toDate().toLocaleString();
    }
    if (typeof date === "number" || date instanceof Date) {
      return new Date(date).toLocaleString();
    }
    return "Invalid Date";
  };

  return (
    <Box sx={{ }}>
      <Navbar />
      <Typography variant="h4" gutterBottom>
        Your Saved Notes
      </Typography>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <CircularProgress />
        </Box>
      ) : notes.length > 0 ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "start", marginTop: 2, marginLeft: 4 }}>
        {notes.map((note) => (
          <Card key={note.id} sx={{ width: 400, }}>
            {note.imageURL && (
              <CardMedia
                component="img"
                height="350px"
                image={note.imageURL}
                alt={note.title || "Note Image"}
              />
            )}
            <CardContent>
              <Typography sx={{ color: "red", fontFamily: 'fantasy' }} variant="h6">
                {note.title || "Untitled"}
              </Typography>
              <Typography color="textSecondary">
                {note.category || "No Category"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {formatDate(note.date)}
              </Typography>
              <Divider />
              <Typography sx={{ marginTop: 1 }}>
                {note.content || "No Content"}
              </Typography>
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
        ))}
      </Box>
      
      ) : dataLoaded ? (
        <Typography>No notes available. Click "Add New Notes" to get started!</Typography>
      ) : null}
    </Box>
  );
}

export default NotesPage;
