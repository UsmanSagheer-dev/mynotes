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
import { logout } from "../../../store/slices/authSlice";
import HomeIcon from "@mui/icons-material/Home";
import NoteIcon from "@mui/icons-material/Note";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

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
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
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
              {user && user.imageUrl ? (
                <Avatar alt={user.displayName} src={user.imageUrl} />
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
