import React, { createContext, useState, useContext, useEffect } from 'react';
import api from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [csrfToken, setCsrfToken] = useState(null);

    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            // Get CSRF token
            const csrfResponse = await api.get('/auth/csrf-token.php');
            setCsrfToken(csrfResponse.data.csrf_token);
            
            // Check if user is authenticated via httpOnly cookie
            const response = await api.get('/auth/me.php');
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.log('Not authenticated');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login.php', {
                email,
                password,
                csrf_token: csrfToken
            }, {
                withCredentials: true // Important for httpOnly cookies
            });

            if (response.data.success) {
                setUser(response.data.data.user);
                return { success: true, user: response.data.data.user };
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (userData) => {
        try {
            const response = await api.post('/auth/register.php', {
                ...userData,
                csrf_token: csrfToken
            });

            if (response.data.success) {
                return { success: true, message: response.data.message };
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout.php', {
                csrf_token: csrfToken
            }, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            // Refresh CSRF token after logout
            initializeAuth();
        }
    };

    const sendOTP = async (email, purpose = 'registration') => {
        try {
            const response = await api.post('/auth/send-otp.php', {
                email,
                purpose,
                csrf_token: csrfToken
            });

            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Failed to send OTP');
        }
    };

    const verifyOTP = async (email, otp, purpose = 'registration') => {
        try {
            const response = await api.post('/auth/verify-otp.php', {
                email,
                otp,
                purpose,
                csrf_token: csrfToken
            });

            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'OTP verification failed');
        }
    };

    const resetPassword = async (email) => {
        try {
            const response = await api.post('/auth/reset-password.php', {
                email,
                csrf_token: csrfToken
            });

            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Password reset failed');
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await api.put('/student/profile.php', {
                ...profileData,
                csrf_token: csrfToken
            }, {
                withCredentials: true
            });

            if (response.data.success) {
                setUser(response.data.data.user);
                return response.data;
            }
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Profile update failed');
        }
    };

    const value = {
        user,
        loading,
        csrfToken,
        login,
        register,
        logout,
        sendOTP,
        verifyOTP,
        resetPassword,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isInstructor: user?.role === 'instructor',
        isStudent: user?.role === 'student'
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};