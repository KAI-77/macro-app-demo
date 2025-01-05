import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar.jsx'
import ImageUpload from './components/ImageUpload.jsx';
import Footer from './components/Footer.jsx';
import InfoPage from './components/InfoPage.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import LoginForm from './components/auth/LoginForm.jsx';
import SignupForm from './components/auth/SignupForm';





function App() {
  return (
   
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
          <AuthProvider> 
          <Routes>
          <Route path= "/register" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<ImageUpload />} />
          <Route path="/info" element={<InfoPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          
          </Routes>
          </AuthProvider>
          </main>
          <Footer />
        </div>
      </Router>
    
  );
}

export default App;