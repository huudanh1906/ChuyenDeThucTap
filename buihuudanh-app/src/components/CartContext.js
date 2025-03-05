// src/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        // Retrieve cart from session storage when context is initialized
        return JSON.parse(sessionStorage.getItem('cart')) || [];
    });

    const cartCount = cartItems.length;

    // Function to update cart items in session storage
    const updateCartItems = (newItems) => {
        setCartItems(newItems);
        sessionStorage.setItem('cart', JSON.stringify(newItems)); // Save to session storage
    };

    return (
        <CartContext.Provider value={{ cartCount, cartItems, updateCartItems }}>
            {children}
        </CartContext.Provider>
    );
};
