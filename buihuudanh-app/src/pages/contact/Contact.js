import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        title: '',
        content: '',
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const mapRef = useRef(null); // Reference for the map div

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage('');

        try {
            const response = await axios.post('http://localhost:8000/lien-he', formData);
            if (response.data.status === 'success') {
                setSuccessMessage('Your message has been sent successfully!');
                setFormData({ name: '', email: '', phone: '', title: '', content: '' });
            } else {
                setErrors(response.data.errors); // Adjust based on your API response structure
            }
        } catch (error) {
            // Handle error responses here
            console.error("There was an error sending the message!", error);
            setErrors({ general: 'An error occurred. Please try again later.' });
        }
    };

    const initMap = () => {
        const location = { lat: 10.8499565, lng: 106.771543 };
        const map = new window.google.maps.Map(mapRef.current, {
            zoom: 15,
            center: location,
        });
        new window.google.maps.Marker({ position: location, map });
    };

    useEffect(() => {
        const loadScript = (url) => {
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = url;
                script.async = true;
                script.onload = resolve;
                document.body.appendChild(script);
            });
        };

        loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao&libraries=places")
            .then(() => {
                initMap();
            });
    }, []);

    return (
        <div className="container mx-auto mt-5 bg-white mb-2 p-5 rounded-md shadow-md">
            <h2 className="text-center text-2xl mb-4">Liên Hệ Chúng Tôi</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h4 className="text-lg font-semibold">Địa chỉ của chúng tôi</h4>
                    <p>Số 1 Võ Văn Ngân, Thành Phố Thủ Đức, TP.HCM</p>
                    <p>Email: huudanh@gmail.com</p>
                    <p>Điện thoại: (012) 345-6789</p>
                    <div ref={mapRef} className="h-64 mt-4"></div>
                </div>
                <div>
                    <h4 className="text-lg font-semibold">Gửi tin nhắn cho chúng tôi</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-1">Họ và Tên:</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`border rounded w-full p-2 ${errors.name ? 'border-red-500' : ''}`}
                            />
                            {errors.name && <span className="text-red-500">{errors.name}</span>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block mb-1">Email:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`border rounded w-full p-2 ${errors.email ? 'border-red-500' : ''}`}
                            />
                            {errors.email && <span className="text-red-500">{errors.email}</span>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block mb-1">Điện Thoại:</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`border rounded w-full p-2 ${errors.phone ? 'border-red-500' : ''}`}
                            />
                            {errors.phone && <span className="text-red-500">{errors.phone}</span>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="title" className="block mb-1">Tiêu đề liên hệ:</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`border rounded w-full p-2 ${errors.title ? 'border-red-500' : ''}`}
                            />
                            {errors.title && <span className="text-red-500">{errors.title}</span>}
                        </div>
                        <div className="mb-4">
                            <label htmlFor="content" className="block mb-1">Tin Nhắn:</label>
                            <textarea
                                id="content"
                                name="content"
                                rows="5"
                                value={formData.content}
                                onChange={handleChange}
                                className={`border rounded w-full p-2 ${errors.content ? 'border-red-500' : ''}`}
                            ></textarea>
                            {errors.content && <span className="text-red-500">{errors.content}</span>}
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Gửi Tin Nhắn</button>
                    </form>
                    {successMessage && (
                        <div className="bg-green-500 text-white p-3 mb-4 rounded-md text-center">
                            {successMessage}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Contact;
