import React from 'react';
import { ArrowRight, Microscope, Biohazard } from 'lucide-react';

const ServiceCards = () => {
    return (
        <section className="bg-[#F8F7F0] py-16 px-4 sm:px-6 lg:px-8" id='Our '>
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl caveat font-bold text-[#24231D] mb-4">
                        Some more from us...
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                        <span className="w-8 h-[2px] bg-[#4BAF47]" />
                        <span className="w-3 h-[2px] bg-[#EEC044]" />
                        <span className="w-8 h-[2px] bg-[#4BAF47]" />
                    </div>
                </div>

                {/* Cards Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Crop Doctor Card */}
                    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="aspect-[4/3] relative overflow-hidden">
                            <div className="absolute inset-0 bg-[#4BAF47]/10 group-hover:bg-[#4BAF47]/20 transition-colors duration-300" />
                            <img
                                src="/assets/cropdoctor.jpg"
                                alt="Crop Doctor"
                                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4 bg-[#4BAF47] text-white p-2 rounded-full">
                                <Microscope className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-[#24231D] mb-3 group-hover:text-[#4BAF47] transition-colors duration-300">
                                Crop Doctor
                            </h3>
                            <p className="text-[#878680] mb-6">
                                Expert diagnosis and treatment recommendations for your crops.
                                Get personalized solutions for optimal plant health and growth.
                            </p>
                            <button className="group/btn flex items-center gap-2 text-[#4BAF47] font-semibold hover:text-[#3d8e3a] transition-colors duration-300">
                                Learn More
                                <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Decorative Corner */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#4BAF47]/10 transform rotate-45 translate-x-8 -translate-y-8 group-hover:bg-[#4BAF47]/20 transition-colors duration-300" />
                    </div>

                    {/* Diseases Card */}
                    <div className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="aspect-[4/3] relative overflow-hidden">
                            <div className="absolute inset-0 bg-[#EEC044]/10 group-hover:bg-[#EEC044]/20 transition-colors duration-300" />
                            <img
                                src="/assets/cropdoctor.jpg"
                                alt="Disease Control"
                                className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4 bg-[#EEC044] text-white p-2 rounded-full">
                                <Biohazard className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-[#24231D] mb-3 group-hover:text-[#EEC044] transition-colors duration-300">
                                Disease Control
                            </h3>
                            <p className="text-[#878680] mb-6">
                                Comprehensive disease management solutions to protect your crops.
                                Early detection and effective treatment strategies.
                            </p>
                            <button className="group/btn flex items-center gap-2 text-[#EEC044] font-semibold hover:text-[#d4aa3d] transition-colors duration-300">
                                Learn More
                                <ArrowRight className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Decorative Corner */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-[#EEC044]/10 transform rotate-45 translate-x-8 -translate-y-8 group-hover:bg-[#EEC044]/20 transition-colors duration-300" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ServiceCards;