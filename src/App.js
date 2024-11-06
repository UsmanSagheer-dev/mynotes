
import React from 'react'; 
import { Provider } from 'react-redux';
import store from './store/store';
import './App.css';
import AppRouter from './routes/approuter/AppRouter';
import CurrentUserLoader from './components/currentuserloader/CurrentUserLoader';

 function App() {
  return (
    <Provider store={store}>
      <CurrentUserLoader /> 
      <AppRouter />
    </Provider>
  );
}
export default App;