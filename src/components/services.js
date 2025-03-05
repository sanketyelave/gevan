import Image from 'next/image';

const services = [
    {
        id: 1,
        title: 'Precision Farming',
        description: 'Utilizing technology to optimize crop yields and reduce waste.',
        image: '/assets/service1.png',
        icon: '/assets/icon1.png',
    },
    {
        id: 2,
        title: 'Smart Irrigation',
        description: 'Efficient water management solutions for sustainable agriculture.',
        image: '/assets/service2.png',
        icon: '/assets/icon2.png',
    },
    {
        id: 3,
        title: 'Agri-Drones',
        description: 'Advanced drone technology for monitoring and spraying crops.',
        image: '/assets/service3.png',
        icon: '/assets/icon3.png',
    },
    {
        id: 4,
        title: 'Soil Analysis',
        description: 'Detailed insights to enhance soil health and crop productivity.',
        image: '/assets/service1.png',
        icon: '/assets/icon1.png',
    },
    {
        id: 5,
        title: 'Automated Machinery',
        description: 'Cutting-edge tools for efficient and cost-effective farming.',
        image: '/assets/service3.png',
        icon: '/assets/icon3.png',
    },
];

const OurServices = () => {
    return (
        <section className="py-16 bg-gray-100 relative bg-cover h-full bg-center" style={{ backgroundImage: 'url(/assets/services.png)' }}>
            <div className="max-w-7xl mx-auto md:mt-[8rem] mt-[5rem] px-6 text-center">
                <h5 className="text-3xl md:text-4xl font-bold text-[#EEC044] mb-6 md:mb-10 caveat">Our Services</h5>
                <h1 className="text-2xl md:text-4xl font-bold text-[#1F1E17] poppins mb-6 md:mb-10">What Do We Offer...</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 px-2 md:px-10 lg:px-20">
                    {services.map((service) => (
                        <div key={service.id} className="relative hover:scale-105 hover:cursor-pointer transition-transform duration-300 bg-white shadow-lg rounded-lg overflow-hidden group">
                            {/* Main Image */}
                            <div className="relative w-full h-[0rem] sm:h-[5rem] md:h-40">
                                <Image src={service.image} alt={service.title} layout="fill" objectFit="cover" className="rounded-t-lg" />
                            </div>


                            {/* Title & Description */}
                            <div className="p-4 md:p-6 text-gray-800 text-start flex flex-col">
                                <h3 className="text-md md:text-xl text-[#4BAF47] font-semibold poppins">{service.title}</h3>
                                <p className="text-gray-600 mt-2 text-sm md:text-base">{service.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurServices;

{/* Small Icon */ }
{/* <div className="absolute md:block hidden top-[50%] right-1 transform -translate-x-1/2 -translate-y-1/2  p-2 rounded-full ">
    <Image src={service.icon} alt="Icon" width={30} height={30} />
</div> */}