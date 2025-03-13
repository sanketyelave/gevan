// pages/dashboard/my-offers.js
"use client";
import React, { useState, useEffect } from 'react';
import { appwriteService } from '../../lib/appwrite';
import { useAuth } from "../../context/AuthContext";
import { ProtectedRoute } from '../../components/ProtectedRout';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer'
import {
    Loader2,
    CheckCircle,
    XCircle,
    MessageSquare,
    ArrowLeft,
    Calendar,
    Clock
} from 'lucide-react';
import LoadingPage from '../../components/loadingPage';

const MyOffers = () => {
    const { user } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [responding, setResponding] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            loadProducts();
        } else {
            setLoading(false);
        }
    }, [user]);

    const loadProducts = async () => {
        try {
            if (!user) {
                setLoading(false);
                return;
            }
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
            setMessage(accepted ? 'Offer accepted successfully!' : 'Offer declined successfully!');
            loadProducts();
        } catch (error) {
            setMessage('Error processing response');
        } finally {
            setResponding(false);
        }
    };

    // Function to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Function to format time
    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <ProtectedRoute >
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
                        My Offers and History
                    </motion.h1>
                </div>
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
                                    <p className="mt-2 text-[#878680]">Review and manage offers on your products</p>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <LoadingPage />
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

                                                    {/* Offer details */}
                                                    {product.latestOffer && (
                                                        <div className="mt-2 space-y-1 text-sm">
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-[#878680]">Offered:</span>
                                                                <span className="font-medium text-[#4BAF47]">₹{product.latestOffer.offeredPrice}/{product.priceUnit}</span>
                                                            </div>

                                                            <div className="flex items-center gap-1">
                                                                <span className="text-[#878680]">Offer made:</span>
                                                                <span className="font-medium text-[#1F1E17]">
                                                                    {new Date(product.latestOffer.$createdAt).toLocaleDateString('en-IN', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric'
                                                                    })}
                                                                    {' '}
                                                                    {new Date(product.latestOffer.$createdAt).toLocaleTimeString('en-IN', {
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </span>
                                                            </div>

                                                            {product.latestOffer.responseDate && (
                                                                <div className="flex items-center gap-1">
                                                                    <span className="text-[#878680]">{product.status === 'accepted' ? 'Accepted:' : 'Declined:'}</span>
                                                                    <span className="font-medium text-[#1F1E17]">
                                                                        {new Date(product.latestOffer.responseDate).toLocaleDateString('en-IN', {
                                                                            day: 'numeric',
                                                                            month: 'short',
                                                                            year: 'numeric'
                                                                        })}
                                                                        {' '}
                                                                        {new Date(product.latestOffer.responseDate).toLocaleTimeString('en-IN', {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.status === 'offer-made'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : product.status === 'accepted'
                                                        ? 'bg-green-100 text-green-800'
                                                        : product.status === 'declined'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {product.status === 'offer-made' ? 'Offer Made' :
                                                        product.status === 'accepted' ? 'Offer Accepted' :
                                                            product.status === 'declined' ? 'Offer Declined' : product.status}
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

                                                {/* Offer Date and Time */}
                                                <div className="flex justify-between items-center pt-2 pb-2 border-t border-b border-[#E4E2D7]">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar size={16} className="text-[#878680]" />
                                                        <p className="text-sm text-[#878680]">
                                                            Offer Date: <span className="text-[#1F1E17]">{formatDate(product.latestOffer.$createdAt)}</span>
                                                        </p>
                                                    </div>

                                                    {product.latestOffer.responseDate && (
                                                        <div className="flex items-center gap-2">
                                                            <Clock size={16} className="text-[#878680]" />
                                                            <p className="text-sm text-[#878680]">
                                                                Response Time: <span className="text-[#1F1E17]">{formatTime(product.latestOffer.responseDate)}</span>
                                                            </p>
                                                        </div>
                                                    )}
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
                                                            {responding ? 'Processing...' : 'Accept Offer'}
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
                                                            {responding ? 'Processing...' : 'Decline Offer'}
                                                        </button>
                                                    </div>
                                                )}

                                                {(product.status === 'accepted' || product.status === 'declined') && (
                                                    <div className="flex items-center gap-2 pt-2">
                                                        {product.status === 'accepted' ? (
                                                            <CheckCircle className="text-green-500" size={20} />
                                                        ) : (
                                                            <XCircle className="text-red-500" size={20} />
                                                        )}
                                                        <p className="text-sm text-[#878680]">
                                                            You have {product.status === 'accepted' ? 'accepted' : 'declined'} this offer
                                                        </p>
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
            </div>

            <Footer />
        </ProtectedRoute>
    );
};

export default MyOffers;