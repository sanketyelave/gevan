// pages/admin/products.js
"use client";
import React, { useState, useEffect } from 'react';
import { appwriteService } from '../../../lib/appwrite';
import { useAuth } from "../../../context/AuthContext";
import { ProtectedRoute } from '../../../components/ProtectedRout';
import { motion } from 'framer-motion';
import {
    Loader2,
    ChevronDown,
    MessageSquare,
    Clock,
    CheckCircle,
    XCircle
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
        // <ProtectedRoute adminOnly>
        <div className="min-h-screen bg-gradient-to-b from-[#F8F7F0] to-white px-4 py-8 md:py-12">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-semibold text-[#1F1E17]">
                        Product Management
                    </h1>
                    <p className="mt-2 text-[#878680]">
                        Review and manage farmer product listings
                    </p>
                </div>

                {/* Main Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin" size={40} />
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {/* Products Table */}
                        <div className="bg-white rounded-xl shadow-lg border border-[#E4E2D7] overflow-hidden">
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
                                                        className="px-4 py-2 text-sm rounded-lg bg-[#4BAF47] text-white hover:bg-[#4BAF47]/90 transition-colors"
                                                        disabled={product.status !== 'active'}
                                                    >
                                                        Make Offer
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Offer Modal */}
                        {selectedProduct && (
                            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
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
        </div>
        // </ProtectedRoute>
    );
};

export default AdminProducts;