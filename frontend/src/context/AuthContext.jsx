import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();


    const standardizeUserData = (userData) => {
        return {
            id: userData.id || userData._id || userData.googleId,
            name: userData.name || userData.displayName,
            email: userData.email,
            // Add any other fields you want to standardize
            avatar: userData.avatar || userData.picture, // For Google auth profile picture
            provider: userData.provider || 'local' // 'local' for regular auth, 'google' for Google auth
        };
    };


    const checkAuth = async () => {
        const token = localStorage.getItem('userToken')
        if (token) {
            await verifyToken(token)
        } else {
            setUser(null)
            setLoading(false)
        }
    }

    useEffect(() => {
        checkAuth()
    }, [])



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
                setUser(standardizeUserData(data.user))

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

    const login = async (token, userData) => {
        console.log('UserData:', userData)
        localStorage.setItem('userToken', token)
        setUser(standardizeUserData(userData))
    }

    const logout = () => {
        localStorage.removeItem('userToken')
        setUser(null)
        navigate('/login')
    }

    return (
        <AuthContext.Provider value={{ user, loading, setUser, logout, login, checkAuth}}>
            {!loading && children}
        </AuthContext.Provider>


    )

}
export const useAuth = () => useContext(AuthContext)