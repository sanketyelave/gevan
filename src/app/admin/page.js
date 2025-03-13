// pages/admin/dashboard.js
"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from "../../context/AuthContext";
import { appwriteService } from '../../lib/appwrite';
import { ProtectedRoute } from '../../components/ProtectedRout';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Users, Package, Settings, ArrowRight } from 'lucide-react';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalExperts: 0,
        pendingOffers: 0,
        activeUsers: 0
    });

    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            try {
                const adminStats = await appwriteService.getAdminStats();
                console.log("Admin stats received:", adminStats); // Add this line
                setStats(adminStats);
            } catch (error) {
                console.error('Error loading admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
    }, []);

    return (
        <ProtectedRoute adminOnly>
            <Navbar />
            <div>
                <div
                    className="relative w-full h-40 flex items-center justify-center bg-cover bg-center mt-[8rem]"
                    style={{ backgroundImage: "url('/assets/title.png')" }}
                >
                    <motion.h1
                        className="text-4xl font-bold text-white bg-opacity-50 px-6 py-3 rounded-lg"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Admin Dashboard
                    </motion.h1>
                </div>

                <div className="min-h-screen bg-gradient-to-b from-[#F8F7F0] to-white px-4 py-8 md:py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Admin Welcome */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-[#1F1E17]">Welcome, Admin</h2>
                            <p className="text-[#878680] mt-2">Manage your platform resources from this dashboard</p>
                        </div>

                        {/* Admin Cards */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Manage Experts Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-xl shadow-lg border border-[#E4E2D7] overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-[#4BAF47]/10 rounded-lg">
                                            <Users className="h-6 w-6 text-[#4BAF47]" />
                                        </div>
                                        <span className="text-[#878680] text-sm">Admin Area</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#1F1E17] mb-2">Manage Experts</h3>
                                    <p className="text-[#878680] mb-6">Review, add, or remove experts from the platform</p>

                                    <button
                                        onClick={() => window.location.href = "/admin/experts"}
                                        className="w-full flex items-center justify-between bg-[#4BAF47] hover:bg-[#4BAF47]/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                                    >
                                        <span>Manage Experts</span>
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </motion.div>

                            {/* Manage Products Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: 0.1 }}
                                className="bg-white rounded-xl shadow-lg border border-[#E4E2D7] overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-[#4BAF47]/10 rounded-lg">
                                            <Package className="h-6 w-6 text-[#4BAF47]" />
                                        </div>
                                        <span className="text-[#878680] text-sm">Admin Area</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#1F1E17] mb-2">Manage Products</h3>
                                    <p className="text-[#878680] mb-6">Review, approve, or remove products from the marketplace</p>

                                    <button
                                        onClick={() => window.location.href = "/admin/products"}
                                        className="w-full flex items-center justify-between bg-[#4BAF47] hover:bg-[#4BAF47]/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                                    >
                                        <span>Manage Products</span>
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Admin Stats */}
                        <div className="mt-8 bg-white rounded-xl shadow-lg border border-[#E4E2D7] overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-[#1F1E17] mb-4">Quick Stats</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-[#F8F7F0] rounded-lg">
                                        <p className="text-[#878680] text-sm">Total Products</p>
                                        <p className="text-2xl font-semibold text-[#1F1E17]">
                                            {loading ? (
                                                <span className="inline-block w-8 h-8 rounded-full border-2 border-[#4BAF47] border-t-transparent animate-spin"></span>
                                            ) : (
                                                stats.totalProducts
                                            )}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-[#F8F7F0] rounded-lg">
                                        <p className="text-[#878680] text-sm">Total Experts</p>
                                        <p className="text-2xl font-semibold text-[#1F1E17]">
                                            {loading ? (
                                                <span className="inline-block w-8 h-8 rounded-full border-2 border-[#4BAF47] border-t-transparent animate-spin"></span>
                                            ) : (
                                                stats.totalExperts
                                            )}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-[#F8F7F0] rounded-lg">
                                        <p className="text-[#878680] text-sm">Pending Offers</p>
                                        <p className="text-2xl font-semibold text-[#1F1E17]">
                                            {loading ? (
                                                <span className="inline-block w-8 h-8 rounded-full border-2 border-[#4BAF47] border-t-transparent animate-spin"></span>
                                            ) : (
                                                stats.pendingOffers
                                            )}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-[#F8F7F0] rounded-lg">
                                        <p className="text-[#878680] text-sm">Active Users</p>
                                        <p className="text-2xl font-semibold text-[#1F1E17]">
                                            {loading ? (
                                                <span className="inline-block w-8 h-8 rounded-full border-2 border-[#4BAF47] border-t-transparent animate-spin"></span>
                                            ) : (
                                                stats.activeUsers
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Settings */}
                        <div className="mt-6">
                            <button
                                onClick={() => window.location.href = "/admin/settings"}
                                className="flex items-center text-[#878680] hover:text-[#1F1E17] transition-colors"
                            >
                                <Settings size={16} className="mr-2" />
                                <span>Admin Settings</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </ProtectedRoute>
    );
};

export default AdminDashboard;