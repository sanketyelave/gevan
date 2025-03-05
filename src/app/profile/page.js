"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Check, X, Loader2, Edit2, ArrowLeft } from 'lucide-react';
import { ProtectedRoute } from '../../components/ProtectedRout';

const Profile = () => {
    const { user, updateUserProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [formData, setFormData] = useState({
        name: '',
        userId: '',
        dob: '',
        phone: '',
        address: '',
        pincode: '',
        district: '',
        state: '',
        occupation: '',
        crops: []
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                dob: user.dob || '',
                phone: user.phone || '',
                address: user.address || '',
                pincode: user.pincode || '',
                district: user.district || '',
                state: user.state || '',
                occupation: user.occupation || '',
                crops: user.crops || []
            });
        }
    }, [user]);

    // Modify the pincode validation function
    const validatePincode = async (pincode) => {
        if (pincode.length !== 6) return false;

        try {
            const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = await response.json();

            if (data[0].Status === "Success") {
                const postOffice = data[0].PostOffice[0];
                setFormData(prev => ({
                    ...prev,
                    district: postOffice.District,
                    state: postOffice.State
                }));
                return true;
            }
            setMessage({ type: 'error', content: 'Invalid pincode' });
            return false;
        } catch (error) {
            setMessage({ type: 'error', content: 'Error validating pincode' });
            return false;
        }
    };

    // Modify the handleChange function to include pincode validation
    const handleChange = async (e) => {
        const { name, value } = e.target;

        if (name === 'pincode') {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));

            if (value.length === 6) {
                await validatePincode(value);
            }
        } else if (name === 'crops') {
            setFormData(prev => ({
                ...prev,
                crops: value.split(',').map(crop => crop.trim())
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Update handleSubmit to not revalidate pincode if it hasn't changed
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage({ type: '', content: '' });

        try {
            // Only validate pincode if it has changed
            if (formData.pincode !== user.pincode) {
                const isPincodeValid = await validatePincode(formData.pincode);
                if (!isPincodeValid) {
                    setMessage({ type: 'error', content: 'Please enter a valid pincode' });
                    setIsSubmitting(false);
                    return;
                }
            }

            // Update profile
            await updateUserProfile(user.userId, formData);
            setMessage({ type: 'success', content: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (error) {
            setMessage({ type: 'error', content: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen poppins bg-gradient-to-b from-[#F8F7F0] to-white px-4 py-8 md:py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg border border-[#E4E2D7] overflow-hidden">
                        {/* Profile Header */}
                        <div className="p-6 md:p-8 border-b border-[#E4E2D7]">
                            <div className="flex items-center justify-between space-x-4">
                                <button
                                    onClick={() => window.location.href = "/dashboard"}
                                    className="p-2 rounded-lg hover:bg-[#F8F7F0] transition-colors"
                                >
                                    <ArrowLeft className="text-[#878680] hover:text-[#1F1E17]" size={20} />
                                </button>
                                <div className="flex-1 text-center">
                                    <h1 className="text-2xl font-semibold text-[#1F1E17]">Profile Information</h1>
                                    <p className="mt-2 text-[#878680]">Manage your personal information</p>
                                </div>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className={`p-2 rounded-lg transition-colors ${isEditing
                                        ? 'bg-[#F8F7F0] text-[#878680]'
                                        : 'bg-[#4BAF47] text-white'
                                        }`}
                                >
                                    {isEditing ? <X size={20} /> : <Edit2 size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Profile Content */}
                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors disabled:bg-[#F8F7F0]"
                                    />
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                        Date of Birth
                                    </label>
                                    <input
                                        type="date"
                                        name="dob"
                                        value={formData.dob}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors disabled:bg-[#F8F7F0]"
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium cursor-none text-[#1F1E17] mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={true}
                                        className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors disabled:bg-[#F8F7F0]"
                                    />
                                </div>

                                {/* Occupation */}
                                <div>
                                    <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                        Occupation
                                    </label>
                                    <select
                                        name="occupation"
                                        value={formData.occupation}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors disabled:bg-[#F8F7F0]"
                                    >
                                        <option value="">Select occupation</option>
                                        <option value="farmer">Farmer</option>
                                        <option value="trader">Trader</option>
                                    </select>
                                </div>
                            </div>

                            {/* Address Section */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                        Address
                                    </label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors disabled:bg-[#F8F7F0] h-24"
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                            Pincode
                                        </label>
                                        <input
                                            type="text"
                                            name="pincode"
                                            value={formData.pincode}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors disabled:bg-[#F8F7F0]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                            District
                                        </label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleChange}
                                            disabled={true}
                                            className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors disabled:bg-[#F8F7F0]"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            disabled={true}
                                            className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors disabled:bg-[#F8F7F0]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Crops Section - Only show if occupation is farmer */}
                            {formData.occupation === 'farmer' && (
                                <div>
                                    <label className="block text-sm font-medium text-[#1F1E17] mb-2">
                                        Crops (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        name="crops"
                                        value={formData.crops.join(', ')}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 rounded-lg border border-[#E4E2D7] focus:border-[#4BAF47] focus:ring-2 focus:ring-[#4BAF47]/20 transition-colors disabled:bg-[#F8F7F0]"
                                        placeholder="e.g. Rice, Wheat, Cotton"
                                    />
                                </div>
                            )}

                            {/* Status Message */}
                            {message.content && (
                                <div className={`p-4 rounded-lg ${message.type === 'error'
                                    ? 'bg-red-50 text-red-700'
                                    : 'bg-[#4BAF47]/10 text-[#4BAF47]'
                                    }`}>
                                    {message.content}
                                </div>
                            )}

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex-1 px-6 py-3 rounded-lg bg-[#4BAF47] text-white font-medium hover:bg-[#4BAF47]/90 transition-colors disabled:bg-[#E4E2D7] disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                <span>Updating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Check size={20} />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setFormData({
                                                name: user.name || '',
                                                dob: user.dob || '',
                                                phone: user.phone || '',
                                                address: user.address || '',
                                                pincode: user.pincode || '',
                                                district: user.district || '',
                                                state: user.state || '',
                                                occupation: user.occupation || '',
                                                crops: user.crops || []
                                            });
                                        }}
                                        className="flex-1 px-6 py-3 rounded-lg bg-[#EEC044] text-white font-medium hover:bg-[#EEC044]/90 transition-colors flex justify-center items-center gap-2"
                                    >
                                        <X size={20} />
                                        <span>Cancel</span>
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Profile;