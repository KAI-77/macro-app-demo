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
import ProtectedRoute from './context/ProtectedRoute.jsx';





function App() {
  return (
   
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
          <AuthProvider> 
          <Routes>
            // public routes
          <Route path= "/register" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
         

            // protected routes
          
          <Route path="/" element={
            <ProtectedRoute>
            <ImageUpload />
          </ProtectedRoute>
          } />

          <Route path="/info" element={
            <ProtectedRoute>
          <InfoPage />
          </ProtectedRoute>
          } />

          <Route path='/privacy' element={
            <ProtectedRoute>
              <PrivacyPolicy />
              </ProtectedRoute>
          }/>

          </Routes>
          </AuthProvider>
          </main>
          <Footer />
        </div>
      </Router>
    
  );
}

export default App;