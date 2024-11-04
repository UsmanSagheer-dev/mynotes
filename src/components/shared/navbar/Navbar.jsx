import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../store/slices/userSlice';
import HomeIcon from '@mui/icons-material/Home';
import NoteIcon from '@mui/icons-material/Note';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { doc, getDoc } from 'firebase/firestore'; // Import Firestore methods
import { db } from '../../../config/firebase/firebase';

function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); // Get the full user object from Redux
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  const [userData, setUserData] = useState(null); // State to store fetched user data
  const [anchorEl, setAnchorEl] = useState(null);

  // Handle menu actions
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

  // Fetch user data from Firestore on component mount if the user is logged in
  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.userId) {
        try {
          // Fetch the user document from Firestore
          const userDocRef = doc(db, 'users', user.userId);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserData(userDoc.data()); // Store user data (including imageUrl) in local state
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
    <AppBar position="static" color="primary">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          onClick={() => navigate('/home')}
          style={{ cursor: 'pointer' }}
        >
          Notepad App
        </Typography>

        <Button color="inherit" startIcon={<HomeIcon />} onClick={() => navigate('/home')}>
          Home
        </Button>

        <Button color="inherit" startIcon={<NoteIcon />} onClick={() => navigate('/notes')}>
          Notes
        </Button>

        <Button color="inherit" startIcon={<AccountCircleIcon />} onClick={() => navigate('/profile')}>
          Profile
        </Button>

        {isAuthenticated && (
          <Box display="flex" alignItems="center" ml={2}>
            <IconButton onClick={handleMenuClick} sx={{ p: 0 }}>
              {userData && userData.imageUrl ? (
                <Avatar alt={userData.displayName} src={userData.imageUrl} />
              ) : (
                <AccountCircleIcon fontSize="large" />
              )}
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem
                onClick={() => {
                  navigate('/profile');
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
                {isAuthenticated ? 'Logout' : 'Login'}
              </MenuItem>
            </Menu>
          </Box>
        )}

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
