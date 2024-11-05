// src/routes/protectedrouter/ProtectedRoute.js

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../config/firebase/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser, clearAuth } from '../../store/slices/authSlice'; // Import clearAuth instead of clearUser

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        dispatch(setUser({ uid: user.uid, email: user.email, displayName: user.displayName })); // Update Redux
      } else {
        setIsAuthenticated(false);
        dispatch(clearAuth()); // Use clearAuth here
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading until auth state is determined
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
