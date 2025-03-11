import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

import { motion, AnimatePresence } from "framer-motion";

const productData = [
    {
        id: 1,
        name: "Wheat",
        image: "/sellProducts/onion.png",
        highestPrice: 2500,
        lowestPrice: 2000,
        unit: "per quintal"
    },
    {
        id: 2,
        name: "Rice",
        image: "/sellProducts/carrot.png",
        highestPrice: 3500,
        lowestPrice: 3000,
        unit: "per quintal"
    },
    {
        id: 3,
        name: "Corn",
        image: "/sellProducts/tomato.png",
        highestPrice: 2200,
        lowestPrice: 1800,
        unit: "per quintal"
    },
    {
        id: 4,
        name: "Soybean",
        image: "/sellProducts/carrot.png",
        highestPrice: 4200,
        lowestPrice: 3800,
        unit: "per quintal"
    },
    {
        id: 5,
        name: "Barley",
        image: "/sellProducts/onion.png",
        highestPrice: 2100,
        lowestPrice: 1700,
        unit: "per quintal"
    },
    {
        id: 6,
        name: "Sunflower",
        image: "/sellProducts/tomato.png",
        highestPrice: 3800,
        lowestPrice: 3200,
        unit: "per quintal"
    },
    {
        id: 7,
        name: "Cotton",
        image: "/sellProducts/carrot.png",
        highestPrice: 5500,
        lowestPrice: 4800,
        unit: "per quintal"
    },
    {
        id: 8,
        name: "Sugarcane",
        image: "/sellProducts/onion.png",
        highestPrice: 3100,
        lowestPrice: 2700,
        unit: "per quintal"
    }
];


const images = [
    "/sellProducts/c1.png",
    "/sellProducts/c4.png",
    "/sellProducts/c3.png"
];

// Cache object to store mandi prices
const mandiPriceCache = {};

const fetchMandiPrices = async (pincode, productName) => {
    // Create a cache key
    const cacheKey = `${pincode}-${productName}`;

    // Check if we already have this data in cache
    if (mandiPriceCache[cacheKey]) {
        console.log(`Using cached mandi price for ${productName}`);
        return mandiPriceCache[cacheKey];
    }

    try {
        const API_KEY = '579b464db66ec23bdd0000018587202d058b4a436a297d15835e4d7f';

        // First, get the district/state from pincode
        const pincodeResponse = await fetch(
            `https://api.postalpincode.in/pincode/${pincode}`
        );
        const pincodeData = await pincodeResponse.json();

        if (!pincodeData[0]?.PostOffice?.[0]) {
            throw new Error('Invalid pincode');
        }

        const district = pincodeData[0].PostOffice[0].District;
        const state = pincodeData[0].PostOffice[0].State;

        // Now fetch mandi prices for this district/state
        const mandiResponse = await fetch(
            'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?' +
            'api-key=' + API_KEY +
            '&format=json' +
            '&limit=1000' +
            `&filters[state]=${encodeURIComponent(state)}` +
            `&filters[commodity]=${encodeURIComponent(productName)}`
        );

        const mandiData = await mandiResponse.json();

        // Log the entire response to see what we're getting
        console.log('API Response:', {
            state,
            district,
            productName,
            fullResponse: mandiData
        });

        let result;

        // Check if we have any records
        if (!mandiData.records || mandiData.records.length === 0) {
            // If no data available, return default state prices
            result = {
                price: 2500, // Default price as fallback
                market: 'State Level',
                district: district,
                state: state
            };
        } else {
            // Filter for nearby mandis (within the district)
            const nearbyMandis = mandiData.records.filter(record =>
                record.district?.toLowerCase() === district.toLowerCase()
            );

            if (nearbyMandis.length === 0) {
                // If no mandis in district, get the first available price from state
                const statePrice = mandiData.records[0];
                result = {
                    price: statePrice.modal_price ||
                        statePrice.min_price ||
                        statePrice.max_price ||
                        2500, // Default fallback price
                    market: statePrice.market || 'State Level',
                    district: district,
                    state: state
                };
            } else {
                // Get the latest price from nearby mandis
                const latestMandi = nearbyMandis[0];
                result = {
                    price: latestMandi.modal_price ||
                        latestMandi.min_price ||
                        latestMandi.max_price ||
                        2500, // Default fallback price
                    market: latestMandi.market,
                    district: district,
                    state: state
                };
            }
        }

        // Store in cache before returning
        mandiPriceCache[cacheKey] = result;
        return result;

    } catch (error) {
        console.error('Error details:', error);
        // Return default values on error
        return {
            price: 2500, // Default fallback price
            market: 'State Level',
            district: 'Not Available',
            state: 'Not Available'
        };
    }
};

const ProductCard = ({ product, pincode }) => {
    const [localMandiPrice, setLocalMandiPrice] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hasFetchedPrice, setHasFetchedPrice] = useState(false);

    useEffect(() => {
        const getMandiPrice = async () => {
            if (hasFetchedPrice) return; // Skip if we've already fetched once

            setLoading(true);
            try {
                const price = await fetchMandiPrices(pincode, product.name);
                setLocalMandiPrice(price);
                setHasFetchedPrice(true); // Mark as fetched
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (pincode && !hasFetchedPrice) {
            getMandiPrice();
        }
    }, [pincode, product.name, hasFetchedPrice]);

    return (
        <div id="Sell Product" className="bg-[#fff] hover:cursor-default rounded-lg overflow-hidden shadow-md font-semibold">
            <div className="md:h-[12rem] h-[6rem] relative text-[#24231D]">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4 poppins mx-0 sm:mx-4">
                <h3 className="text-base md:text-lg font-extrabold mb-2">{product.name}</h3>
                <div className="space-y-2 text-xs md:text-sm flex flex-col justify-start items-start">
                    <p className="text-[#4BAF47]">
                        <span className="text-[#24231D] font-bold">Highest</span>: ₹{product.highestPrice} {product.unit}
                    </p>
                    <p className="text-[#C5CE38]">
                        <span className="text-[#24231D] font-bold">Lowest</span>: ₹{product.lowestPrice} {product.unit}
                    </p>
                    <p className="text-[#EEC044]">
                        {loading ? (
                            'Loading mandi price...'
                        ) : localMandiPrice ? (
                            <>
                                <span className="text-[#24231D] font-bold">Mandi Price</span>: ₹{typeof localMandiPrice.price === 'number'
                                    ? localMandiPrice.price.toFixed(2)
                                    : localMandiPrice.price}
                                <span className="text-[10px] sm:block hidden md:text-xs ml-1 text-gray-600">
                                    ({localMandiPrice.market}, {localMandiPrice.district})
                                </span>
                            </>
                        ) : (
                            'Mandi price not available'
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
};

function Sell() {
    const [pincode, setPincode] = useState('400042');
    const [error, setError] = useState('');
    const [index, setIndex] = useState(0);
    const [currentProductIndex, setCurrentProductIndex] = useState(0);
    const productsPerPage = 4; // Display 4 products at a time
    const slideAmount = 4; // Move 2 products at a time
    const totalSlides = Math.ceil((productData.length - productsPerPage) / slideAmount) + 1;

    // Carousel timing - set to 3 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % images.length);
            goToNextSet();
        }, 3000); // 3 second interval

        return () => clearInterval(interval);
    }, []);

    const handlePincodeChange = (e) => {
        const value = e.target.value;
        if (value.length <= 6 && /^\d*$/.test(value)) {
            setPincode(value);
            setError('');
        }
    };

    const [direction, setDirection] = useState(1); // 1 for right-to-left, -1 for left-to-right

    const goToNextSet = () => {
        setDirection(1);
        setCurrentProductIndex(prev => {
            // Calculate the next index, ensuring we don't go beyond product data length
            const nextIndex = prev + slideAmount;
            if (nextIndex > productData.length - productsPerPage) {
                return 0; // Return to start when reaching the end
            }
            return nextIndex;
        });
    };

    const goToPrevSet = () => {
        setDirection(-1);
        setCurrentProductIndex(prev => {
            // Calculate the previous index, ensuring we don't go below 0
            const prevIndex = prev - slideAmount;
            if (prevIndex < 0) {
                // Jump to the last valid starting position
                return Math.max(0, Math.floor((productData.length - productsPerPage) / slideAmount) * slideAmount);
            }
            return prevIndex;
        });
    };

    const visibleProducts = productData.slice(currentProductIndex, currentProductIndex + productsPerPage);

    return (
        <div>
            <section className="py-16 bg-[#FFFFFF] poppins relative bg-cover h-full bg-center ">
                <div className="max-w-7xl mx-auto md:mt-[3rem] mt-[2rem] sm:px-6 px-0 text-center">
                    <h5 className="text-3xl md:text-4xl font-bold text-[#EEC044] mb-6 md:mb-10 caveat">
                        Sell Your Products
                    </h5>

                    <div className="relative flex justify-center w-full items-center h-[60px] mb-6 md:mb-10 overflow-hidden">
                        {images.map((src, i) => (
                            <motion.img
                                key={i}
                                src={src}
                                alt={`Product ${i + 1}`}
                                className="absolute w-1/6 md:w-1/8 max-w-[40px]"
                                initial={{ x: 300, opacity: 0 }}
                                animate={{
                                    x: i === index ? 0 : -350,
                                    opacity: i === index ? 1 : 0,
                                    rotate: i === index ? [-2, 2, -2, 2, 0] : 0,
                                }}
                                transition={{
                                    x: { type: "spring", stiffness: 45, damping: 15, duration: 1.2 },
                                    opacity: { duration: 0.4 },
                                    rotate: { repeat: 2, duration: 0.6 },
                                }}
                            />
                        ))}
                    </div>

                    <h1 className="text-2xl md:text-4xl font-bold text-[#1F1E17] poppins mb-6 md:mb-10">
                        Best Deals Available...
                    </h1>

                    {/* Product Carousel */}
                    <div className="w-full overflow-hidden relative">
                        {/* Left arrow control */}
                        <button
                            onClick={goToPrevSet}
                            className="absolute top-1/2 left-2 z-10 bg-white/80 rounded-full p-2 shadow-md transform -translate-y-1/2"
                            aria-label="Previous products"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4BAF47]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                className="flex"
                                key={currentProductIndex}
                                initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
                                transition={{
                                    duration: 0.5,
                                    ease: "easeInOut"
                                }}
                            >
                                <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 px-4 sm:px-8 md:px-16 min-w-full">
                                    {visibleProducts.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            pincode={pincode.length === 6 ? pincode : null}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Right arrow control */}
                        <button
                            onClick={goToNextSet}
                            className="absolute top-1/2 right-2 z-10 bg-white/80 rounded-full p-2 shadow-md transform -translate-y-1/2"
                            aria-label="Next products"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#4BAF47]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Carousel Indicators */}
                        <div className="flex justify-center mt-4">
                            {Array.from({ length: totalSlides }).map((_, idx) => {
                                const slideIndex = idx * slideAmount;
                                return (
                                    <button
                                        key={idx}
                                        className={`h-2 w-2 mx-1 rounded-full ${currentProductIndex === slideIndex ? 'bg-[#4BAF47]' : 'bg-gray-300'
                                            }`}
                                        onClick={() => {
                                            setDirection(slideIndex > currentProductIndex ? 1 : -1);
                                            setCurrentProductIndex(slideIndex);
                                        }}
                                        aria-label={`Go to slide ${idx + 1}`}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex flex-row justify-center items-center mt-4 md:mt-[5rem] gap-4 sm:gap-8">
                        <Link
                            href="/all-products"
                            className="w-auto text-center sm:px-6 px-3 py-3 bg-[#4BAF47] text-white rounded-lg hover:bg-[#378034] transition-colors"
                        >
                            View All Products
                        </Link>
                        <Link
                            href="/add-product"
                            className="w-auto text-center sm:px-6 px-3 py-3 bg-[#4BAF47] text-white rounded-lg hover:bg-[#378034] transition-colors"
                        >
                            Sell Product
                        </Link>
                    </div>
                </div>

                <div className="absolute left-0 top-4 z-0">
                    <img
                        src="/assets/sellbg3.png"
                        alt="Decorative Image"
                        className="w-[0rem] sm:w-[200px] md:w-[250px] lg:w-[300px] object-contain"
                    />
                </div>
                <div className="mt-[6rem] w-full">
                    <img
                        src="/assets/sell-bottom2.png"
                        alt="Agriculture Banner"
                        className="w-full h-auto max-h-[18rem] object-cover sm:h-[14rem] md:h-[16rem] lg:h-[18rem]"
                    />
                </div>
            </section>
        </div>
    );
}

export default Sell;