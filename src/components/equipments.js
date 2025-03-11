import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const productData = [
    {
        id: 1,
        name: "Tractor",
        image: "/sellProducts/onion.png",
        type: "Heavy Machinery",
        categories: ["Compact", "Utility", "Row Crop", "Garden"]
    },
    {
        id: 2,
        name: "Harvester",
        image: "/sellProducts/carrot.png",
        type: "Harvesting Equipment",
        categories: ["Combine", "Forage", "Potato", "Sugar Cane"]
    },
    {
        id: 3,
        name: "Plough",
        image: "/sellProducts/tomato.png",
        type: "Tillage Equipment",
        categories: ["Disc", "Chisel", "Moldboard", "Rotary"]
    },
    {
        id: 4,
        name: "Sprayer",
        image: "/sellProducts/carrot.png",
        type: "Plant Protection",
        categories: ["Backpack", "Boom", "Orchard", "Drone"]
    }
];

const ProductCard = ({ product }) => {
    const [selectedCategory, setSelectedCategory] = useState(product.categories[0]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    return (
        <div id="Buy Product" className="bg-[#fff] hover:cursor-default rounded-lg overflow-hidden shadow-md font-semibold">
            <div className="md:h-[12rem] h-[6rem] relative text-[#24231D]">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="p-4 poppins mx-0 sm:mx-4">
                <h3 className="text-base md:text-lg font-extrabold mb-2">{product.name}</h3>
                <div className="space-y-2 text-xs md:text-sm flex flex-col justify-start items-start w-full">
                    {/* <p className="text-[#4BAF47]">
                        <span className="text-[#24231D] font-bold">Type</span>: {product.type}
                    </p> */}
                    <div className="w-full">
                        <label htmlFor={`category-${product.id}`} className="text-[#24231D] font-bold block mb-1">Types available:</label>
                        <select
                            id={`category-${product.id}`}
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            className="w-full p-2 border border-gray-300 rounded-md bg-white text-[#24231D] text-xs md:text-sm"
                        >
                            {product.categories.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Equipment() {
    const [showPopup, setShowPopup] = useState(false);

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
                    Rent Equipment
                </h5>
                <h1 className="text-2xl md:text-4xl font-bold text-[#1F1E17] poppins mb-6 md:mb-10">
                    Quality Equipment for Modern Farming
                </h1>

                <div className="grid grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 px-4 sm:px-8 md:px-16">
                    {productData.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}
                </div>

                <div className="flex flex-row justify-center items-center mt-4 md:mt-[5rem] gap-4 sm:gap-8">
                    <button
                        onClick={handleBuyClick}
                        className="w-auto text-center px-6 py-3 bg-[#4BAF47] text-white rounded-lg hover:bg-[#378034] transition-colors"
                    >
                        Inquire Now
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Equipment;