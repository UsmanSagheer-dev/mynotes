
import React, { useEffect } from 'react'; 
import { useDispatch } from 'react-redux';
import { getCurrentUser } from '../../store/slices/userSlice';

const CurrentUserLoader = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const { userId } = JSON.parse(userData).user;
      dispatch(getCurrentUser({ userId }));
    }
  }, [dispatch]);

  return null; 
};

export default CurrentUserLoader;
