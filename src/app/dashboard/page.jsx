'use client';

import { useRouter } from 'next/navigation';
import { account, appwriteService } from '../../lib/appwrite';
import { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar'
import HeroCarousel from '../../components/Hero';
import HeroSection from '../../components/Hero';
import OurServices from '../../components/services';
import Sell from '@/components/Sell'
import Buy from '@/components/Buy'
import Experts from '@/components/Experts'
import Footer from '@/components/Footer'
import ServiceCards from '@/components/ServiceCards'
import { ProtectedRoute } from '../../components/ProtectedRout';

export default function Dashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        try {
            await appwriteService.logout();
            // Redirect to login or home page
            window.location.href = '/login';
            console.log('logout success form frontend')
        } catch (error) {
            console.error('Logout failed', error);
        }
    }


    return (
        <ProtectedRoute>
            <div className="">
                <Navbar />
                <HeroSection />
                <OurServices />
                <Sell />
                <Buy />
                <Experts />
                <ServiceCards />
                <Footer />
                {/* <button
            onClick={handleLogout}
            className="px-6 py-3 text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:bg-red-300"
            disabled={loading}
        >
            {loading ? 'Logging Out...' : 'Logout'}
        </button> */}
            </div>
        </ProtectedRoute>
    );
}
