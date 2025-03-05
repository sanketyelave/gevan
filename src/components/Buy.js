import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const productData = [
    {
        id: 1,
        name: "Wheat",
        image: "/sellProducts/onion.png",
        highestPrice: 2500,
        unit: "per quintal"
    },
    {
        id: 2,
        name: "Rice",
        image: "/sellProducts/carrot.png",
        highestPrice: 3500,

        unit: "per quintal"
    },
    {
        id: 3,
        name: "Corn",
        image: "/sellProducts/tomato.png",
        highestPrice: 2200,

        unit: "per quintal"
    },
    {
        id: 4,
        name: "Soybean",
        image: "/sellProducts/carrot.png",
        highestPrice: 4200,

        unit: "per quintal"
    }
];



const fetchMandiPrices = async (pincode, productName) => {
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

        // Check if we have any records
        if (!mandiData.records || mandiData.records.length === 0) {
            // If no data available, return default state prices
            return {
                price: 2500, // Default price as fallback
                market: 'State Level',
                district: district,
                state: state
            };
        }

        // Filter for nearby mandis (within the district)
        const nearbyMandis = mandiData.records.filter(record =>
            record.district?.toLowerCase() === district.toLowerCase()
        );

        if (nearbyMandis.length === 0) {
            // If no mandis in district, get the first available price from state
            const statePrice = mandiData.records[0];
            return {
                price: statePrice.modal_price ||
                    statePrice.min_price ||
                    statePrice.max_price ||
                    2500, // Default fallback price
                market: statePrice.market || 'State Level',
                district: district,
                state: state
            };
        }

        // Get the latest price from nearby mandis
        const latestMandi = nearbyMandis[0];
        return {
            price: latestMandi.modal_price ||
                latestMandi.min_price ||
                latestMandi.max_price ||
                2500, // Default fallback price
            market: latestMandi.market,
            district: district,
            state: state
        };

    } catch (error) {
        console.error('Error details:', error);
        // Return default values on error
        return {
            price: 2500, // Default fallback price
            market: 'State Level',
            district: district || 'Not Available',
            state: state || 'Not Available'
        };
    }
};
const ProductCard = ({ product, pincode }) => {
    const [localMandiPrice, setLocalMandiPrice] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getMandiPrice = async () => {
            setLoading(true);
            try {
                const price = await fetchMandiPrices(pincode, product.name);
                setLocalMandiPrice(price);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (pincode) {
            getMandiPrice();
        }
    }, [pincode, product.name]);

    return (
        <div className="bg-[#fff] hover:cursor-default rounded-lg overflow-hidden shadow-md font-semibold">
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
                        <span className="text-[#24231D] font-bold">Price</span>: ₹{product.highestPrice} {product.unit}
                    </p>
                    {/* <p className="text-[#C5CE38]">
                        <span className="text-[#24231D] font-bold">Lowest</span>: ₹{product.lowestPrice} {product.unit}
                    </p> */}
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

function Buy() {
    const [pincode, setPincode] = useState('400042');
    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const handlePincodeChange = (e) => {
        const value = e.target.value;
        if (value.length <= 6 && /^\d*$/.test(value)) {
            setPincode(value);
            setError('');
        }
    };

    const handleBuyClick = (e) => {
        e.preventDefault();
        setShowPopup(true);
        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
    };

    return (
        <section className="pb-16 bg-[#FFFFFF] poppins relative bg-cover h-full bg-center">
            {showPopup && (
                <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-[90%] max-w-md bg-red-500 text-white text-center py-3 px-6 rounded-b-lg shadow-lg animate-slide-down z-50">
                    Our market is not live now for selling products. Please try later.
                </div>
            )}

            <div className="max-w-7xl mx-auto md:mt-[3rem] mt-[2rem] sm:px-6 px-0 text-center">
                <h5 className="text-3xl md:text-4xl font-bold text-[#EEC044] mb-6 md:mb-10 caveat">
                    Buy our Products
                </h5>
                <h1 className="text-2xl md:text-4xl font-bold text-[#1F1E17] poppins mb-6 md:mb-10">
                    Top Picks at the Best Prices!
                </h1>


                <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 px-4 sm:px-8 md:px-16">
                    {productData.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            pincode={pincode.length === 6 ? pincode : null}
                        />
                    ))}
                </div>

                <div className="flex flex-row justify-center items-center mt-4 md:mt-[5rem] gap-4 sm:gap-8">
                    <button
                        onClick={handleBuyClick}
                        className="w-auto text-center px-6 py-3 bg-[#4BAF47] text-white rounded-lg hover:bg-[#378034] transition-colors"
                    >
                        Buy Product
                    </button>
                </div>

            </div>
            {/* <div className="mt-[6rem]">
                <img
                    src="/assets/sell-bottom2.png"
                    alt="Agriculture Banner"
                    className="w-full h-[18rem] object-cover "
                />
            </div> */}
        </section>
    );
}

export default Buy;


// const API_KEY = '579b464db66ec23bdd0000018587202d058b4a436a297d15835e4d7f';