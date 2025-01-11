
import React, { createContext, useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();




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
            const response = await fetch('/api/auth/verify', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (response.ok) {
                const data =  await response.json()
                setUser(data.user)


            } else {
                localStorage.removeItem('userToken')
                setUser(null)
                navigate('/login')
            }
        } catch (error) {
            console.error('Error verifying token:' , error)
            localStorage.removeItem('userToken')
            setUser(null)
            navigate('/login')
        } finally {
            setLoading(false)
        }
      

    }

    const logout = () => {
        localStorage.removeItem('userToken')
        setUser(null)
        navigate('/login')
    }

    return (
        <AuthContext.Provider value={{ user, loading, setUser, logout}}>
            {children}
        </AuthContext.Provider>


    )

}
export const useAuth = () => useContext(AuthContext)