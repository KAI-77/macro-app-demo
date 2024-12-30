import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/NavBar.jsx'
import Hero from './components/Hero.jsx';
import ImageUpload from './components/ImageUpload.jsx';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Hero/>
        <ImageUpload />
      </div>
    </Router>
  );
}

export default App;