import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderDetail = () => {
    const { orderId } = useParams();
    console.log(orderId); // Ensure this logs the correct orderId from the URL

    const [orderDetails, setOrderDetails] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/order-detail/${orderId}`);
                setOrderDetails(response.data);
            } catch (err) {
                setError('Failed to fetch order details');
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    // Calculate total price
    const calculateTotalPrice = () => {
        return orderDetails.reduce((total, detail) => total + (detail.price * detail.qty), 0).toFixed(2);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Order Details</h2>

            {error && <p className="text-red-600">{error}</p>}

            {orderDetails.length === 0 ? (
                <p>No order details found</p>
            ) : (
                <ul>
                    {orderDetails.map((detail, index) => (
                        <li key={index} className="border p-4 mb-4 rounded-lg shadow-md">
                            <p><strong>Product Name:</strong> {detail.product_name}</p>
                            <p><strong>Quantity:</strong> {detail.qty}</p>
                            <p><strong>Price:</strong> ${detail.price}</p>
                            
                            {/* Add the image */}
                            {detail.product_image && (
                                <img 
                                    src={detail.product_image} 
                                    alt={detail.product_name} 
                                    className="w-32 h-32 object-cover mt-2"
                                />
                            )}
                        </li>
                    ))}
                </ul>
            )}

            {/* Display Total Price */}
            {orderDetails.length > 0 && (
                <div className="mt-4 text-lg font-semibold">
                    <p><strong>Total Price:</strong> ${calculateTotalPrice()}</p>
                </div>
            )}
        </div>
    );
};

export default OrderDetail;
