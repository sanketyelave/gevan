import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const heroSlides = [
    {
        backgroundImage: "/assets/hero1.png",
        title: "Sell Your Harvest with Ease",
        description: "Get the best prices for your crops directly from trusted buyers.",
        buttonText: "Start Selling",
        buttonLink: "/sell",
        buttonColor: "bg-[#4BAF47] hover:bg-[#51bc4e]"
    },
    {
        backgroundImage: "/assets/hero2.png",
        title: "Fair Prices, Instant Payments",
        description: "We ensure fair market rates and quick payments for your hard work.",
        buttonText: "Sell Now",
        buttonLink: "/sell",
        buttonColor: "bg-[#4BAF47] hover:bg-[#51bc4e]"
    },
    {
        backgroundImage: "/assets/hero3.png",
        title: "Reach More Buyers",
        description: "Connect with businesses and retailers looking for fresh farm produce.",
        buttonText: "List Your Produce",
        buttonLink: "/sell",
        buttonColor: "bg-[#4BAF47] hover:bg-[#51bc4e]"
    }


];


export default function HeroSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isManual, setIsManual] = useState(false);

    useEffect(() => {
        if (isManual) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isManual]);

    const goToPrevious = () => {
        setIsManual(true);
        setCurrentIndex((prevIndex) => (prevIndex - 1 + heroSlides.length) % heroSlides.length);
        setTimeout(() => setIsManual(false), 10000);
    };

    const goToNext = () => {
        setIsManual(true);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
        setTimeout(() => setIsManual(false), 10000);
    };

    const { backgroundImage, title, description, buttonText, buttonLink, buttonColor } = heroSlides[currentIndex];

    return (
        <section
            className="relative top-[4rem] pointer-events-auto w-full z-10  h-[100vh] flex items-center justify-center bg-cover bg-center transition-opacity duration-1000"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
        >
            {/* Left Navigation Button */}
            <button className="absolute hidden md:block left-5 bg-black bg-opacity-50 p-3 rounded-full text-white hover:bg-opacity-75 transition" onClick={goToPrevious}>
                <ChevronLeft size={30} />
            </button>

            <div className="relative flex flex-col gap-4 md:items-start items-center text-[#fff] w-[70%] mx-auto transition-opacity duration-1000">
                <h1 className="text-5xl md:text-6xl font-extrabold leading-tight caveat">
                    {title.split(" ").slice(0, -1).join(" ")} <span className="text-[#EEC044]">{title.split(" ").slice(-1)}</span>
                </h1>
                <p className="text-lg md:text-xl mt-4 text-[#fff] poppins opacity-90">{description}</p>
                <div className="mt-6 poppins flex items-start justify-start">
                    <button
                        onClick={() => window.location.href = buttonLink}
                        className={`${buttonColor} text-[#fff] hover:text-[#1F1E17] px-6 py-3 rounded-xl font-semibold text-lg cursor-pointer transition duration-300`}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
            {/* Bottom Image */}
            <div className="absolute md:block hidden bottom-[-8rem] w-[80%] ">
                <img src="/assets/herobottom.png" alt="Promotional Banner" className="w-full h-auto" />
            </div>
            {/* Right Navigation Button */}
            <button className="absolute hidden md:block right-5 bg-black bg-opacity-50 p-3 rounded-full text-white hover:bg-opacity-75 transition" onClick={goToNext}>
                <ChevronRight size={30} />
            </button>

            {/* Indicator Dots */}
            <div className="absolute  md:hidden bottom-5 flex gap-2">
                {heroSlides.map((_, index) => (
                    <div key={index} className={`w-3 h-3 rounded-full ${currentIndex === index ? 'bg-[#EEC044]' : 'bg-white opacity-50'} transition`}></div>
                ))}
            </div>


        </section>
    );
}
