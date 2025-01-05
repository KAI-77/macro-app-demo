import React, { createContext, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate

    useEffect(() => {
        // Check if user is logged in

        const token = localStorage.getItem('userToken')
        if (token) {
        // Verify token
            verifyToken(token)

        } else {
            setLoading(false)
        }





    }, []);

    const verifyToken = async (token) => {
        try {
            const response = await fetch('http://localhost:5000/verify', {
                headers: {
                    Authorization: `Bearer ${token},`
                }
            })
            if (response.ok) {
                const data =  await response.json()
                setUser(data)


            } else {
                localStorage.removeItem('userToken')
            }
        } catch (error) {
            console.error('Error verifying token:' , error)
            localStorage.removeItem('userToken')
        }
        setLoading(false)
    };

    const logout = () => {
        localStorage.removeItem('userToken')
        setUser=(null)
        navigate('/login')
    }

    return (
        <AuthContext.Provider value={{ user, loading, setUser, logout}}>
            {children}
        </AuthContext.Provider>


    )

}
export const useAuth = () => useContext(AuthContext)