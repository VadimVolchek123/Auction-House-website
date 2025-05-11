import { BrowserRouter } from 'react-router-dom';
import './App.css';
import React from 'react';
import AppRouter from './components/AppRouter';
import MergedNavBar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <BrowserRouter>
      <MergedNavBar />
      <AppRouter />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
