import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faClipboardList, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import NewProduct from '../home/components/NewProduct';

const OrderSuccess = () => {
    const navigate = useNavigate();

    // Retrieve the logged-in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    console.log(user); // Log to see if userId exists


    const goToHome = () => {
        navigate('/'); // Navigate to homepage
    };

    const goToOrders = () => {
            navigate(`/order`);
    };


    return (
        <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center space-x-2">
                <FontAwesomeIcon icon={faExclamationCircle} className="text-yellow-500" />
                <span>Đặt hàng thành công!</span>
            </h1>
            <p className="mb-8">Cùng chúng tôi bảo vệ quyền lợi của bạn - Không chuyển tiền trước cho Shipper khi đơn hàng chưa được giao tới với bất kỳ lý do gì.</p>

            <div className="flex justify-center space-x-4">
                <button
                    onClick={goToHome}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    <FontAwesomeIcon icon={faHome} className="mr-2" />
                    Home
                </button>
                <button
                    onClick={goToOrders}
                    className="flex items-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                    <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
                    Orders
                </button>
            </div>

            <NewProduct />
        </div>
    );
};

export default OrderSuccess;
