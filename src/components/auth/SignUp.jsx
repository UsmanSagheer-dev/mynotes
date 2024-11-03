// src/components/auth/SignUp.js
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Card, CardContent, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state for signup process
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signupError = useSelector((state) => state.user.signupError);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true); // Show loading indicator
    const result = await dispatch(signUp({ email, password, displayName }));
    setLoading(false); // Hide loading indicator after signup completes

    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/home'); // Redirect to home upon successful signup
    } else if (result.meta.requestStatus === 'rejected') {
      setError(result.payload); // Set error message if signup failed
    }
  };

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Card sx={{ width: '100%', maxWidth: 400, boxShadow: 3 }}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h5" component="h1">
              Sign Up
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Create your account to get started!
            </Typography>
          </Box>
          <form onSubmit={handleSignUp}>
            <TextField
              label="Display Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {signupError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {signupError}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading} // Disable button while loading
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
          </form>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Button variant="text" onClick={() => navigate('/login')}>
                Log In
              </Button>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}

export default SignUp;
