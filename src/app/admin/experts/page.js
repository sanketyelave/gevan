"use client";
import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { appwriteService } from '../../../lib/appwrite';
import { ProtectedRoute } from '../../../components/ProtectedRout';

const ExpertsAdmin = () => {
    const [experts, setExperts] = useState([]);
    const [isEditing, setIsEditing] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [isAddingNew, setIsAddingNew] = useState(false);

    useEffect(() => {
        fetchExperts();
    }, []);

    const fetchExperts = async () => {
        try {
            const expertsData = await appwriteService.getExperts();
            setExperts(expertsData);
        } catch (error) {
            console.error('Error fetching experts:', error);
        }
    };

    // ✅ Handle Edit Button Click
    const handleEdit = (expert) => {
        setIsEditing(expert.$id);
        setEditForm({
            name: expert.name || "",
            email: expert.email || "",
            image: expert.image || "",
            availability: expert.availability || "", // Add availability field
            specialty: expert.specialty || "", // Add specialty field
            bio: expert.bio || "",
            phone: expert.phone || "",
        });
    };


    // ✅ Handle Update Expert
    const handleUpdate = async (id) => {
        try {
            await appwriteService.updateExpert(id, editForm);
            setIsEditing(null);
            fetchExperts(); // Refresh list after update
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
        <ProtectedRoute adminOnly>
            <div className="min-h-screen bg-[#F8F7F0] p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-[#1F1E17]">Manage Experts</h1>
                        <button
                            onClick={() => {
                                setIsAddingNew(true);
                                setEditForm({});
                            }}
                            className="bg-[#4BAF47] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#378034] transition-all"
                        >
                            <Plus size={20} />
                            Add New Expert
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Add New Expert Form */}
                        {isAddingNew && (
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <h3 className="text-xl font-semibold mb-4 text-[#1F1E17]">Add New Expert</h3>
                                <ExpertForm
                                    form={editForm}
                                    setForm={setEditForm}
                                    onSave={handleAddNew}
                                    onCancel={() => setIsAddingNew(false)}
                                    onImageUpload={handleImageUpload}
                                />
                            </div>
                        )}

                        {/* Existing Experts */}
                        {experts.map((expert) => (
                            <div key={expert.$id} className="bg-white p-6 rounded-xl shadow-lg">
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
                            </div>
                        ))}
                    </div>
                </div>
            </div></ProtectedRoute>
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