import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Search, MapPin, User, Menu, X, ShoppingCart, Bell, ChevronDown, Heart, Globe, Clock, Star, Folder, Package, TrendingUp, Tag, History } from 'lucide-react';
import Image from "next/image";
import { Query } from 'appwrite';
const Navbar = () => {
    // At the top of your component, update the router declaration:


    const [isOpen, setIsOpen] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [cartCount, setCartCount] = useState(0);
    const [notificationCount, setNotificationCount] = useState(3);
    const [selectedLanguage, setSelectedLanguage] = useState('EN');
    const dropdownRef = useRef(null);
    // Add these new state variables
    const [isSearching, setIsSearching] = useState(false);
    const [searchError, setSearchError] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const languages = ['ENGLISH', 'HINDI'];
    const [showNavbar, setShowNavbar] = useState(true);
    const lastScrollY = useRef(0);
    const searchRef = useRef(null);

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
        { type: '', text: '--No Suggestions Found--' },
        // { type: '', text: 'profile' },
        // { type: '', text: 'all-experts' },
        // { type: '', text: 'add-product' },
        // { type: '', text: 'offers-made' },
        // { type: '', text: 'Bulk Purchase Discounts' },
    ];
    // Available routes - update this with your actual available routes
    const availableRoutes = [
        '/products',
        '/home',
        '/dashboard',
        '/profile',
        '/experts',
        '/admin/experts',
        '/admin/products',
        '/add-product',
        '/login',
        '/offers-made'
    ];

    // Function to handle search submission
    const handleSearchSubmit = async (e) => {
        if (e) e.preventDefault();
        console.log('click')
        if (!searchValue.trim()) {
            setIsSearchFocused(false);
            return;
        }

        setIsSearching(true);
        setSearchError('');

        try {
            // 1. Check if it's a direct route match
            const cleanQuery = searchValue.toLowerCase().trim();
            const routeMatch = availableRoutes.find(route => {
                // Remove leading slash for comparison if present
                const routePath = route.startsWith('/') ? route.substring(1) : route;
                return routePath.toLowerCase() === cleanQuery || route.toLowerCase() === `/${cleanQuery}`;
            });

            if (routeMatch) {
                // Format the route path correctly
                const formattedRoute = routeMatch.startsWith('/') ? routeMatch : `/${routeMatch}`;

                // Use window.location for navigation to avoid router issues
                window.location.href = formattedRoute;

                // Clear search and UI state
                setSearchValue('');
                setIsSearchFocused(false);
                setIsSearching(false);
                return;
            }



            // 2. Check if it's a product
            const products = await appwriteService.databases.listDocuments(
                appwriteService.appwriteConfig.databaseId,
                appwriteService.appwriteConfig.PRODUCTS_COLLECTION_ID,
                [Query.search('name', cleanQuery)]
            );

            if (products.documents.length > 0) {
                // Navigate to the product page
                router.push(`/product/${products.documents[0].$id}`);
                setSearchValue('');
                setIsSearchFocused(false);
                setIsSearching(false);
                return;
            }

            // If we get here, nothing was found
            setSearchError('Page or product not found');

            // Clear error after 3 seconds
            setTimeout(() => {
                setSearchError('');
            }, 3000);

        } catch (error) {
            console.error("Search error:", error);
            setSearchError('Search failed. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };


    const searchInputJSX = (
        <div className="hidden md:flex flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative w-full">
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
                    disabled={isSearching}
                />
                {searchValue && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setSearchValue('')}
                    >
                        <X className="h-5 w-5 text-[#878680] hover:text-[#1F1E17]" />
                    </button>
                )}

                {/* Hidden submit button for form submission */}
                <button type="submit" className="hidden">Search</button>
            </form>

            {/* Search suggestions with error message */}
            {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFFFF] rounded-xl shadow-lg border border-[#E4E2D7] py-2 z-50">
                    {searchError && (
                        <div className="px-4 py-3 text-center text-red-600 bg-red-50 font-medium">
                            {searchError}
                        </div>
                    )}

                    <div className="max-h-96 overflow-y-auto">
                        {searchSuggestions.map((suggestion, index) => (
                            <button
                                key={index}
                                className="w-full px-4 py-3 text-left hover:bg-[#E4E2D7] flex items-center space-x-3 transition-colors duration-150 group"
                                onClick={() => {
                                    setSearchValue(suggestion.text);
                                    // Trigger search with this suggestion
                                    setTimeout(() => handleSearchSubmit(), 100);
                                }}
                            >

                                <div className="flex flex-col">
                                    <span className="text-[#1F1E17] font-medium group-hover:text-[#4BAF47]">{suggestion.text}</span>
                                    <span className="text-xs text-[#878680] capitalize">{suggestion.type}</span>
                                </div>
                            </button>
                        ))}

                        {/* Add a search button at the bottom */}
                        {searchValue && !searchError && (
                            <button
                                className="w-full px-4 py-3 text-center bg-[#4BAF47] text-white font-medium rounded-b-lg hover:bg-[#3a8c38] transition-colors duration-150"
                                onClick={handleSearchSubmit}
                                disabled={isSearching}
                            >
                                {isSearching ? 'Searching...' : `Search for "${searchValue}"`}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );


    const categories = {
        // "Admin": ['admin/experts', 'admin/products'],
        // "User": ['add-product', 'login', 'offers-made', 'profile'],
        // "Experts": ['all-experts'],
        "Home": [],
        "Our Services": [],
        "Sell Product": [],
        "Buy Product": [],
        "Our Experts": [],
        "Contact": [],

    };




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

    const handleCategoryClick = (path) => {
        console.log('h')
        setIsOpen(false); // Close mobile menu
        // Use window.location instead of router
        window.location.href = `/${path}`;
    };


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
            case 'recent':
                return <Clock className="w-4 h-4 mr-2" />;
            case 'popular':
                return <Star className="w-4 h-4 mr-2" />;
            case 'category':
                return <Folder className="w-4 h-4 mr-2" />;
            case 'product':
                return <Package className="w-4 h-4 mr-2" />;
            case 'trending':
                return <TrendingUp className="w-4 h-4 mr-2" />;
            case 'deal':
                return <Tag className="w-4 h-4 mr-2" />;
            default:
                return <Search className="w-4 h-4 mr-2" />;
        }
    };
    // Function to handle search input change
    const handleSearchInputChange = (e) => {
        setSearchValue(e.target.value);
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
                                <form onSubmit={handleSearchSubmit} className="relative w-full">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className={`h-5 w-5 ${isSearchFocused ? 'text-[#4BAF47]' : 'text-[#878680]'}`} />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-12 py-3 border-2 border-[#C5CE38] rounded-xl leading-5 bg-[#fff] placeholder-[#878680] focus:outline-none focus:ring-2 focus:ring-[#C5CE38] focus:border-[#4BAF47] transition-all duration-200"
                                        placeholder="Search products, categories, brands..."
                                        value={searchValue}
                                        onChange={handleSearchInputChange}
                                        onFocus={() => setIsSearchFocused(true)}
                                        disabled={isSearching}
                                    />

                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                        {searchValue && (
                                            <button
                                                type="button"
                                                className="p-1 mr-1 text-[#878680] hover:text-[#1F1E17]"
                                                onClick={() => setSearchValue('')}
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        )}

                                        <button
                                            type="submit"
                                            className="p-2 rounded-lg bg-[#4BAF47] text-white hover:bg-[#3a8c38] transition-colors duration-150"
                                            disabled={isSearching || !searchValue.trim()}
                                        >
                                            <Search className="h-5 w-5" />
                                        </button>
                                    </div>
                                </form>

                                {/* Search suggestions with error message */}
                                {isSearchFocused && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-[#FFFFFF] rounded-xl shadow-lg border border-[#E4E2D7] py-2 z-50">
                                        {searchError && (
                                            <div className="px-4 py-3 text-center text-red-600 bg-red-50 font-medium">
                                                {searchError}
                                            </div>
                                        )}

                                        <div className="max-h-96 overflow-y-auto">
                                            {searchSuggestions.map((suggestion, index) => (
                                                <button
                                                    key={index}
                                                    className="w-full px-4 py-3 text-left hover:bg-[#E4E2D7] flex items-center space-x-3 transition-colors duration-150 group"
                                                    onClick={() => {
                                                        setSearchValue(suggestion.text);
                                                        // Trigger search with this suggestion
                                                        setTimeout(() => handleSearchSubmit(), 100);
                                                    }}
                                                >

                                                    <div className="flex flex-col">
                                                        <span className="text-[#1F1E17] font-medium group-hover:text-[#4BAF47]">{suggestion.text}</span>
                                                        <span className="text-xs text-[#878680] capitalize">{suggestion.type}</span>
                                                    </div>
                                                </button>
                                            ))}

                                            {/* Add a search button at the bottom */}
                                            {searchValue && !searchError && (
                                                <button
                                                    className="w-full px-4 py-3 text-center bg-[#4BAF47] text-white font-medium rounded-b-lg hover:bg-[#3a8c38] transition-colors duration-150"
                                                    onClick={handleSearchSubmit}
                                                    disabled={isSearching}
                                                >
                                                    {isSearching ? 'Searching...' : `Search for "${searchValue}"`}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right icons */}
                            <div className="flex items-center space-x-2 md:space-x-4">
                                <button className="p-2 rounded-full hover:bg-[#E4E2D7] transition-colors duration-200 flex items-center group" onClick={() => window.location.href = `/history`}>
                                    <History className="h-6 w-6 text-[#4BAF47] group-hover:text-[#4BAF47]" />
                                    <span className="ml-1 text-sm font-medium text-[#1F1E17] group-hover:text-[#4BAF47] hidden lg:block">History</span>
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
                                    {cartCount >= 0 && (
                                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-[#C5CE38] rounded-full text-[#1F1E17] text-xs flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </button>

                                <div className="relative" ref={dropdownRef}>
                                    <Link href="/profile" passHref legacyBehavior>
                                        <button
                                            className="p-2 rounded-full hover:bg-[#E4E2D7] transition-colors duration-200 group"
                                        >
                                            <User className="h-6 w-6 text-[#4BAF47] group-hover:text-[#1F1E17]" />
                                        </button>
                                    </Link>

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
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-[#878680]" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-12 py-3 border-2 border-[#C5CE38] rounded-xl leading-5 bg-[#fff] placeholder-[#878680] focus:outline-none focus:ring-2 focus:ring-[#C5CE38] focus:border-[#4BAF47] transition-all duration-200"
                                    placeholder="Search..."
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    disabled={isSearching}
                                />

                                <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                                    {searchValue && (
                                        <button
                                            type="button"
                                            className="p-1 mr-1 text-[#878680] hover:text-[#1F1E17]"
                                            onClick={() => setSearchValue('')}
                                        >
                                            <X className="h-5 w-5" />
                                        </button>
                                    )}

                                    <button
                                        type="submit"
                                        className="p-2 rounded-lg bg-[#4BAF47] text-white hover:bg-[#3a8c38] transition-colors duration-150"
                                        disabled={isSearching || !searchValue.trim()}
                                    >
                                        <Search className="h-5 w-5" />
                                    </button>
                                </div>
                            </form>

                            {/* Mobile search suggestions */}
                            {isSearchFocused && searchValue && (
                                <div className="mt-2 bg-[#FFFFFF] rounded-xl shadow-lg border border-[#E4E2D7] py-2 z-50">
                                    {searchError && (
                                        <div className="px-4 py-3 text-center text-red-600 bg-red-50 font-medium">
                                            {searchError}
                                        </div>
                                    )}

                                    <div className="max-h-96 overflow-y-auto">
                                        {searchSuggestions.map((suggestion, index) => (
                                            <button
                                                key={index}
                                                className="w-full px-4 py-3 text-left hover:bg-[#E4E2D7] flex items-center space-x-3 transition-colors duration-150 group"
                                                onClick={() => {
                                                    setSearchValue(suggestion.text);
                                                    setTimeout(() => handleSearchSubmit(), 100);
                                                }}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-[#1F1E17] font-medium group-hover:text-[#4BAF47]">{suggestion.text}</span>
                                                    <span className="text-xs text-[#878680] capitalize">{suggestion.type}</span>
                                                </div>
                                            </button>
                                        ))}

                                        {searchValue && !searchError && (
                                            <button
                                                className="w-full px-4 py-3 text-center bg-[#4BAF47] text-white font-medium rounded-b-lg hover:bg-[#3a8c38] transition-colors duration-150"
                                                onClick={handleSearchSubmit}
                                                disabled={isSearching}
                                            >
                                                {isSearching ? 'Searching...' : `Search for "${searchValue}"`}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Desktop category dropdown */}
                        <div className="hidden md:block py-2 border-t border-[#E4E2D7]">
                            <div className="flex items-center justify-center space-x-8">
                                {Object.keys(categories).map((category) => (
                                    <div key={category} className="relative justify-center group" ref={dropdownRef}>
                                        <Link
                                            href={category === "Home" ? "/dashboard" : `/dashboard#${category}`}
                                            className="text-[#1F1E17] hover:text-[#8B5E3C] font-extrabold px-3 py-2 text-sm transition-colors duration-200 flex items-center"
                                            onClick={(e) => {
                                                // This handles the smooth scrolling part
                                                if (category !== "Home") {
                                                    e.preventDefault();
                                                    const section = document.getElementById(category);
                                                    if (section) {
                                                        section.scrollIntoView({ behavior: "smooth" });
                                                        window.history.pushState(null, "", `/dashboard#${category}`);
                                                    }
                                                }
                                            }}
                                        >
                                            {category}
                                        </Link>


                                        {/* Dropdown menu */}
                                        {/* {activeDropdown === category && (
                                            <div className="absolute  left-0 mt-2 w-48 bg-[#F8F7F0] rounded-xl shadow-lg py-2 z-100 border border-[#E4E2D7]">
                                                {categories[category].map((subCategory) => (
                                                    // Replace your current Link implementation in the dropdown with this:
                                                    <button
                                                        key={subCategory}
                                                        className="block w-full text-left px-4 py-2 text-sm text-[#1F1E17] hover:bg-[#E4E2D7] hover:text-[#8B5E3C] transition-colors duration-150"
                                                        onClick={() => handleCategoryClick(subCategory)}
                                                    >
                                                        {subCategory}
                                                    </button>
                                                ))}
                                            </div>
                                        )} */}
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
                                        <Link
                                            href={category === "Home" ? "/dashboard" : `/dashboard#${category}`}
                                            className="text-[#1F1E17] hover:text-[#8B5E3C] font-extrabold px-3 py-2 text-sm transition-colors duration-200 flex items-center"
                                            onClick={(e) => {
                                                // This handles the smooth scrolling part
                                                if (category !== "Home") {
                                                    e.preventDefault();
                                                    const section = document.getElementById(category);
                                                    if (section) {
                                                        section.scrollIntoView({ behavior: "smooth" });
                                                        window.history.pushState(null, "", `/dashboard#${category}`);
                                                    }
                                                }
                                            }}
                                        >
                                            {category}
                                        </Link>

                                        {/* {activeDropdown === category && (
                                            <div className="pl-4 space-y-1">
                                                {subCategories.map((subCategory) => (
                                                    // Replace your current Link implementation in the dropdown with this:
                                                    <button
                                                        key={subCategory}
                                                        className="block w-full text-left px-4 py-2 text-sm text-[#1F1E17] hover:bg-[#E4E2D7] hover:text-[#8B5E3C] transition-colors duration-150"
                                                        onClick={() => handleCategoryClick(subCategory)}
                                                    >
                                                        {subCategory}
                                                    </button>
                                                ))}
                                            </div>
                                        )} */}
                                    </div>
                                ))}

                                {/* User profile in mobile menu */}
                                {/* <button className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-[#1F1E17] hover:text-[#4BAF47] hover:bg-[#E4E2D7] transition-colors duration-200" >
                                    <User className="h-5 w-5 mr-2 text-[#4BAF47]" />
                                    My Account
                                </button> */}
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