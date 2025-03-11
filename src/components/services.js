import Image from 'next/image';
import { useState, useContext, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // Adjust the import path as needed
import { X, Cloud, ArrowLeft } from 'lucide-react';

const services = [
    {
        "id": 1,
        "title": "Crop Doctor",
        "description": "AI-powered crop health diagnosis and recommendations.",
        "image": "/assets/service1.png",
        "icon": "/assets/icon1.png"
    },
    {
        "id": 2,
        "title": "Human Experts",
        "description": "Get expert advice from agricultural professionals.",
        "image": "/assets/service2.png",
        "icon": "/assets/icon2.png"
    },
    {
        "id": 3,
        "title": "Shop",
        "description": "Buy quality farming tools, seeds, and fertilizers.",
        "image": "/assets/service3.png",
        "icon": "/assets/icon3.png"
    },
    {
        "id": 4,
        "title": "Soil Analysis",
        "description": "Get detailed insights into soil health and nutrients.",
        "image": "/assets/service1.png",
        "icon": "/assets/icon1.png"
    },
    {
        "id": 5,
        "title": "Weather",
        "description": "Accurate weather forecasts for better farm planning.",
        "image": "/assets/weather.jpeg",
        "icon": "/assets/icon3.png"
    },
    {
        "id": 6,
        "title": "Consulting",
        "description": "Personalized farming solutions from industry experts.",
        "image": "/assets/consulting.jpeg",
        "icon": "/assets/icon2.png"
    },
    {
        "id": 7,
        "title": "Government Schemes",
        "description": "Explore subsidies and benefits for farmers.",
        "image": "/assets/scheme.jpeg",
        "icon": "/assets/icon1.png"
    },
    {
        "id": 8,
        "title": "Rent Equipment",
        "description": "Affordable farm equipment rentals for every need.",
        "image": "/assets/equipment.jpeg",
        "icon": "/assets/icon3.png"
    }
]

const OurServices = () => {
    const [showWeatherOverlay, setShowWeatherOverlay] = useState(false);
    const { user } = useAuth() || { pincode: '400042' }; // Default to a fallback pincode if context is not available

    const handleServiceClick = (serviceTitle) => {
        if (serviceTitle === "Weather") {
            setShowWeatherOverlay(true);
        }
    };

    return (
        <section className="py-8 md:py-16 bg-gray-100 relative bg-cover bg-center min-h-screen" style={{ backgroundImage: 'url(/assets/services.png)' }} id="Our Services">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
                <div className="pt-16 md:pt-20 lg:pt-24">
                    <h5 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#EEC044] mb-3 md:mb-6 caveat">Our Services</h5>
                    <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-[#1F1E17] poppins mb-8 md:mb-12">What Do We Offer...</h1>
                </div>

                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="relative hover:scale-105 transition-transform duration-300 bg-white shadow-lg rounded-xl overflow-hidden group cursor-pointer flex flex-col h-full"
                            onClick={() => handleServiceClick(service.title)}
                        >
                            {/* Service Card Image */}
                            <div className="relative w-full h-32 sm:h-36 md:h-44">
                                <Image
                                    src={service.image}
                                    alt={service.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-t-xl"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                            </div>

                            {/* Service Icon - Small floating icon on the corner */}
                            <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
                                <div className="relative w-8 h-8">
                                    <Image
                                        src={service.icon}
                                        alt=""
                                        layout="fill"
                                        className="rounded-full"
                                    />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-4 flex-grow flex flex-col">
                                <h3 className="text-lg md:text-xl text-[#4BAF47] font-semibold poppins mb-2">{service.title}</h3>
                                <p className="text-gray-600 text-sm md:text-base">{service.description}</p>
                                <div className="mt-auto pt-3">
                                    <span className="inline-block text-sm font-medium text-[#4BAF47] group-hover:underline">Learn more</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weather Overlay */}
            {showWeatherOverlay && (
                <WeatherOverlay
                    pincode={user?.pincode || '400042'}
                    onClose={() => setShowWeatherOverlay(false)}
                />
            )}
        </section>
    );
};

// Weather Overlay Component
const WeatherOverlay = ({ pincode, onClose }) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                setLoading(true);
                // Using OpenWeatherMap API
                const apiKey = '76f4a8640381bb7c6831e4ce9bb8125c';
                // Fetch weather by pincode/zip code (India)
                const response = await fetch(
                    `https://api.openweathermap.org/data/2.5/weather?zip=${pincode},in&units=metric&appid=${apiKey}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch weather data');
                }

                const data = await response.json();
                setWeatherData(data);
            } catch (err) {
                console.error('Error fetching weather:', err);
                setError(err.message || 'Failed to load weather data');
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [pincode]);

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4 py-6 overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="relative bg-white rounded-2xl overflow-y-auto max-h-[90vh] w-full max-w-md shadow-2xl transform transition-all animate-fade-in-up">
                {/* Header */}
                <div className="p-4 text-white font-bold text-xl flex justify-between items-center bg-[#4BAF47]">
                    <div className="flex items-center">
                        <Cloud className="w-6 h-6 mr-2" />
                        <h3>Weather Forecast</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full hover:bg-white/20 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Back Button - Fixed position */}
                {/* <button
                    onClick={onClose}
                    className="absolute top-16 left-4 text-[#4BAF47] hover:text-[#3d9c39] transition-colors flex items-center p-2"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    <span className="text-sm font-medium">Back</span>
                </button> */}

                {/* Content */}
                <div className="p-6 pt-12">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="w-12 h-12 border-4 border-t-[#4BAF47] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                            <p className="mt-4 text-gray-600">Loading weather data...</p>
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-8">
                            <p className="text-red-500 font-medium mb-2">Error loading weather data</p>
                            <p className="text-gray-600">{error}</p>
                            <button
                                onClick={onClose}
                                className="mt-6 px-6 py-2 bg-[#4BAF47] text-white rounded-lg hover:bg-[#3d9c39] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    )}

                    {!loading && !error && weatherData && (
                        <div className="flex flex-col items-center">
                            <div className="text-center mb-6">
                                <h4 className="text-2xl font-bold text-[#1F1E17]">
                                    {weatherData.name}
                                </h4>
                                <p className="text-gray-600">Pincode: {pincode}</p>
                            </div>

                            <div className="flex items-center justify-center mb-6 bg-gray-50 rounded-xl p-4 w-full">
                                <img
                                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                                    alt={weatherData.weather[0].description}
                                    className="w-20 h-20"
                                />
                                <div className="ml-2">
                                    <p className="text-3xl md:text-4xl font-bold text-[#1F1E17]">
                                        {Math.round(weatherData.main.temp)}°C
                                    </p>
                                    <p className="text-gray-600 capitalize">
                                        {weatherData.weather[0].description}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 w-full mt-3">
                                <div className="bg-gray-100 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-gray-600 text-xs md:text-sm">Humidity</p>
                                    <p className="text-[#1F1E17] font-bold text-lg">{weatherData.main.humidity}%</p>
                                </div>
                                <div className="bg-gray-100 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-gray-600 text-xs md:text-sm">Wind Speed</p>
                                    <p className="text-[#1F1E17] font-bold text-lg">{weatherData.wind.speed} m/s</p>
                                </div>
                                <div className="bg-gray-100 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-gray-600 text-xs md:text-sm">Pressure</p>
                                    <p className="text-[#1F1E17] font-bold text-lg">{weatherData.main.pressure} hPa</p>
                                </div>
                                <div className="bg-gray-100 p-3 md:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                    <p className="text-gray-600 text-xs md:text-sm">Feels Like</p>
                                    <p className="text-[#1F1E17] font-bold text-lg">{Math.round(weatherData.main.feels_like)}°C</p>
                                </div>
                            </div>

                            {/* Weather forecast for farming */}
                            <div className="mt-6 bg-gradient-to-r from-[#4BAF47]/10 to-[#EEC044]/10 p-4 rounded-lg w-full border border-[#4BAF47]/20">
                                <h5 className="font-semibold text-[#4BAF47] mb-2 flex items-center">
                                    <span className="mr-2">🌱</span> Farming Outlook
                                </h5>
                                <p className="text-gray-700 text-sm">
                                    {weatherData.main.temp > 30
                                        ? "High temperatures expected. Ensure adequate irrigation and consider shade for sensitive crops."
                                        : weatherData.main.temp < 15
                                            ? "Cooler temperatures expected. Protect temperature-sensitive crops and monitor soil moisture."
                                            : "Favorable weather for most farming activities. Good conditions for field work and crop development."
                                    }
                                </p>
                            </div>

                            <div className="mt-8 w-full">
                                <p className="text-xs text-gray-500 mb-4 text-center">
                                    Last updated: {new Date(weatherData.dt * 1000).toLocaleTimeString()}
                                </p>
                                <button
                                    onClick={onClose}
                                    className="w-full py-3 bg-[#4BAF47] text-white rounded-lg hover:bg-[#3d9c39] transition-colors font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OurServices;
