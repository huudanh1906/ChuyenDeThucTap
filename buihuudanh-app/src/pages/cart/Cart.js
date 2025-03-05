import React, { useEffect } from 'react';
import { useCart } from '../../components/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const { cartItems, updateCartItems } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = () => {
        const existingCart = JSON.parse(sessionStorage.getItem('cart')) || [];
        updateCartItems(existingCart); // Update context with existing cart
    };

    const handleQuantityChange = (id, newQty) => {
        const updatedCart = cartItems.map((item) =>
            item.id === id ? { ...item, qty: newQty } : item
        );
        updateCartItems(updatedCart); // Update context and session storage
    };

    const handleRemoveItem = (id) => {
        const updatedCart = cartItems.filter(item => item.id !== id);
        updateCartItems(updatedCart); // Update context and session storage
    };

    // Add to Order function
    const addToOrder = async () => {
        const orderDetails = {
            note: "Your order note", // Add any order notes if required
            status: 1, // Assuming 1 is for active
        };

        // Retrieve the token from localStorage
        const token = localStorage.getItem('authToken');

        try {
            const response = await fetch('http://localhost:8000/order-add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the token here
                },
                body: JSON.stringify(orderDetails),
            });

            if (!response.ok) {
                throw new Error('Failed to create order');
            }

            const data = await response.json();
            const orderId = data.order.id; // Get the order ID from the response
            console.log(data);

            // Now, add each item to the OrderDetail
            await Promise.all(cartItems.map(item => addOrderDetail(orderId, item)));

            // Optionally, clear the cart after successful order placement
            updateCartItems([]);
            sessionStorage.removeItem('cart');

            navigate('/order-alert');

        } catch (error) {
            console.error(error);
        }
    };

    // Helper function to add order details
    const addOrderDetail = async (orderId, item) => {
        const orderDetailData = {
            order_id: orderId,
            product_id: item.id,
            price: item.price,
            qty: item.qty,
            discount: item.discount || 0,
            amount: item.price * item.qty * (1 - (item.discount || 0) / 100), // Calculate the total amount after discount
        };

        try {
            const response = await fetch('http://localhost:8000/order-detail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Include the token here if needed
                },
                body: JSON.stringify(orderDetailData),
            });

            if (!response.ok) {
                throw new Error('Failed to add order detail');
            }

            await response.json(); // You may want to handle the response if needed

        } catch (error) {
            console.error(error);
            alert("Error adding order detail: " + error.message);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold mb-4">Your Shopping Cart</h1>
            <table className="table-auto w-full text-left">
                <thead>
                    <tr>
                        <th className="px-4 py-2">#</th>
                        <th className="px-4 py-2">Image</th>
                        <th className="px-4 py-2">Product Name</th>
                        <th className="px-4 py-2">Price</th>
                        <th className="px-4 py-2">Quantity</th>
                        <th className="px-4 py-2">Total</th>
                        <th className="px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.length > 0 ? (
                        cartItems.map((item, index) => (
                            <tr key={item.id} className="border-t">
                                <td className="px-4 py-2">{index + 1}</td>
                                <td className="px-4 py-2">
                                    <img src={item.image} alt={item.name} className="w-16 h-16" />
                                </td>
                                <td className="px-4 py-2">{item.name}</td>
                                <td className="px-4 py-2">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
                                <td className="px-4 py-2">
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.qty}
                                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                        className="border rounded w-16 text-center"
                                    />
                                </td>
                                <td className="px-4 py-2">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.qty * item.price)}
                                </td>
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                                    >
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center py-4">Your cart is empty.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            <div className="mt-4">
                <button onClick={addToOrder} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Place Order
                </button>
            </div>
        </div>
    );
};

export default Cart;
