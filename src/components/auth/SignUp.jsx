
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Card, CardContent, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { signUp } from '../../store/slices/userSlice';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState(''); 
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signupError = useSelector((state) => state.user.signupError);
  const handleImageUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await dispatch(
      signUp({ email, password, displayName, bio, address, image })
    );
    setLoading(false);

    if (result.meta.requestStatus === 'fulfilled') {
      console.log("User signed up successfully:", result.payload);
      navigate('/home'); 
    } else if (result.meta.requestStatus === 'rejected') {
      console.error("Signup failed:", result.payload);
      setError(result.payload);
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
            <TextField
              label="Bio"
              variant="outlined"
              fullWidth
              margin="normal"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              margin="normal"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button variant="contained" component="label" fullWidth sx={{ marginY: 2 }}>
              Upload Profile Image
              <input type="file" hidden onChange={handleImageUpload} />
            </Button>
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
              disabled={loading}
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
