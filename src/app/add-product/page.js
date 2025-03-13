"use client";
import React, { useState, useContext } from 'react';
import { Client, Databases, ID } from 'appwrite';
import { COLORS } from '../../constant/theme';
import { useAuth } from "../../context/AuthContext";
import { ProtectedRoute } from '../../components/ProtectedRout';
import { motion } from 'framer-motion';
import { Copy, ChevronRight, Calendar, MapPin, ArrowLeft, Phone, Loader2 } from 'lucide-react';

const ProductForm = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        produceName: '',
        variety: '',
        harvestDate: '',
        quantity: '',
        quantityUnit: '',
        price: '',
        priceUnit: '',
        pickupLocation: '',
        remarks: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [copied, setCopied] = useState(false);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const copyNumber = () => {
        navigator.clipboard.writeText('+91 1234567890');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const client = new Client()
                .setEndpoint('https://cloud.appwrite.io/v1')
                .setProject('679e4ef1002c91e8b897');

            const databases = new Databases(client);

            // Create product document with userId field
            await databases.createDocument(
                '679e5e0c001780bf0b57', // Your database ID
                '67b0a8730016485c7db1', // Replace with your products collection ID
                ID.unique(),
                {
                    ...formData,
                    userId: user.userId, // Add userId to link product with user
                    createdAt: new Date().toISOString(),
                    status: 'active' // You can use this to track product status
                }
            );

            setMessage('Product added successfully!');
            setFormData({
                produceName: '',
                variety: '',
                harvestDate: '',
                quantity: '',
                price: '',
                pickupLocation: '',
                remarks: ''
            });
        } catch (error) {
            setMessage('Error adding product. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };


    return (
        <ProtectedRoute>
            <div className="min-h-screen poppins bg-gradient-to-b from-[#F8F7F0] to-white px-4 py-8 md:py-12">
                <div className="max-w-3xl mx-auto">

                    {/* Support Banner */}
                    <div className="bg-white rounded-lg shadow-sm border border-[#E4E2D7] p-4 mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-3">
                                <Phone className="text-[#4BAF47]" size={20} />
                                <span className="text-[#878680]">
                                    Need help? Call us at{' '}
                                    <span className="font-medium text-[#1F1E17]">+91 1234567890</span>
                                </span>
                            </div>
                            <button
                                onClick={copyNumber}
                                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-[#F8F7F0] hover:bg-[#E4E2D7] transition-colors"
                            >
                                <Copy size={16} />
                                <span>{copied ? 'Copied!' : 'Copy number'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Form Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-xl shadow-lg border border-[#E4E2D7] overflow-hidden"
                    >
                        {/* Form Header */}
                        <div className="p-6 md:p-8 border-b border-[#E4E2D7]">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => window.location.href = "/dashboard"}
                                    className="p-2 rounded-lg hover:bg-[#F8F7F0] transition-colors"
                                >
                                    <ArrowLeft className="text-[#878680] hover:text-[#1F1E17]" size={20} />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-semibold text-[#1F1E17]">Add Your Farm Product</h1>
                                    <p className="mt-2 text-[#878680]">Fill in the details of your agricultural produce</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Content */}
                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                            {/* Basic Info Section */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                        Farm Produce Name*
                                    </label>
                                    <input
                                        type="text"
                                        name="produceName"
                                        value={formData.produceName}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors"
                                        placeholder="Enter produce name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                        Variety*
                                    </label>
                                    <input
                                        type="text"
                                        name="variety"
                                        value={formData.variety}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors"
                                        placeholder="Enter variety"
                                    />
                                </div>
                            </div>

                            {/* Harvest Date */}
                            <div>
                                <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                    Harvest Date*
                                </label>
                                <input
                                    type="date"
                                    name="harvestDate"
                                    value={formData.harvestDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors"
                                />
                            </div>

                            {/* Quantity and Price Section */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                        Quantity*
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="number"
                                            name="quantity"
                                            value={formData.quantity}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors"
                                            placeholder="Amount"
                                        />
                                        <div>
                                            <select
                                                name="quantityUnit"
                                                value={formData.quantityUnit}
                                                onChange={handleChange}
                                                required
                                                className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors"
                                            >
                                                <option value="" disabled>Select Unit</option>

                                                {/* Weight Units */}
                                                <optgroup label="Weight">
                                                    <option value="kg">Kilogram (kg)</option>
                                                    <option value="g">Gram (g)</option>
                                                    <option value="mg">Milligram (mg)</option>
                                                    <option value="ton">Ton</option>
                                                    <option value="lb">Pound (lb)</option>
                                                    <option value="oz">Ounce (oz)</option>
                                                </optgroup>

                                                {/* Volume Units */}
                                                {/* <optgroup label="Volume">
                                                    <option value="l">Liter (L)</option>
                                                    <option value="ml">Milliliter (mL)</option>
                                                    <option value="gal">Gallon (gal)</option>
                                                    <option value="qt">Quart (qt)</option>
                                                    <option value="pt">Pint (pt)</option>
                                                    <option value="fl-oz">Fluid Ounce (fl oz)</option>
                                                    <option value="m3">Cubic Meter (m³)</option>
                                                </optgroup> */}

                                                {/* Length Units */}
                                                {/* <optgroup label="Length">
                                                    <option value="m">Meter (m)</option>
                                                    <option value="cm">Centimeter (cm)</option>
                                                    <option value="mm">Millimeter (mm)</option>
                                                    <option value="km">Kilometer (km)</option>
                                                    <option value="in">Inch (in)</option>
                                                    <option value="ft">Foot (ft)</option>
                                                    <option value="yd">Yard (yd)</option>
                                                    <option value="mi">Mile (mi)</option>
                                                </optgroup> */}

                                                {/* Area Units */}
                                                {/* <optgroup label="Area">
                                                    <option value="m2">Square Meter (m²)</option>
                                                    <option value="ha">Hectare (ha)</option>
                                                    <option value="acre">Acre</option>
                                                    <option value="ft2">Square Foot (ft²)</option>
                                                </optgroup> */}

                                                {/* Count Units */}
                                                {/* <optgroup label="Count">
                                                    <option value="pcs">Pieces (pcs)</option>
                                                    <option value="dz">Dozen (dz)</option>
                                                    <option value="box">Box</option>
                                                    <option value="case">Case</option>
                                                    <option value="unit">Unit</option>
                                                </optgroup> */}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                        Expected Price*
                                    </label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors"
                                            placeholder="Amount"
                                        />
                                        <input
                                            type="text"
                                            name="priceUnit"
                                            value={formData.priceUnit}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors"
                                            placeholder="Per unit"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Location & Remarks */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                        Pick-up Location*
                                    </label>
                                    <textarea
                                        name="pickupLocation"
                                        value={formData.pickupLocation}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors h-24"
                                        placeholder="Enter complete pick-up address"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                        Additional Remarks
                                    </label>
                                    <textarea
                                        name="remarks"
                                        value={formData.remarks}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors h-24"
                                        placeholder="Any special instructions or notes"
                                    />
                                </div>
                            </div>

                            {/* Status Message */}
                            {message && (
                                <div className={`p-4 rounded-lg ${message.includes('Error')
                                    ? 'bg-red-50 text-red-700'
                                    : 'bg-[#4BAF47]/10 text-[#4BAF47]'
                                    }`}>
                                    {message}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 rounded-lg bg-[#4BAF47] text-white font-medium hover:bg-[#4BAF47]/90 transition-colors disabled:bg-[#E4E2D7] disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={20} />
                                            <span>Adding Product...</span>
                                        </>
                                    ) : 'Add Product'}
                                </button>
                                {/* <button
                                    type="button"
                                    className="flex-1 px-6 py-3 rounded-lg bg-[#EEC044] text-white font-medium hover:bg-[#EEC044]/90 transition-colors"
                                >
                                    Book a Visit
                                </button> */}
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default ProductForm;

