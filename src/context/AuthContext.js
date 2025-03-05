"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { appwriteService } from "../lib/appwrite";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    // ✅ Fetch user data and session on app load
    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                const sessionData = await appwriteService.checkSession();
                if (sessionData) {
                    setUser(sessionData.userDetails);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user session:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // ✅ Function to login via OTP
    const loginWithOtp = async (userId, otp) => {
        try {
            const session = await appwriteService.verifyOtplogin(userId, otp);

            if (session) {
                console.log("OTP Verified! Session Created:", session);

                // ✅ Save the session ID in sessionStorage
                sessionStorage.setItem('sessionId', session.$id);

                // ✅ Fetch user details using checkSession()
                const sessionData = await appwriteService.checkSession();
                if (sessionData) {
                    setUser(sessionData.userDetails);
                    router.push("/dashboard");  // Redirect after login
                } else {
                    setError("Session retrieval failed. Please try logging in again.");
                }
            } else {
                setError("Invalid OTP. Please try again.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Login failed. Please try again.");
        }
    };


    // ✅ Function to sign up a new user
    const signupUser = async (otp, userData) => {
        try {
            const success = await appwriteService.handleOtpAndSignup(otp, userData);
            if (success) {
                const sessionData = await appwriteService.checkSession();
                if (sessionData) {
                    setUser(sessionData.userDetails);
                    router.push("/dashboard");
                }
            }
        } catch (error) {
            console.error("Signup error:", error);
        }
    };

    // ✅ Logout function
    const logout = async () => {
        try {
            await appwriteService.cleanup();
            setUser(null);
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const updateUserProfile = async (userId, userData) => {
        try {
            // Update the document in Appwrite
            const updatedUser = await appwriteService.updateUserDocument(userId, userData);

            // Update the user state with new data
            setUser(prevUser => ({
                ...prevUser,
                ...userData
            }));

            return updatedUser;
        } catch (error) {
            throw new Error('Failed to update profile: ' + error.message);
        }
    };





    return (
        <AuthContext.Provider value={{ user, setUser, loading, loginWithOtp, signupUser, logout, updateUserProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook for consuming the context
export const useAuth = () => useContext(AuthContext);

