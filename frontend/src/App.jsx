import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/NavBar.jsx";
import ImageUpload from "./components/pages/ImageUpload.jsx";
import Footer from "./components/Footer.jsx";
import InfoPage from "./components/pages/InfoPage.jsx";
import PrivacyPolicy from "./components/terms/PrivacyPolicy.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import LoginForm from "./components/auth/LoginForm.jsx";
import SignupForm from "./components/auth/SignupForm.jsx";
import ProtectedRoute from "./context/ProtectedRoute.jsx";
import TermsPage from "./components/terms/TermsPage.jsx";
import LandingPage from "./components/pages/LandingPage.jsx";
import ForgotPasswordForm from "./components/auth/ForgotPasswordForm";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/register" element={<SignupForm />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/info" element={<InfoPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordForm />}
              />

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
