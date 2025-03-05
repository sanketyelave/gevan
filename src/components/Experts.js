
'use client';
import React, { useState } from 'react';
import { Copy, Check, Phone, Mail, ArrowRight } from 'lucide-react';
import { useRouter } from "next/router";

function Experts() {

    const experts = [
        {
            id: 1,
            name: "Dr. Sarah Johnson",
            phone: "+1 (555) 123-4567",
            email: "sarah.j@example.com",
            image: "/experts/expert3.png",
            specialty: "Agricultural Science",
            availability: "Mon - Fri"
        },
        {
            id: 2,
            name: "Prof. Michael Chen",
            phone: "+1 (555) 234-5678",
            email: "m.chen@example.com",
            image: "/experts/expert4.png",
            specialty: "Soil Analysis",
            availability: "Tue - Sat"
        },
        {
            id: 3,
            name: "Prof. Michael Chen",
            phone: "+1 (555) 234-5678",
            email: "m.chen@example.com",
            image: "/experts/expert2.png",
            specialty: "Soil Analysis",
            availability: "Tue - Sat"
        }
    ];

    const [copiedId, setCopiedId] = useState(null);
    const [activeCard, setActiveCard] = useState(null);
    const [hoveredContact, setHoveredContact] = useState(null);

    const handleCopy = (text, id, type) => {
        navigator.clipboard.writeText(text);
        setCopiedId(`${id}-${type}`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div>
            <section className="pb-16 bg-[#4BAF47] poppins relative bg-cover min-h-[90vh] bg-center">
                <div className="max-w-7xl mx-auto pt-[6rem] sm:px-6 px-4">
                    <h5 className="text-3xl md:text-4xl font-bold text-[#EEC044] mb-6 md:mb-10 caveat text-center">
                        Our Experts
                    </h5>
                    <h1 className="text-2xl md:text-4xl font-bold text-white poppins mb-6 md:mb-10 text-center">
                        Trusted Guidance for You...
                    </h1>

                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                            {experts.map((expert) => (
                                <div
                                    key={expert.id}
                                    className="relative group w-full"
                                    onMouseEnter={() => setActiveCard(expert.id)}
                                    onMouseLeave={() => setActiveCard(null)}
                                >
                                    <div className="relative overflow-hidden rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-black/5">
                                        <div className="aspect-[3/4] relative">
                                            <img
                                                src={expert.image}
                                                alt={expert.name}
                                                className="absolute inset-0 w-full h-full object-cover object-center"
                                            />

                                            {/* Base overlay for better text visibility */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                            {/* Hover overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                            {/* Content Container */}
                                            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transform translate-y-0 transition-transform duration-300">
                                                <div className="space-y-3 sm:space-y-4">
                                                    <div>
                                                        <h3 className="text-white text-lg sm:text-xl font-semibold mb-1 drop-shadow-lg">
                                                            {expert.name}
                                                        </h3>
                                                        <p className="text-gray-100 text-sm drop-shadow-lg">
                                                            {expert.specialty}
                                                        </p>
                                                        <p className="text-gray-200 text-xs mt-1 drop-shadow-lg">
                                                            Available: {expert.availability}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-col gap-2 transition-all duration-300 opacity-0 group-hover:opacity-100">
                                                        {/* Phone Button */}
                                                        <button
                                                            onMouseEnter={() => setHoveredContact('phone-' + expert.id)}
                                                            onMouseLeave={() => setHoveredContact(null)}
                                                            onClick={() => handleCopy(expert.phone, expert.id, 'phone')}
                                                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-all duration-300 px-3 sm:px-4 py-2 rounded-lg backdrop-blur-sm group/btn"
                                                        >
                                                            <Phone className="w-4 h-4 text-white" />
                                                            <span className="text-white text-sm flex-1 text-left truncate">{expert.phone}</span>
                                                            {copiedId === `${expert.id}-phone` ? (
                                                                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                                            ) : (
                                                                <Copy className="w-4 h-4 text-white opacity-0 group-hover/btn:opacity-100 transition-opacity flex-shrink-0" />
                                                            )}
                                                        </button>

                                                        {/* Email Button */}
                                                        <button
                                                            onMouseEnter={() => setHoveredContact('email-' + expert.id)}
                                                            onMouseLeave={() => setHoveredContact(null)}
                                                            onClick={() => handleCopy(expert.email, expert.id, 'email')}
                                                            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition-all duration-300 px-3 sm:px-4 py-2 rounded-lg backdrop-blur-sm group/btn"
                                                        >
                                                            <Mail className="w-4 h-4 text-white" />
                                                            <span className="text-white text-sm flex-1 text-left truncate">{expert.email}</span>
                                                            {copiedId === `${expert.id}-email` ? (
                                                                <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                                                            ) : (
                                                                <Copy className="w-4 h-4 text-white opacity-0 group-hover/btn:opacity-100 transition-opacity flex-shrink-0" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-row justify-center items-center mt-8 sm:mt-12">
                        <button
                            onClick={() => window.location.href = "/all-experts"}
                            className="group w-auto text-center px-4 sm:px-6 py-3 bg-[#4BAF47] text-white rounded-lg hover:bg-[#378034] transition-all duration-300 border-2 border-white flex items-center gap-2"
                        >
                            View all Experts
                            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Experts;