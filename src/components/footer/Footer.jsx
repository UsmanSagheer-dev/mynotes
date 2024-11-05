import React from "react";
import { Box, Typography, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";

function Footer() {
  return (
    <div>
      <Box
        sx={{
          bgcolor: "grey.900",
          color: "white",
          height: "100px",
          mt: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        <Typography variant="body1" sx={{ mb: { xs: 2, md: 0 } }}>
          © 2024 Your Notes App. All Rights Reserved.
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Link href="#" color="inherit" underline="hover">
            Privacy Policy
          </Link>
          <Link href="#" color="inherit" underline="hover">
            Terms of Service
          </Link>

          <IconButton href="#" color="inherit" size="small">
            <FacebookIcon />
          </IconButton>
          <IconButton href="#" color="inherit" size="small">
            <TwitterIcon />
          </IconButton>
          <IconButton href="#" color="inherit" size="small">
            <LinkedInIcon />
          </IconButton>
          <IconButton href="#" color="inherit" size="small">
            <InstagramIcon />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
}

export default Footer;
