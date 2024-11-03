// src/components/pages/home/Home.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Container, Box, Card, List, ListItem, ListItemText } from '@mui/material';
import Navbar from '../../shared/navbar/Navbar';

function Home() {
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);

  // Load saved notes from localStorage when the component mounts
  useEffect(() => {
    const notesFromStorage = JSON.parse(localStorage.getItem('notes'));
    if (notesFromStorage) {
      setSavedNotes(notesFromStorage);
    }
  }, []);

  // Update localStorage whenever savedNotes changes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(savedNotes));
  }, [savedNotes]);

  const handleSaveNote = () => {
    if (note.trim()) {
      setSavedNotes([...savedNotes, note]);
      setNote(''); // Clear the note input
    }
  };

  const handleClearNotes = () => {
    setSavedNotes([]);
  };

  return (
    <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Navbar/>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Notepad
      </Typography>

      <Card sx={{ width: '100%', p: 2, mb: 2 }}>
        <TextField
          label="Write your note here..."
          multiline
          rows={8}
          variant="outlined"
          fullWidth
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" color="primary" onClick={handleSaveNote}>
            Save Note
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClearNotes}>
            Clear All Notes
          </Button>
        </Box>
      </Card>

      <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
        Saved Notes
      </Typography>
      <Card sx={{ width: '100%', p: 2 }}>
        <List>
          {savedNotes.length === 0 && (
            <Typography color="textSecondary">No saved notes yet. Write something and save it!</Typography>
          )}
          {savedNotes.map((note, index) => (
            <ListItem key={index}>
              <ListItemText primary={note} />
            </ListItem>
          ))}
        </List>
      </Card>
    </Container>
  );
}

export default Home;
