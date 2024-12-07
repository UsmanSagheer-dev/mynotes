import React, { useState } from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  Input,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addNote } from "../../store/slices/noteSlice";
import { auth, storage } from "../../config/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function AddNoteModal({ open, handleClose }) {
  const [newNote, setNewNote] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userId = auth.currentUser ? auth.currentUser.uid : null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 25 * 1024;

    if (file && file.size > maxSize) {
      alert("Image size should be less than 25KB");
      e.target.value = null; // Clear the input
      return;
    }
    setImage(file);
  };

  const handleAddNote = async () => {
    if (!userId) {
      console.error("User is not logged in.");
      return;
    }

    let imageURL = null;
    if (image) {
      try {
        const imageRef = ref(storage, `notes/${userId}/${image.name}`);
        await uploadBytes(imageRef, image);
        imageURL = await getDownloadURL(imageRef);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }

    const noteData = {
      title,
      category,
      content: newNote,
      userId,
      imageURL,
    };

    dispatch(addNote(noteData)).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        console.log("Note successfully added to Firebase:", result.payload);
        handleClose();
        navigate("/notes");
      } else {
        console.error("Error saving note:", result.payload);
      }
    });

    setTitle("");
    setCategory("");
    setNewNote("");
    setImage(null);
  };

  return (
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
        <Input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          sx={{ marginBottom: 2 }}
        />

        <Button variant="contained" color="primary" onClick={handleAddNote}>
          Save Note
        </Button>
      </Box>
    </Modal>
  );
}

export default AddNoteModal;
