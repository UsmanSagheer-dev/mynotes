import React, { useEffect } from 'react'; 
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../../store/slices/userSlice';

const CurrentUserLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      try {
        // Parse the user data
        const parsedData = JSON.parse(userData);
        
        // Check if user exists in parsed data
        if (parsedData && parsedData.user && parsedData.user.userId) {
          const { userId } = parsedData.user;
          dispatch(getCurrentUser({ userId }));
        } else {
          console.error('User data or userId is missing in localStorage');
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    } else {
      console.log('No user data found in localStorage');
    }
  }, [dispatch]);

  return null; 
};

export default CurrentUserLoader;

