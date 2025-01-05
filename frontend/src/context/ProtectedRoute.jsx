import React from "react";

import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute (children) {
    const { user } = useAuth()

    if (user) {
        return <div>Loading...</div>
    }

    return user ? children : <Navigate to="/login" />







}