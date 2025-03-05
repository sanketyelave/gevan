"use client";
import { useEffect, useState } from "react";
import { appwriteService } from "../../lib/appwrite";
import { motion } from "framer-motion";
import { Copy, MessageSquare, Briefcase, Calendar, Mail } from "lucide-react";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer'

export default function AllExperts() {
    const [experts, setExperts] = useState([]);
    const [copied, setCopied] = useState(null);

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const data = await appwriteService.getExperts();
                setExperts(data || []);
            } catch (error) {
                console.error("Error fetching experts:", error);
            }
        };
        fetchExperts();
    }, []);

    const copyToClipboard = (email) => {
        navigator.clipboard.writeText(email);
        setCopied(email);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-[#F8F7F0] py-12 mt-[5rem] poppins  flex flex-col items-center">
                {/* Title Animation */}
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
                        Meet Our Experts
                    </motion.h1>
                </div>


                <div className="grid grid-cols-1 px-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-7xl">
                    {experts.length > 0 ? (
                        experts.map((expert) => (
                            <motion.div
                                key={expert.$id}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full"
                            >
                                {/* Card */}
                                <div className="rounded-2xl shadow-lg bg-white border border-gray-200 overflow-hidden transition duration-300 hover:shadow-xl">
                                    {/* Image */}
                                    <img
                                        src={expert.image || "/default-avatar.jpg"}
                                        alt={expert.name}
                                        className="w-full h-48 object-cover"
                                    />

                                    {/* Content */}
                                    <div className="p-5">
                                        <h2 className="text-xl font-bold text-gray-800">{expert.name}</h2>

                                        {/* Specialty */}
                                        <div className="flex items-center gap-3 text-gray-600 text-sm mt-3">
                                            <Briefcase size={18} className="text-gray-500" />
                                            <span><strong className="text-[#EEC044]">Specialty:</strong> {expert.specialty}</span>
                                        </div>

                                        {/* Availability */}
                                        <div className="flex items-center gap-3 text-gray-600 text-sm mt-2">
                                            <Calendar size={18} className="" />
                                            <span><strong className="text-green-600">Availability:</strong> {expert.availability}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-between items-center gap-3 p-4 border-t border-gray-200 bg-gray-50">
                                        {/* Copy Email */}
                                        <button
                                            onClick={() => copyToClipboard(expert.email)}
                                            className="flex items-center gap-2 bg-[#EEC044] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#efcb68] transition relative"
                                        >
                                            <Mail size={18} className="text-white" />
                                            <span>Email</span>
                                            {copied === expert.email && (
                                                <span className="absolute -top-7 left-1/2 transform -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded">
                                                    Copied!
                                                </span>
                                            )}
                                        </button>

                                        {/* WhatsApp */}
                                        <a
                                            href={`https://wa.me/${expert.phone}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-[#4BAF47] text-white font-medium px-4 py-2 rounded-lg hover:bg-[#74ba72] transition"
                                        >
                                            <MessageSquare size={18} className="text-white" />
                                            <span>Chat</span>
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.p
                            className="text-gray-500 text-lg"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            No experts available at the moment.
                        </motion.p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
