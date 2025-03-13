"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';
import LoadingPage from './loadingPage';

export const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        // Check if authentication is still loading
        if (loading) return;

        // If no user is logged in, redirect to login
        if (!user) {
            router.push('/login');
            return;
        }

        // Check if the user is an admin
        if (user.role !== 'admin') {
            // Redirect non-admin users to dashboard or another appropriate page
            router.push('/dashboard');
            return;
        }

        // User is authenticated and is an admin
        setAuthorized(true);
    }, [user, loading, router]);

    // Show loading state while checking authorization
    if (loading || !authorized) {
        return (
            <div >
                {/* <p className="text-[#878680]">Checking permissions...</p> */}
                <LoadingPage />

                {/* <p className="text-[#878680]">Checking permissions...</p> */}
            </div>
        );
    }

    // If authorized, render the children components
    return children;
};