import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  styled,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../store/slices/userSlice";
import HomeIcon from "@mui/icons-material/Home";
import NoteIcon from "@mui/icons-material/Note";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../config/firebase/firebase";

const StyledAppBar = styled(AppBar)({
  width: "100%",
  backgroundColor: "#333",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
});

const LogoTypography = styled(Typography)({
  flexGrow: 1,
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "1.5rem",
  color: "#fff",
});

const NavButton = styled(Button)({
  color: "#f5f5f5",
  margin: "0 10px",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  console.log("🚀 ~ Navbar ~ user:", user)
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const [userData, setUserData] = useState(null);
  console.log("🚀 ~ Navbar ~ userData:", userData)
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAuthAction = () => {
    if (isAuthenticated) {
      dispatch(logout());
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.userId) {
        try {
          const userDocRef = doc(db, "users", user.userId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserData(userDoc.data());
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
    <StyledAppBar position="static">
      <Toolbar>
        <LogoTypography onClick={() => navigate("/home")}>
          Smart Notes
        </LogoTypography>

        <NavButton startIcon={<HomeIcon />} onClick={() => navigate("/home")}>
          Home
        </NavButton>

        <NavButton startIcon={<NoteIcon />} onClick={() => navigate("/notes")}>
          Notes
        </NavButton>

        <NavButton
          startIcon={<AccountCircleIcon />}
          onClick={() => navigate("/profile")}
        >
          Profile
        </NavButton>

        {isAuthenticated && (
          <Box display="flex" alignItems="center" ml={2}>
            <IconButton onClick={handleMenuClick} sx={{ p: 0 }}>
              {userData && userData.imageUrl ? (
                <Avatar alt={userData.displayName} src={userData.imageUrl} />
              ) : (
                <AccountCircleIcon fontSize="large" style={{ color: "#fff" }} />
              )}
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem
                onClick={() => {
                  navigate("/profile");
                  handleMenuClose();
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleAuthAction();
                  handleMenuClose();
                }}
              >
                {isAuthenticated ? "Logout" : "Login"}
              </MenuItem>
            </Menu>
          </Box>
        )}

        {!isAuthenticated && (
          <NavButton onClick={handleAuthAction}>Login</NavButton>
        )}
      </Toolbar>
    </StyledAppBar>
  );
}

export default Navbar;
