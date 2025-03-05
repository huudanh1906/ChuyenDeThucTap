import React, { useState } from 'react';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCart } from './CartContext';
import { useNavigate, Link } from 'react-router-dom'; // Import Link here

const ProductCard = ({ productItem }) => {
    const { id, name, image, pricesale, price, slug } = productItem;
    const { cartItems, updateCartItems } = useCart();
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate(); // For navigation

    const handleAddToCart = () => {
        const newItem = {
            id,
            name,
            price: pricesale || price,
            qty: 1,
            image: `http://localhost:8000/imgs/products/${image}`,
        };

        const existingItemIndex = cartItems.findIndex(item => item.id === id);
        let updatedCart;

        if (existingItemIndex > -1) {
            updatedCart = cartItems.map((item, index) =>
                index === existingItemIndex ? { ...item, qty: item.qty + 1 } : item
            );
        } else {
            updatedCart = [...cartItems, newItem];
        }

        updateCartItems(updatedCart);

        setSuccessMessage('Added to cart!');
        setTimeout(() => setSuccessMessage(''), 2000);
    };

    const handleAddToFavorites = () => {
        // Add to favorites logic
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

        if (!favorites.some(item => item.id === id)) {
            favorites.push(productItem); // Add the productItem to favorites
            localStorage.setItem('favorites', JSON.stringify(favorites)); // Update local storage
        }

        setSuccessMessage('Added to favorite!');
        setTimeout(() => setSuccessMessage(''), 2000);
    };

    return (
        <div className="flex flex-col justify-between h-full rounded-lg shadow-lg hover:shadow-xl transition-transform duration-200 hover:scale-105 bg-white border border-gray-200">
            <Link to={`/chi-tiet-san-pham/${slug}`} className="block">
                <img
                    src={`http://localhost:8000/imgs/products/${encodeURIComponent(image)}`}
                    alt={name}
                    className="h-48 object-cover rounded-t-lg"
                />
                <div className="p-4 flex flex-col flex-grow">
                    <h2 className="font-semibold text-lg mb-2 text-blue-700">{name}</h2>

                    <div className="mb-4">
                        {pricesale ? (
                            <>
                                <p className="text-lg text-red-600 font-bold">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(pricesale)}
                                </p>
                                <p className="text-sm line-through text-gray-500">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                                </p>
                            </>
                        ) : (
                            <p className="text-lg text-green-600 font-bold">
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                            </p>
                        )}
                    </div>
                </div>
            </Link>
            <div className="flex justify-between items-center mt-2">
                <button
                    onClick={handleAddToCart}
                    className="text-red hover:bg-blue-300 justify-start font-semibold text-2xl flex items-center rounded-lg py-2 transition-colors duration-200"
                >
                    <FaShoppingCart className="mr-2" />
                </button>
                <button
                    onClick={handleAddToFavorites}
                    className="bg-transparent text-red-600 hover:text-red-800 justify-center font-semibold text-2xl flex items-center rounded-lg py-2 transition-colors duration-200"
                >
                    <FaHeart className="mr-2" />
                </button>
            </div>

            {successMessage && (
                <div className="mt-2 text-green-600 font-semibold text-center">
                    {successMessage}
                </div>
            )}
        </div>
    );
};

export default ProductCard;