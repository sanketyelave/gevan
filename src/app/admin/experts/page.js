"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { appwriteService } from '../../../lib/appwrite';
import { ProtectedRoute } from '../../../components/ProtectedRout';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { Pencil, Trash2, Plus, Users } from 'lucide-react';

const ExpertsAdmin = () => {
    const [experts, setExperts] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExperts();
    }, []);

    const fetchExperts = async () => {
        setLoading(true);
        try {
            const expertsData = await appwriteService.getExperts();
            setExperts(expertsData);
        } catch (error) {
            console.error('Error fetching experts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (expert) => {
        setIsEditing(expert.$id);
        setEditForm({
            name: expert.name || "",
            email: expert.email || "",
            image: expert.image || "",
            availability: expert.availability || "",
            specialty: expert.specialty || "",
            bio: expert.bio || "",
            phone: expert.phone || "",
        });
    };

    const handleUpdate = async (id) => {
        try {
            await appwriteService.updateExpert(id, editForm);
            setIsEditing(null);
            fetchExperts();
        } catch (error) {
            console.error("Error updating expert:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expert?')) {
            try {
                await appwriteService.deleteExpert(id);
                fetchExperts();
            } catch (error) {
                console.error('Error deleting expert:', error);
            }
        }
    };

    const handleAddNew = async () => {
        try {
            await appwriteService.createExpert(editForm);
            setIsAddingNew(false);
            fetchExperts();
        } catch (error) {
            console.error('Error adding expert:', error);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const imageUrl = await appwriteService.uploadExpertImage(file);
                setEditForm(prev => ({ ...prev, image: imageUrl }));
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    return (
        <ProtectedRoute>
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
                        Manage Experts
                    </motion.h1>
                </div>

                <div className="min-h-screen bg-gradient-to-b from-[#F8F7F0] to-white px-4 py-8 md:py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Admin Welcome */}
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-[#1F1E17]">Experts Management</h2>
                            <p className="text-[#878680] mt-2">Review, add, or remove experts from the platform</p>
                        </div>

                        {/* Add New Expert Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-xl shadow-lg border border-[#E4E2D7] overflow-hidden hover:shadow-xl transition-shadow mb-6"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-3 bg-[#4BAF47]/10 rounded-lg">
                                        <Users className="h-6 w-6 text-[#4BAF47]" />
                                    </div>
                                    <span className="text-[#878680] text-sm">Admin Area</span>
                                </div>
                                <h3 className="text-xl font-semibold text-[#1F1E17] mb-2">Expert Management</h3>
                                <p className="text-[#878680] mb-6">Add a new expert to your platform</p>

                                <button
                                    onClick={() => {
                                        setIsAddingNew(true);
                                        setEditForm({});
                                    }}
                                    className="w-full flex items-center justify-between bg-[#4BAF47] hover:bg-[#4BAF47]/90 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                                >
                                    <span>Add New Expert</span>
                                    <Plus size={20} />
                                </button>
                            </div>
                        </motion.div>

                        {/* Add New Expert Form */}
                        {isAddingNew && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-xl shadow-lg border border-[#E4E2D7] overflow-hidden mb-6 p-6"
                            >
                                <h3 className="text-xl font-semibold mb-4 text-[#1F1E17]">Add New Expert</h3>
                                <ExpertForm
                                    form={editForm}
                                    setForm={setEditForm}
                                    onSave={handleAddNew}
                                    onCancel={() => setIsAddingNew(false)}
                                    onImageUpload={handleImageUpload}
                                />
                            </motion.div>
                        )}

                        {/* Experts List */}
                        <div className="bg-white rounded-xl shadow-lg border border-[#E4E2D7] overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-semibold text-[#1F1E17] mb-4">Current Experts</h3>

                                {loading ? (
                                    <div className="flex justify-center p-8">
                                        <span className="inline-block w-8 h-8 rounded-full border-2 border-[#4BAF47] border-t-transparent animate-spin"></span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {experts.map((expert) => (
                                            <motion.div
                                                key={expert.$id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3 }}
                                                className="bg-[#F8F7F0] p-6 rounded-xl hover:shadow-md transition-shadow"
                                            >
                                                {isEditing === expert.$id ? (
                                                    <ExpertForm
                                                        form={editForm}
                                                        setForm={setEditForm}
                                                        onSave={() => handleUpdate(expert.$id)}
                                                        onCancel={() => setIsEditing(null)}
                                                        onImageUpload={handleImageUpload}
                                                    />
                                                ) : (
                                                    <ExpertCard
                                                        expert={expert}
                                                        onEdit={() => handleEdit(expert)}
                                                        onDelete={() => handleDelete(expert.$id)}
                                                    />
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </ProtectedRoute>
    );
};

const ExpertForm = ({ form, setForm, onSave, onCancel, onImageUpload }) => (
    <div className="space-y-4">
        <input
            type="text"
            placeholder="Name"
            value={form.name || ''}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            className="w-full p-2 border border-[#878680] rounded-lg focus:outline-none focus:border-[#4BAF47]"
        />
        <input
            type="text"
            placeholder="Phone"
            value={form.phone || ''}
            onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full p-2 border border-[#878680] rounded-lg focus:outline-none focus:border-[#4BAF47]"
        />
        <input
            type="email"
            placeholder="Email"
            value={form.email || ''}
            onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-2 border border-[#878680] rounded-lg focus:outline-none focus:border-[#4BAF47]"
        />
        <input
            type="text"
            placeholder="Specialty"
            value={form.specialty || ''}
            onChange={(e) => setForm(prev => ({ ...prev, specialty: e.target.value }))}
            className="w-full p-2 border border-[#878680] rounded-lg focus:outline-none focus:border-[#4BAF47]"
        />
        <input
            type="text"
            placeholder="Availability"
            value={form.availability || ''}
            onChange={(e) => setForm(prev => ({ ...prev, availability: e.target.value }))}
            className="w-full p-2 border border-[#878680] rounded-lg focus:outline-none focus:border-[#4BAF47]"
        />
        <textarea
            placeholder="Bio"
            value={form.bio || ''}
            onChange={(e) => setForm(prev => ({ ...prev, bio: e.target.value }))}
            className="w-full p-2 border border-[#878680] rounded-lg focus:outline-none focus:border-[#4BAF47]"
            rows="3"
        />
        <input
            type="file"
            onChange={onImageUpload}
            className="w-full p-2 border border-[#878680] rounded-lg focus:outline-none focus:border-[#4BAF47]"
            accept="image/*"
        />
        <div className="flex justify-end gap-2 mt-4">
            <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border border-[#878680] text-[#1F1E17] hover:bg-[#E4E2D7] transition-all"
            >
                Cancel
            </button>
            <button
                onClick={onSave}
                className="px-4 py-2 rounded-lg bg-[#4BAF47] text-white hover:bg-[#378034] transition-all"
            >
                Save
            </button>
        </div>
    </div>
);

const ExpertCard = ({ expert, onEdit, onDelete }) => (
    <div>
        <div className="relative mb-4">
            <img
                src={expert.image}
                alt={expert.name}
                className="w-full h-48 object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2 flex gap-2">
                <button
                    onClick={onEdit}
                    className="p-2 rounded-lg bg-white/80 hover:bg-white transition-all"
                >
                    <Pencil size={16} className="text-[#1F1E17]" />
                </button>
                <button
                    onClick={onDelete}
                    className="p-2 rounded-lg bg-white/80 hover:bg-white transition-all"
                >
                    <Trash2 size={16} className="text-red-500" />
                </button>
            </div>
        </div>
        <h3 className="text-xl font-semibold text-[#1F1E17] mb-2">{expert.name}</h3>
        <p className="text-[#878680] mb-1">{expert.specialty}</p>
        <p className="text-[#878680] text-sm">Available: {expert.availability}</p>
        <div className="mt-2 space-y-1">
            <p className="text-sm text-[#878680]">{expert.phone}</p>
            <p className="text-sm text-[#878680]">{expert.email}</p>
        </div>
    </div>
);

export default ExpertsAdmin;