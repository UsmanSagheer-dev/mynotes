import React, { useState } from "react";
import { Typography, Container, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../shared/navbar/Navbar";
import Footer from "../../footer/Footer";
import AddNoteModal from "../../notemodel/AddnoteModel";

function Home() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

      {/* Use AddNoteModal Component */}
      <AddNoteModal open={open} handleClose={handleClose} />

      <Footer />
    </Container>
  );
}

export default Home;
