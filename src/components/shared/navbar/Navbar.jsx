// src/components/layout/Navbar.js
import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../store/slices/userSlice'; // Assuming logout action is in userSlice
import HomeIcon from '@mui/icons-material/Home';
import NoteIcon from '@mui/icons-material/Note';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); // Get user data from Redux state
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
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        {/* App Logo/Name */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
          Notepad App
        </Typography>

        {/* Navigation Links */}
        <Button color="inherit" startIcon={<HomeIcon />} onClick={() => navigate('/home')}>
          Home
        </Button>
        <Button color="inherit" startIcon={<NoteIcon />} onClick={() => navigate('/notes')}>
          Notes
        </Button>
        <Button color="inherit" startIcon={<AccountCircleIcon />} onClick={() => navigate('/profile')}>
          Profile
        </Button>

        {/* User Profile Section */}
        {isAuthenticated && user && (
          <Box display="flex" alignItems="center" ml={2}>
            <IconButton onClick={handleMenuClick} sx={{ p: 0 }}>
              <Avatar alt={user.displayName} src={user.photoURL} />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>Profile</MenuItem>
              <MenuItem onClick={() => { handleAuthAction(); handleMenuClose(); }}>{isAuthenticated ? 'Logout' : 'Login'}</MenuItem>
            </Menu>
          </Box>
        )}

        {/* Login/Logout button for unauthenticated users */}
        {!isAuthenticated && (
          <Button color="inherit" onClick={handleAuthAction}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
