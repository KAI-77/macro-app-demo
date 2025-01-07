import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/NavBar.jsx';
import ImageUpload from './components/ImageUpload.jsx';
import Footer from './components/Footer.jsx';
import InfoPage from './components/InfoPage.jsx';
import PrivacyPolicy from './components/PrivacyPolicy.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import LoginForm from './components/auth/LoginForm.jsx';
import SignupForm from './components/auth/SignupForm.jsx';
import ProtectedRoute from './context/ProtectedRoute.jsx';
import TermsPage from './components/TermsPage.jsx';
import LandingPage from './components/LandingPage.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<SignupForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={ <PrivacyPolicy />  } />
              <Route path="/info" element={ <InfoPage />} />

              {/* Protected Routes */}
              <Route
                path="/upload"
                element={
                  <ProtectedRoute>
                    <ImageUpload />
                  </ProtectedRoute>
                }
              />
             
              

              {/* Redirect unknown routes to landing page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
