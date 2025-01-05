import React from "react";

import { useAuth } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute (children) {
    const { Authenticated } = useAuth()

    if (Authenticated) {
        return <div>Loading...</div>
    }

    return Authenticated ? children : <Navigate to="/login" />







}