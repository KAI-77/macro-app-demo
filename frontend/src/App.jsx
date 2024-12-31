import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/NavBar.jsx'
import ImageUpload from './components/ImageUpload.jsx';
import Footer from './components/Footer.jsx';




function App() {
  return (
   
      <Router>
        <div>
          <Navbar />
          <ImageUpload />
          <Footer />
        </div>
      </Router>
    
  );
}

export default App;