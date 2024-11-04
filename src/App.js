// src/App.js
import React from 'react';
import { Provider } from 'react-redux';
import store from './store/store'; // Import the Redux store
import './App.css';
import AppRouter from './routes/approuter/AppRouter';

function App() {
  return (
    
    <Provider store={store} >
     <AppRouter/>
    </Provider>
  );
}

export default App;

