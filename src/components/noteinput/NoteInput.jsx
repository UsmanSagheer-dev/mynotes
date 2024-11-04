import { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Box, Card, List, ListItem, ListItemText } from '@mui/material';

const Notepad = ({ onSave }) => {
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState([]);

  // Load notes from localStorage when the component mounts
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
      onSave(note); // Call the onSave function passed from Home
      setNote(''); // Clear the note input
      setSavedNotes([...savedNotes, note]);
    }
  };

  const handleClearNotes = () => {
    setSavedNotes([]); // Clear saved notes in both state and localStorage
  };

  return (
    <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
        Notepad
      </Typography>


      <Card sx={{ width: '100%',  mb: 2 }}>
        <TextField
          label="Write your note here..."
          multiline
          rows={8}
          variant="outlined"
          fullWidth
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, width: '100%' }}>
        <Button variant="contained" color="primary" onClick={handleSaveNote}>
          Save Note
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClearNotes}>
          Clear All Notes
        </Button>
      </Box>

      {/* Display Saved Notes */}
      <Typography variant="h5" component="h2" sx={{ mb: 1 }}>
        Saved Notes
      </Typography>
      <Card sx={{ width: '100%', p: 2 }}>
        <List>
          {savedNotes.length === 0 ? (
            <Typography color="textSecondary">No saved notes yet. Write something and save it!</Typography>
          ) : (
            savedNotes.map((note, index) => (
              <ListItem key={index}>
                <ListItemText primary={note} />
              </ListItem>
            ))
          )}
        </List>
      </Card>
    </Container>
  );
};

export default Notepad;
