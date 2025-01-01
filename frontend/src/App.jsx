import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar.jsx'
import ImageUpload from './components/ImageUpload.jsx';
import Footer from './components/Footer.jsx';
import InfoPage from './components/InfoPage.jsx';





function App() {
  return (
   
      <Router>
        <div>
          <Navbar />
          <Routes>
          <Route path="/" element={<ImageUpload />} />
          <Route path="/info" element={<InfoPage />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    
  );
}

export default App;