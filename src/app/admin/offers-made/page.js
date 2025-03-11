// pages/dashboard/my-offers.js
"use client";
import React, { useState, useEffect } from 'react';
import { appwriteService } from '../../../lib/appwrite';
import { useAuth } from "../../../context/AuthContext";
import { ProtectedRoute } from '../../../components/ProtectedRout';
import { motion } from 'framer-motion';
import {
    Loader2,
    CheckCircle,
    XCircle,
    MessageSquare,
    ArrowLeft
} from 'lucide-react';

const MyOffers = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responding, setResponding] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const productsWithOffers = await appwriteService.getUserProductsWithOffers(user.userId);
            setProducts(productsWithOffers);
        } catch (error) {
            console.error('Error:', error);
            setMessage('Error loading offers');
        } finally {
            setLoading(false);
        }
    };

    const handleOfferResponse = async (productId, offerId, accepted) => {
        setResponding(true);
        try {
            await appwriteService.handleOfferResponse(productId, offerId, accepted);
            setMessage(accepted ? 'Offer accepted successfully!' : 'Offer declined');
            loadProducts();
        } catch (error) {
            setMessage('Error processing response');
        } finally {
            setResponding(false);
        }
    };

    return (
        <ProtectedRoute adminOnly>
            <div className="min-h-screen bg-gradient-to-b from-[#F8F7F0] to-white px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-4">
                            <button
                                onClick={() => window.location.href = "/dashboard"}
                                className="p-2 rounded-lg hover:bg-[#F8F7F0] transition-colors"
                            >
                                <ArrowLeft className="text-[#878680] hover:text-[#1F1E17]" size={20} />
                            </button>
                            <div>
                                <h1 className="text-3xl font-semibold text-[#1F1E17]">My Offers</h1>
                                <p className="mt-2 text-[#878680]">Review and manage offers on your products</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="animate-spin" size={40} />
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {products.map((product) => (
                                <motion.div
                                    key={product.$id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-xl shadow-lg border border-[#E4E2D7] overflow-hidden"
                                >
                                    <div className="p-6 border-b border-[#E4E2D7]">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="text-xl font-semibold text-[#1F1E17]">
                                                    {product.produceName}
                                                </h2>
                                                <p className="text-[#878680]">{product.variety}</p>
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.status === 'offer-made'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : product.status === 'accepted'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.status}
                                            </span>
                                        </div>
                                    </div>

                                    {product.latestOffer && (
                                        <div className="p-6 space-y-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="text-sm text-[#878680]">Original Price</p>
                                                    <p className="text-lg font-medium text-[#1F1E17]">
                                                        ₹{product.price}/{product.priceUnit}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-[#878680]">Offered Price</p>
                                                    <p className="text-lg font-medium text-[#4BAF47]">
                                                        ₹{product.latestOffer.offeredPrice}/{product.priceUnit}
                                                    </p>
                                                </div>
                                            </div>

                                            {product.latestOffer.notes && (
                                                <div className="bg-[#F8F7F0] rounded-lg p-4">
                                                    <div className="flex items-start gap-3">
                                                        <MessageSquare className="text-[#878680] mt-1" size={20} />
                                                        <div>
                                                            <p className="text-sm font-medium text-[#1F1E17] mb-1">
                                                                Note from Admin
                                                            </p>
                                                            <p className="text-[#878680]">
                                                                {product.latestOffer.notes}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {product.status === 'offer-made' && (
                                                <div className="flex gap-4 pt-4">
                                                    <button
                                                        onClick={() => handleOfferResponse(
                                                            product.$id,
                                                            product.latestOffer.$id,
                                                            true
                                                        )}
                                                        disabled={responding}
                                                        className="flex-1 px-6 py-3 rounded-lg bg-[#4BAF47] text-white font-medium hover:bg-[#4BAF47]/90 transition-colors disabled:bg-[#E4E2D7] disabled:cursor-not-allowed"
                                                    >
                                                        Accept Offer
                                                    </button>
                                                    <button
                                                        onClick={() => handleOfferResponse(
                                                            product.$id,
                                                            product.latestOffer.$id,
                                                            false
                                                        )}
                                                        disabled={responding}
                                                        className="flex-1 px-6 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:bg-[#E4E2D7] disabled:cursor-not-allowed"
                                                    >
                                                        Decline Offer
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {products.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-[#878680]">No offers received yet</p>
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
        </ProtectedRoute>
    );
};

export default MyOffers;