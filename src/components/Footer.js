import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';

const Footer = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle newsletter submission
        setEmail('');
    };

    return (
        <footer className="bg-[#24231D] text-[#F8F7F0]" id='Contact'>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Column 1 - Logo & Description */}
                    <div className="space-y-6">
                        <div className="flex items-center">
                            <img src="/assets/logo.png" alt="Company Logo" className="h-[5rem] w-[5rem]" />
                        </div>
                        <p className="text-[#A5A49A] text-sm leading-relaxed max-w-sm">
                            We are committed to providing sustainable agricultural solutions
                            that empower farmers and nurture our planet for future generations.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-[#878680] hover:text-[#4BAF47] transition-colors duration-300">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-[#878680] hover:text-[#4BAF47] transition-colors duration-300">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-[#878680] hover:text-[#4BAF47] transition-colors duration-300">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-[#878680] hover:text-[#4BAF47] transition-colors duration-300">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Column 2 - Explore */}
                    <div>
                        <h3 className="text-[#EEC044] font-semibold text-lg mb-6">Explore</h3>
                        <ul className="space-y-4">
                            {['Home', 'About Us', 'Services', 'Products', 'Blog', 'Contact'].map((item) => (
                                <li key={item}>
                                    <a
                                        href="#"
                                        className="text-[#A5A49A] hover:text-white transition-colors duration-300 flex items-center group"
                                    >
                                        <ArrowRight className="w-4 h-4 mr-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3 - Address */}
                    <div>
                        <h3 className="text-[#EEC044] font-semibold text-lg mb-6">Our Address</h3>
                        <div className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-[#4BAF47] flex-shrink-0 mt-1" />
                                <p className="text-[#A5A49A] text-sm leading-relaxed">
                                    123 Agriculture Avenue,
                                    Green District, Earth City,
                                    State 12345
                                </p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-[#4BAF47] flex-shrink-0" />
                                <a href="tel:+1234567890" className="text-[#A5A49A] hover:text-white transition-colors duration-300">
                                    +1 (234) 567-890
                                </a>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-[#4BAF47] flex-shrink-0" />
                                <a href="mailto:info@example.com" className="text-[#A5A49A] hover:text-white transition-colors duration-300">
                                    info@example.com
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Column 4 - Newsletter */}
                    <div>
                        <h3 className="text-[#EEC044] font-semibold text-lg mb-6">Stay Updated</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 bg-[#1F1E17] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4BAF47] placeholder-[#878680]"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#4BAF47] text-white p-2 rounded-md hover:bg-[#3d8e3a] transition-colors duration-300"
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <p className="text-[#878680] text-sm">
                                Subscribe to our newsletter for updates and exclusive offers.
                            </p>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t  border-[#1F1E17]">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-[#878680] text-sm">
                            © {new Date().getFullYear()} Your Company. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-[#878680] hover:text-white text-sm transition-colors duration-300">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-[#878680] hover:text-white text-sm transition-colors duration-300">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;