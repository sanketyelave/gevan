// pages/admin/products.js
"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { appwriteService } from '../../../lib/appwrite';
import { useAuth } from "../../../context/AuthContext";
import { ProtectedRoute } from '../../../components/ProtectedRout';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import {
    Package,
    Loader2,
    ChevronDown,
    MessageSquare,
    Clock,
    CheckCircle,
    XCircle,
    ArrowRight
} from 'lucide-react';

const AdminProducts = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [offerDetails, setOfferDetails] = useState({
        price: '',
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const fetchedProducts = await appwriteService.getAllProducts();
            setProducts(fetchedProducts);
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error loading products');
        } finally {
            setLoading(false);
        }
    };

    const handleMakeOffer = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await appwriteService.makeOffer(
                selectedProduct.$id,
                user.userId,
                offerDetails
            );
            setMessage('Offer made successfully!');
            loadProducts(); // Refresh products list
            setSelectedProduct(null);
            setOfferDetails({ price: '', notes: '' });
        } catch (error) {
            setMessage('Error making offer');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            'active': 'bg-blue-100 text-blue-800',
            'offer-made': 'bg-yellow-100 text-yellow-800',
            'accepted': 'bg-green-100 text-green-800',
            'declined': 'bg-red-100 text-red-800'
        };
        return badges[status] || 'bg-gray-100 text-gray-800';
    };

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
                        Product Management
                    </motion.h1>
                </div>

                <div className="min-h-screen bg-gradient-to-b from-[#F8F7F0] to-white px-4 py-8 md:py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Admin Welcome */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-[#1F1E17]">Manage Products</h2>
                            <p className="text-[#878680] mt-2">Review and manage farmer product listings</p>
                        </div>

                        {/* Products Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-xl shadow-lg border border-[#E4E2D7] overflow-hidden mb-8"
                        >
                            <div className="p-6 border-b border-[#E4E2D7]">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-[#4BAF47]/10 rounded-lg">
                                        <Package className="h-6 w-6 text-[#4BAF47]" />
                                    </div>
                                    <span className="text-[#878680] text-sm">Admin Area</span>
                                </div>
                                <h3 className="text-xl font-semibold text-[#1F1E17]">Product Listings</h3>
                                <p className="text-[#878680] mt-2">Manage all products from farmers on the platform</p>
                            </div>

                            {loading ? (
                                <div className="flex justify-center items-center h-64">
                                    <span className="inline-block w-8 h-8 rounded-full border-2 border-[#4BAF47] border-t-transparent animate-spin"></span>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#F8F7F0]">
                                            <tr>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-[#1F1E17]">Product</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-[#1F1E17]">Farmer</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-[#1F1E17]">Quantity</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-[#1F1E17]">Asked Price</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-[#1F1E17]">Status</th>
                                                <th className="px-6 py-4 text-left text-sm font-medium text-[#1F1E17]">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E4E2D7]">
                                            {products.map((product) => (
                                                <tr key={product.$id} className="hover:bg-[#F8F7F0]/50">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-medium text-[#1F1E17]">{product.produceName}</p>
                                                            <p className="text-sm text-[#878680]">{product.variety}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-[#1F1E17]">
                                                        {product.userId}
                                                    </td>
                                                    <td className="px-6 py-4 text-[#1F1E17]">
                                                        {product.quantity} {product.quantityUnit}
                                                    </td>
                                                    <td className="px-6 py-4 text-[#1F1E17]">
                                                        ₹{product.price}/{product.priceUnit}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}>
                                                            {product.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => setSelectedProduct(product)}
                                                            className="px-4 py-2 text-sm rounded-lg bg-[#4BAF47] text-white hover:bg-[#4BAF47]/90 transition-colors flex items-center"
                                                            disabled={product.status !== 'active'}
                                                        >
                                                            <span>Make Offer</span>
                                                            <ArrowRight size={16} className="ml-2" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </motion.div>

                        {/* Quick Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                            className="bg-white rounded-xl shadow-lg border border-[#E4E2D7] overflow-hidden"
                        >
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-[#1F1E17] mb-4">Product Statistics</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-4 bg-[#F8F7F0] rounded-lg">
                                        <p className="text-[#878680] text-sm">Active Products</p>
                                        <p className="text-2xl font-semibold text-[#1F1E17]">
                                            {loading ? (
                                                <span className="inline-block w-8 h-8 rounded-full border-2 border-[#4BAF47] border-t-transparent animate-spin"></span>
                                            ) : (
                                                products.filter(p => p.status === 'active').length
                                            )}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-[#F8F7F0] rounded-lg">
                                        <p className="text-[#878680] text-sm">Offers Made</p>
                                        <p className="text-2xl font-semibold text-[#1F1E17]">
                                            {loading ? (
                                                <span className="inline-block w-8 h-8 rounded-full border-2 border-[#4BAF47] border-t-transparent animate-spin"></span>
                                            ) : (
                                                products.filter(p => p.status === 'offer-made').length
                                            )}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-[#F8F7F0] rounded-lg">
                                        <p className="text-[#878680] text-sm">Accepted</p>
                                        <p className="text-2xl font-semibold text-[#1F1E17]">
                                            {loading ? (
                                                <span className="inline-block w-8 h-8 rounded-full border-2 border-[#4BAF47] border-t-transparent animate-spin"></span>
                                            ) : (
                                                products.filter(p => p.status === 'accepted').length
                                            )}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-[#F8F7F0] rounded-lg">
                                        <p className="text-[#878680] text-sm">Declined</p>
                                        <p className="text-2xl font-semibold text-[#1F1E17]">
                                            {loading ? (
                                                <span className="inline-block w-8 h-8 rounded-full border-2 border-[#4BAF47] border-t-transparent animate-spin"></span>
                                            ) : (
                                                products.filter(p => p.status === 'declined').length
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Back to Dashboard Button */}
                        <div className="mt-6">
                            <button
                                onClick={() => window.location.href = "/admin/dashboard"}
                                className="flex items-center text-[#878680] hover:text-[#1F1E17] transition-colors"
                            >
                                <ArrowRight size={16} className="mr-2 transform rotate-180" />
                                <span>Back to Dashboard</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Offer Modal */}
                {selectedProduct && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        >
                            <div className="p-6 border-b border-[#E4E2D7]">
                                <h2 className="text-xl font-semibold text-[#1F1E17]">
                                    Make an Offer
                                </h2>
                                <p className="mt-2 text-[#878680]">
                                    {selectedProduct.produceName} - {selectedProduct.variety}
                                </p>
                            </div>

                            <form onSubmit={handleMakeOffer} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                        Offer Price (per {selectedProduct.priceUnit})
                                    </label>
                                    <input
                                        type="number"
                                        value={offerDetails.price}
                                        onChange={(e) => setOfferDetails(prev => ({
                                            ...prev,
                                            price: e.target.value
                                        }))}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors"
                                        placeholder="Enter your offer price"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                        Notes for Farmer
                                    </label>
                                    <textarea
                                        value={offerDetails.notes}
                                        onChange={(e) => setOfferDetails(prev => ({
                                            ...prev,
                                            notes: e.target.value
                                        }))}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors h-32"
                                        placeholder="Explain your offer and any additional terms"
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex-1 px-6 py-3 rounded-lg bg-[#4BAF47] text-white font-medium hover:bg-[#4BAF47]/90 transition-colors disabled:bg-[#E4E2D7] disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                    >
                                        {submitting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                <span>Submitting Offer...</span>
                                            </>
                                        ) : 'Submit Offer'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedProduct(null)}
                                        className="flex-1 px-6 py-3 rounded-lg bg-[#F8F7F0] text-[#1F1E17] font-medium hover:bg-[#E4E2D7] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* Status Message */}
                {message && (
                    <div className={`fixed bottom-4 right-4 p-4 rounded-lg ${message.includes('Error')
                        ? 'bg-red-50 text-red-700'
                        : 'bg-[#4BAF47]/10 text-[#4BAF47]'
                        }`}>
                        {message}
                    </div>
                )}
            </div>
            <Footer />
        </ProtectedRoute>
    );
};

export default AdminProducts;