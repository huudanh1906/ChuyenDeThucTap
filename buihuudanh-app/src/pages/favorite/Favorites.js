import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        // Load favorites from local storage or your API
        const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
        setFavorites(storedFavorites);
    }, []);

    const handleRemoveFromFavorites = (id) => {
        const updatedFavorites = favorites.filter(item => item.id !== id);
        setFavorites(updatedFavorites);
        // Update local storage
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    return (
        <div className="container mx-auto my-4">
            <h1 className="text-2xl font-bold mb-4">Yêu thích</h1>
            {favorites.length === 0 ? (
                <p className="text-lg">Bạn chưa có sản phẩm nào trong danh sách yêu thích.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favorites.map(product => (
                        <div key={product.id} className="flex flex-col bg-white rounded-lg shadow-md overflow-hidden">
                            <Link to={`/chi-tiet-san-pham/${product.slug}`}>
                                <img
                                    src={`http://localhost:8000/imgs/products/${encodeURIComponent(product.image)}`}
                                    alt={product.name}
                                    className="h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="font-semibold text-lg">{product.name}</h2>
                                    <p className="text-red-600 text-lg">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                    </p>
                                </div>
                            </Link>
                            <button
                                onClick={() => handleRemoveFromFavorites(product.id)}
                                className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-200"
                            >
                                Xóa khỏi yêu thích
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;