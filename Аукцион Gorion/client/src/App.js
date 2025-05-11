import { BrowserRouter } from 'react-router-dom';
import './App.css';
import React from 'react';
import AppRouter from './components/AppRouter';
import NavBar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <AppRouter />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
