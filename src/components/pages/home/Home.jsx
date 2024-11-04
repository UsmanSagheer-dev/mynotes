import React, { useState } from "react";
import { Typography, Container, Box, Button, Modal, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../shared/navbar/Navbar";
import Footer from "../../footer/Footer";
import { useDispatch } from 'react-redux';
import { addNote } from '../../../store/slices/noteSlice';
import { auth } from '../../../config/firebase/firebase';

function Home() {
  const [open, setOpen] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = auth.currentUser ? auth.currentUser.uid : null; // Get logged-in user ID
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleAddNote = () => {
    if (!userId) {
      console.error("User is not logged in.");
      return;
    }

    const noteData = {
      title,
      category,
      content: newNote,
      userId, // Attach userId to associate note with the logged-in user
    };

    // Dispatch the addNote action to save the note to Firebase
    dispatch(addNote(noteData)).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        console.log("Note successfully added to Firebase:", result.payload);
        handleClose(); // Close modal on successful save
        navigate("/notes"); // Navigate to the Notes page
      } else {
        console.error("Error saving note:", result.payload);
      }
    });

    // Clear form fields
    setTitle("");
    setCategory("");
    setNewNote("");
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
        minHeight: "100vh",
      }}
    >
      <Navbar />
      <Box sx={{ marginTop: 4, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Your Notes App!
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Manage your notes effectively with all the features you need.
        </Typography>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ marginTop: 4 }}
      >
        Add New Notes
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            Add a New Note
          </Typography>

          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Category"
            variant="outlined"
            fullWidth
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="New Note"
            variant="outlined"
            fullWidth
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            sx={{ marginBottom: 2 }}
          />

          <Button variant="contained" color="primary" onClick={handleAddNote}>
            Save Note
          </Button>
        </Box>
      </Modal>

      <Footer />
    </Container>
  );
}

export default Home;
