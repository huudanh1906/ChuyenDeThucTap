import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Slider = () => {
    const [slides, setSlides] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const totalSlides = slides.length;

    // Fetch banners from the backend
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const response = await axios.get('http://localhost:8000/admin/banner'); // Update with your actual endpoint
                setSlides(response.data);
            } catch (error) {
                console.error("Error fetching banners:", error);
            }
        };

        fetchBanners();
    }, []);

    // Function to change the slide
    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
    };

    // Auto-run slider
    useEffect(() => {
        const interval = setInterval(nextSlide, 3000); // Change slide every 3 seconds
        return () => clearInterval(interval); // Clear interval on component unmount
    }, [totalSlides]);

    return (
        <div className="flex">
            <div className="relative w-full slideshow">
                {slides.map((item, index) => (
                    <div className={`mySlides ${index === currentSlide ? 'block' : 'hidden'}`} key={item.id}>
                        <img
                            src={`http://localhost:8000/imgs/banners/${item.image}`} // Ensure the URL is correct
                            alt={item.name}
                            className="w-full h-[270px] object-fill rounded"
                        />
                    </div>
                ))}

                <div className="left-0 right-0 text-center">
                    {slides.map((_, index) => (
                        <span
                            key={index}
                            className={`dot inline-block cursor-pointer w-3 h-3 mx-1 rounded-full ${index === currentSlide ? 'bg-blue-500' : 'bg-gray-300'}`}
                            onClick={() => setCurrentSlide(index)}
                        ></span>
                    ))}
                </div>

                {/* Next and previous buttons */}
                <button className="prev absolute top-1/2 left-0 transform -translate-y-1/2" onClick={prevSlide}>
                    <i className="icon_prev fa-solid fa-square-caret-left"></i>
                </button>
                <button className="next absolute top-1/2 right-0 transform -translate-y-1/2" onClick={nextSlide}>
                    <i className="icon_next fa-solid fa-square-caret-right"></i>
                </button>
            </div>

            <div className="img_right">
                <img
                    src="http://localhost:8000/imgs/sideshow5.jpg"
                    alt=""
                    className="w-full h-32 object-fill rounded-md"
                />
                <img
                    src="http://localhost:8000/imgs/sideshow1.jpg"
                    alt=""
                    className="w-full h-32 object-fill rounded-md"
                />
            </div>
        </div>
    );
};

export default Slider;
