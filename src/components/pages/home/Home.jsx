import React, { useEffect, useState } from "react";
import { Typography, Container, Box, Button, styled } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "../../shared/navbar/Navbar";
import Footer from "../../footer/Footer";
import AddNoteModal from "../../notemodel/AddnoteModel";
import { useSelector } from "react-redux";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebase/firebase";
import { styles } from "./homeStyles";
const GlowButton = styled(Button)(({ theme }) => ({
  "--glow-color": "rgb(217, 176, 255)",
  "--glow-spread-color": "rgba(191, 123, 255, 0.781)",
  "--enhanced-glow-color": "rgb(231, 206, 255)",
  "--btn-color": "rgb(100, 61, 136)",
  border: ".25em solid var(--glow-color)",
  padding: "1em 3em",
  color: "var(--glow-color)",
  fontSize: "15px",
  fontWeight: "bold",
  backgroundColor: "var(--btn-color)",
  borderRadius: "1em",
  outline: "none",
  boxShadow:
    "0 0 1em .25em var(--glow-color), 0 0 4em 1em var(--glow-spread-color), inset 0 0 .75em .25em var(--glow-color)",
  textShadow: "0 0 .5em var(--glow-color)",
  position: "relative",
  transition: "all 0.3s",
  width: "170px",
  "&::after": {
    pointerEvents: "none",
    content: '""',
    position: "absolute",
    top: "120%",
    left: 0,
    height: "100%",
    width: "100%",
    backgroundColor: "var(--glow-spread-color)",
    filter: "blur(2em)",
    opacity: 0.7,
    transform: "perspective(1.5em) rotateX(35deg) scale(1, .6)",
  },
  "&:hover": {
    color: "var(--btn-color)",
    backgroundColor: "var(--glow-color)",
    boxShadow:
      "0 0 1em .25em var(--glow-color), 0 0 4em 2em var(--glow-spread-color), inset 0 0 .75em .25em var(--glow-color)",
  },
  "&:active": {
    boxShadow:
      "0 0 0.6em .25em var(--glow-color), 0 0 2.5em 2em var(--glow-spread-color), inset 0 0 .5em .25em var(--glow-color)",
  },
}));

function Home() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.userId) {
        try {
          const userDocRef = doc(db, "users", user.userId);
          const userDoc = await getDoc(userDocRef);
          console.log("🚀 ~ fetchUserData ~ userDoc:", userDoc);

          if (userDoc.exists()) {
          } else {
            console.log("User document not found in Firestore");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <div style={styles.mainContainer}>
      <Container maxWidth={false} disableGutters sx={styles.container}>
        <Box sx={styles.navbar}>
          <Navbar />
        </Box>

        <Box sx={styles.header}>
          <Typography variant="h3" component="h1" gutterBottom>
            Welcome to Your Notes App!
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Manage your notes effectively with all the features you need.
          </Typography>
        </Box>

        <Box sx={styles.buttonContainer}>
          <GlowButton onClick={handleOpen}>Add New Notes</GlowButton>
        </Box>

        <AddNoteModal open={open} handleClose={handleClose} />
      </Container>

      <Footer />
    </div>
  );
}

export default Home;

