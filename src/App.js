// src/App.js
import React from 'react'; // This should be the only import for React
import { Provider } from 'react-redux';
import store from './store/store';
import './App.css';
import AppRouter from './routes/approuter/AppRouter';
import CurrentUserLoader from './components/currentuserloader/CurrentUserLoader';

 function App() {
  return (
    <Provider store={store}>
      <CurrentUserLoader /> {/* This component will handle fetching the user */}
      <AppRouter />
    </Provider>
  );
}
export default App;