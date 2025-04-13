import { BrowserRouter } from 'react-router-dom';
import './App.css';
import React from 'react';
import AppRouter from './components/AppRouter';
import NavBar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <NavBar/>
      <AppRouter/>
    </BrowserRouter>
  );
}

export default App;