import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, User, Menu, X, ShoppingCart, Bell, ChevronDown, Heart, Globe } from 'lucide-react';
import Image from "next/image";
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [cartCount, setCartCount] = useState(2);
    const [notificationCount, setNotificationCount] = useState(3);
    const [selectedLanguage, setSelectedLanguage] = useState('EN');
    const dropdownRef = useRef(null);

    const languages = ['EN', 'ES', 'FR', 'DE', 'CN'];
    const [showNavbar, setShowNavbar] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY.current + 10) {
                // Scrolling down → Hide Navbar
                setShowNavbar(false);
            } else if (currentScrollY < lastScrollY.current - 10) {
                // Scrolling up → Show Navbar
                setShowNavbar(true);
            }

            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);
    ;
    // Sample data
    const searchSuggestions = [
        { type: 'recent', text: 'Organic Tomatoes' },
        { type: 'popular', text: 'Fresh Dairy Products' },
        { type: 'category', text: 'Grains & Pulses' },
        { type: 'product', text: 'Basmati Rice' },
        { type: 'trending', text: 'Cold-Pressed Oils' },
        { type: 'deal', text: 'Bulk Purchase Discounts' },
    ];

    const categories = {
        "Admin": ['admin/experts', 'admin/products'],
        "User": ['add-product', 'login', 'offers-made', 'profile'],
        "Experts": ['all-experts'],

    };


    const searchRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setIsSearchFocused(false);
            }
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleClickOutside = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setIsSearchFocused(false);
        }
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setActiveDropdown(null);
        }
    };
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getIconForSuggestionType = (type) => {
        switch (type) {
            case 'recent': return '🕒';
            case 'popular': return '🔥';
            case 'category': return '📂';
            case 'product': return '📦';
            case 'trending': return '📈';
            case 'deal': return '🏷️';
            default: return '🔍';
        }
    };

    return (
        <div className={`fixed top-0 left-0 z-20 w-full bg-white shadow-md transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"
            }`}>
            <div className='relative h-full w-full'>
                <div className="w-full h-[2px] flex">
                    <div className="flex-1 bg-[#4BAF47]"></div>
                    <div className="flex-1 bg-[#C5CE38]"></div>
                    <div className="flex-1 bg-[#EEC044]"></div>
                </div>
                <nav className="bg-[#f7f6f0] font-sans h-full w-full">
                    <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
                .font-sans {
                    font-family: 'Poppins', system-ui, -apple-system, sans-serif;
                }
            `}</style>
                    <div className="w-full mx-auto z-20 ">
                        {/* Upper section */}
                        <div className="flex static bg-[#fff] items-center justify-between w-full h-20 px-4">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <div className="relative h-12 w-12 md:ml-8 ml:4 rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-200 ">
                                    <Image
                                        src="/assets/logo.png"
                                        alt="Logo"
                                        layout="fill"
                                        objectFit="contain"
                                        priority
                                        className="hover:opacity-90 hover:cursor-pointer transition-opacity duration-200"
                                    />
                                </div>
                            </div>

                            {/* Search bar - hidden on mobile */}
                            <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
                                <div className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className={`h-5 w-5 ${isSearchFocused ? 'text-[#4BAF47]' : 'text-[#878680]'}`} />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-3 border-2 border-[#C5CE38] rounded-xl leading-5 bg-[#fff] placeholder-[#878680] focus:outline-none focus:ring-2 focus:ring-[#C5CE38] focus:border-[#4BAF47] transition-all duration-200"
                                        placeholder="Search products, categories, brands..."
                                        value={searchValue}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        onFocus={() => setIsSearchFocused(true)}
                                    />
                                    {searchValue && (
                                        <button
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setSearchValue('')}
                                        >
                                            <X className="h-5 w-5 text-[#878680] hover:text-[#1F1E17]" />
                                        </button>
                                    )}
                                </div>

                                {/* Enhanced search suggestions popup */}
                                {isSearchFocused && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFFFF] rounded-xl shadow-lg border border-[#E4E2D7] py-2 z-50">
                                        <div className="max-h-96 overflow-y-auto">
                                            {searchSuggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    className="w-full px-4 py-3 text-left hover:bg-[#E4E2D7] flex items-center space-x-3 transition-colors duration-150 group"
                                                >
                                                    <span className="text-lg text-[#4BAF47] group-hover:text-[#1F1E17]">
                                                        {getIconForSuggestionType(suggestion.type)}
                                                    </span>
                                                    <div className="flex flex-col">
                                                        <span className="text-[#1F1E17] font-medium group-hover:text-[#4BAF47]">{suggestion.text}</span>
                                                        <span className="text-xs text-[#878680] capitalize">{suggestion.type}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right icons */}
                            <div className="flex items-center space-x-2 md:space-x-4">
                                <button className="p-2 rounded-full hover:bg-[#E4E2D7] transition-colors duration-200 flex items-center group">
                                    <MapPin className="h-6 w-6 text-[#4BAF47] group-hover:text-[#4BAF47]" />
                                    <span className="ml-1 text-sm font-medium text-[#1F1E17] group-hover:text-[#4BAF47] hidden lg:block">Location</span>
                                </button>

                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        className="p-2 rounded-full hover:bg-[#E4E2D7] transition-colors duration-200 flex items-center group"
                                        onClick={() => setActiveDropdown(activeDropdown === 'language' ? null : 'language')}
                                    >
                                        <Globe className="h-6 w-6 text-[#4BAF47] group-hover:text-[#4BAF47]" />
                                        <span className="ml-1 text-sm font-medium hidden lg:block text-[#1F1E17] group-hover:text-[#4BAF47]">{selectedLanguage}</span>
                                    </button>

                                    {activeDropdown === 'language' && (
                                        <div className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] rounded-xl shadow-lg py-2 z-50 border border-[#E4E2D7]">
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang}
                                                    className="w-full px-4 py-2 text-left hover:bg-[#E4E2D7] text-[#1F1E17] hover:text-[#4BAF47] transition-colors duration-200"
                                                    onClick={() => {
                                                        setSelectedLanguage(lang);
                                                        setActiveDropdown(null);
                                                    }}
                                                >
                                                    {lang}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <button className="p-2 rounded-full hover:bg-[#E4E2D7] transition-colors duration-200 relative group">
                                    <ShoppingCart className="h-6 w-6 text-[#4BAF47] group-hover:text-[#4BAF47]" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#C5CE38] rounded-full text-[#1F1E17] text-xs flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>

                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        className="p-2 rounded-full hover:bg-[#E4E2D7] transition-colors duration-200 group"
                                        onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
                                    >
                                        <User className="h-6 w-6 text-[#4BAF47] group-hover:text-[#1F1E17]" />
                                    </button>

                                    {activeDropdown === 'profile' && (
                                        <div className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] rounded-xl shadow-lg py-2 z-50 border border-[#E4E2D7]">
                                            <button className="w-full px-4 py-2 text-left hover:bg-[#E4E2D7] text-[#1F1E17] hover:text-[#4BAF47] transition-colors duration-200">My Farm</button>
                                            <button className="w-full px-4 py-2 text-left hover:bg-[#E4E2D7] text-[#1F1E17] hover:text-[#4BAF47] transition-colors duration-200">Listed Products</button>
                                            <button className="w-full px-4 py-2 text-left hover:bg-[#E4E2D7] text-[#1F1E17] hover:text-[#4BAF47] transition-colors duration-200">Sales History</button>
                                            <button className="w-full px-4 py-2 text-left hover:bg-[#E4E2D7] text-[#1F1E17] hover:text-[#4BAF47] transition-colors duration-200">Settings</button>
                                        </div>
                                    )}
                                </div>

                                {/* Mobile menu button */}
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="p-2 rounded-full hover:bg-[#E4E2D7] transition-colors duration-200 md:hidden group"
                                >
                                    {isOpen ?
                                        <X className="h-6 w-6 text-[#1F1E17] group-hover:text-[#4BAF47]" /> :
                                        <Menu className="h-6 w-6 text-[#1F1E17] group-hover:text-[#4BAF47]" />
                                    }
                                </button>
                            </div>
                        </div>

                        {/* Mobile search bar */}
                        <div className="md:hidden py-3 px-4" ref={searchRef}>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-[#878680]" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-3 border-2 border-[#C5CE38] rounded-xl leading-5 bg-[#fff] placeholder-[#878680] focus:outline-none focus:ring-2 focus:ring-[#C5CE38] focus:border-[#4BAF47] transition-all duration-200"
                                    placeholder="Search..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Navigation links - desktop */}
                        <div className="hidden md:block py-2 border-t border-[#E4E2D7]">
                            <div className="flex items-center justify-center space-x-8">
                                {Object.keys(categories).map((category) => (
                                    <div key={category} className="relative justify-center group" ref={dropdownRef}>
                                        <button
                                            className="text-[#1F1E17] hover:text-[#8B5E3C] font-extrabold px-3 py-2 text-sm transition-colors duration-200 flex items-center"
                                            onClick={() => setActiveDropdown(activeDropdown === category ? null : category)}
                                        >
                                            {category}
                                            <ChevronDown className="ml-1 h-4 w-4 text-[#878680] font-medium group-hover:text-[#8B5E3C]" />
                                        </button>

                                        {/* Dropdown menu */}
                                        {activeDropdown === category && (
                                            <div className="absolute left-0 mt-2 w-48 bg-[#F8F7F0] rounded-xl shadow-lg py-2 z-50 border border-[#E4E2D7]">
                                                {categories[category].map((subCategory) => (
                                                    <a
                                                        key={subCategory}
                                                        href={`/${subCategory}`}
                                                        className="block px-4 py-2 text-sm text-[#1F1E17] hover:bg-[#E4E2D7] hover:text-[#8B5E3C] transition-colors duration-150"
                                                    >
                                                        {subCategory}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile menu */}
                        <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-[#E4E2D7]">
                                {/* Location in mobile menu */}
                                <button className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-[#1F1E17] hover:text-[#4BAF47] hover:bg-[#E4E2D7] transition-colors duration-200">
                                    <MapPin className="h-5 w-5 mr-2 text-[#4BAF47]" />
                                    Select Location
                                </button>

                                {/* Categories in mobile menu */}
                                {Object.entries(categories).map(([category, subCategories]) => (
                                    <div key={category} className="space-y-1">
                                        <button
                                            className="w-full flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-[#1F1E17] hover:text-[#4BAF47] hover:bg-[#E4E2D7] transition-colors duration-200"
                                            onClick={() => setActiveDropdown(activeDropdown === category ? null : category)}
                                        >
                                            {category}
                                            <ChevronDown className={`h-4 w-4 transform transition-transform duration-200 ${activeDropdown === category ? 'rotate-180' : ''} text-[#878680]`} />
                                        </button>

                                        {activeDropdown === category && (
                                            <div className="pl-4 space-y-1">
                                                {subCategories.map((subCategory) => (
                                                    <a
                                                        key={subCategory}
                                                        href={`/${subCategory}`}
                                                        className="block px-3 py-2 rounded-md text-sm text-[#1F1E17] hover:text-[#4BAF47] hover:bg-[#E4E2D7] transition-colors duration-200"
                                                    >
                                                        {subCategory}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* User profile in mobile menu */}
                                <button className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-[#1F1E17] hover:text-[#4BAF47] hover:bg-[#E4E2D7] transition-colors duration-200">
                                    <User className="h-5 w-5 mr-2 text-[#4BAF47]" />
                                    My Account
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="absolute bottom-[-1.9rem] left-0 w-full h-[4rem] z-[-1]">
                        <Image src="/assets/nav.png" alt="Farmland Illustration" layout="fill" objectFit="cover" />
                    </div>

                </nav>

            </div>
        </div>
    );
};

export default Navbar;