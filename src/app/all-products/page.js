"use client";
import React, { useState, useEffect } from 'react';
import { appwriteService } from '../../lib/appwrite';
import { motion } from 'framer-motion';
import { Loader2, MapPin, Calendar, AlertCircle } from 'lucide-react';
// import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingPage from '../../components/loadingPage';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer'

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const verifiedProducts = await appwriteService.getVerifiedProducts();
            setProducts(verifiedProducts);
            setError('');
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to load products. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <LoadingPage />
            </div>
        );
    }

    return (

        <div>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-[#F8F7F0] to-white mt-[5rem] poppins py-8 md:py-12">
                <div
                    className="relative w-full h-40 flex items-center justify-center bg-cover bg-center mb-8"
                    style={{ backgroundImage: "url('/assets/title.png')" }} // Change to your image path
                >
                    <motion.h1
                        className="text-4xl font-bold text-white  bg-opacity-50 px-6 py-3 rounded-lg"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Products we have bought till now
                    </motion.h1>
                </div>
                <div className="max-w-7xl mx-auto px-12">
                    {/* Header */}
                    <div className="mb-8 text-center">
                        {/* <h1 className="text-4xl font-semibold text-[#1F1E17]">
                            Available Farm Products
                        </h1>
                        <p className="mt-2 text-[#878680]">
                            Browse our selection of verified farm products
                        </p> */}
                    </div>

                    {/* Error State */}
                    {/* {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )} */}

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <motion.div
                                key={product.$id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-xl shadow-lg border border-[#E4E2D7] overflow-hidden hover:shadow-xl transition-shadow"
                            >
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-[#1F1E17] mb-1">
                                        {product.produceName}
                                    </h2>
                                    <p className="text-[#878680] mb-4">{product.variety}</p>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-[#878680]">
                                            <Calendar size={16} />
                                            <span>Harvested: {new Date(product.harvestDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[#878680]">
                                            <MapPin size={16} />
                                            <span>{product.pickupLocation}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-[#E4E2D7]">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <p className="text-sm text-[#878680]">Quantity Available</p>
                                                <p className="text-lg font-medium text-[#1F1E17]">
                                                    {product.quantity} {product.quantityUnit}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-[#878680]">Price</p>
                                                <p className="text-lg font-medium text-[#4BAF47]">
                                                    ₹{product.price}/{product.priceUnit}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        {/* Empty State */}
                        {!loading && products.length === 0 && (
                            <div className="col-span-full text-center py-12">
                                <div className="max-w-md mx-auto">
                                    <AlertCircle className="mx-auto h-12 w-12 text-[#878680] mb-4" />
                                    <h3 className="text-lg font-medium text-[#1F1E17] mb-2">
                                        No Products Available
                                    </h3>
                                    <p className="text-[#878680]">
                                        There are currently no verified products available. Please check back later.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AllProducts;