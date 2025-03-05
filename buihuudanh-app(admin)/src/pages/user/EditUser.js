import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditUser = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: '',
        phone: '',
        email: '',
        gender: '',
        address: '',
        username: '',
        roles: 'customer',
        status: '1',
        image: null,
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch user data
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/admin/user/edit/${id}`);
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user:', error);
                navigate('/admin/user'); // Redirect on error
            }
        };

        fetchUser();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        // Convert the file to Base64
        const reader = new FileReader();
        reader.onloadend = () => {
            setUser((prev) => ({
                ...prev,
                image: reader.result, // Set Base64 image
            }));
        };
        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create a JSON object for the user data
        const updatedUser = {
            ...user,
            image: user.image ? user.image.split(',')[1] : null, // Only send the Base64 data
        };

        try {
            await axios.put(`http://localhost:8000/admin/user/update/${id}`, updatedUser, {
                headers: {
                    'Content-Type': 'application/json', // Set JSON content type
                },
            });
            navigate('/admin/user'); // Redirect after successful update
        } catch (error) {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Error updating user:', error);
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-5 bg-white rounded shadow-md">
            <h1 className="text-2xl font-bold mb-5">Chỉnh sửa thành viên</h1>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ tên</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={user.name}
                            onChange={handleChange}
                            className={`mt-1 block w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.name && <span className="text-red-500 text-sm">{errors.name[0]}</span>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Điện thoại</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={user.phone}
                            onChange={handleChange}
                            className={`mt-1 block w-full p-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.phone && <span className="text-red-500 text-sm">{errors.phone[0]}</span>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={user.email}
                            onChange={handleChange}
                            className={`mt-1 block w-full p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email[0]}</span>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Giới tính</label>
                        <select
                            id="gender"
                            name="gender"
                            value={user.gender}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="1">Nam</option>
                            <option value="0">Nữ</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={user.address}
                            onChange={handleChange}
                            className={`mt-1 block w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.address && <span className="text-red-500 text-sm">{errors.address[0]}</span>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={user.username}
                            onChange={handleChange}
                            className={`mt-1 block w-full p-2 border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.username && <span className="text-red-500 text-sm">{errors.username[0]}</span>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            onChange={handleChange}
                            className={`mt-1 block w-full p-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password[0]}</span>}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="roles" className="block text-sm font-medium text-gray-700">Quyền</label>
                        <select
                            id="roles"
                            name="roles"
                            value={user.roles}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="customer">Khách hàng</option>
                            <option value="admin">Quản lý</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700">Hình</label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            onChange={handleFileChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Trạng thái</label>
                        <select
                            id="status"
                            name="status"
                            value={user.status}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="1">Xuất bản</option>
                            <option value="2">Chưa xuất bản</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end mt-6">
                    <button type="submit" className="mr-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500">
                        <i className="fa fa-save"></i> Lưu
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/admin/user')}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                    >
                        <i className="fa fa-arrow-left"></i> Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUser;
