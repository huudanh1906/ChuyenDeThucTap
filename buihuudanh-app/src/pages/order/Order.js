import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Order = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = location.state?.user || JSON.parse(localStorage.getItem('user')); // Fallback to localStorage if state is not available

    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (user && !orders.length) {  // Avoid fetching if orders are already loaded
            const fetchOrders = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/order/${user.id}`);
                    setOrders(response.data);
                } catch (err) {
                    setError('Failed to fetch orders');
                }
            };
            fetchOrders();
        } else if (!user) {
            setError('User not logged in');
        }
    }, [user, orders.length]); // Added orders.length to prevent unnecessary refetch


    const viewOrderDetail = (orderId) => {
        navigate(`/order-detail/${orderId}`); // Navigate to the order detail page
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Your Orders</h2>

            {error && <p className="text-red-600">{error}</p>}

            {orders.length === 0 ? (
                <p>No orders found</p>
            ) : (
                <ul>
                    {orders.map((order) => (
                        <li
                            key={order.id}
                            className="border p-4 mb-4 rounded-lg shadow-md cursor-pointer"
                            onClick={() => viewOrderDetail(order.id)} // OnClick to navigate
                        >
                            <p><strong>Order Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                            <OrderDetailsFetcher orderId={order.id} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

// Component to fetch order details and display total price
const OrderDetailsFetcher = ({ orderId }) => {
    const [orderDetails, setOrderDetails] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/order-detail/${orderId}`);
                const details = response.data;
                setOrderDetails(details);

                const total = details.reduce((total, detail) => total + detail.price * detail.qty, 0);
                setTotalPrice(total);
            } catch (err) {
                setError('Failed to fetch order details');
            }
        };

        fetchDetails();
    }, [orderId]);

    return (
        <div>
            {error && <p className="text-red-600">{error}</p>}
            {orderDetails.length > 0 && (
                <p><strong>Total Price:</strong> ${totalPrice}</p>
            )}
        </div>
    );
};

export default Order;
