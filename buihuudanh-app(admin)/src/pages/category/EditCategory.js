import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [category, setCategory] = useState({
        name: '',
        description: '',
        parent_id: 0,
        sort_order: 0,
        image: null,
        status: 2
    });
    const [parentCategories, setParentCategories] = useState([]);
    const [sortOrders, setSortOrders] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        // Fetch the category data for editing
        axios.get(`http://localhost:8000/admin/category/edit/${id}`)
            .then(response => {
                console.log('API Response:', response.data);
                const { category, htmlparenid, htmlsortorder } = response.data;
    
                if (category) {
                    setCategory({
                        name: category.name || '',
                        description: category.description || '',
                        parent_id: category.parent_id || 0,
                        sort_order: category.sort_order || 0,
                        image: category.image || null,
                        status: category.status || 2
                    });
                }
    
                setParentCategories(htmlparenid || []);
                setSortOrders(htmlsortorder || []);
            })
            .catch(error => {
                console.error('Error fetching category', error);
            });
    }, [id]);
       
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategory({
            ...category,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setCategory({
                ...category,
                image: reader.result // Store the base64 image string
            });
        };
        if (file) {
            reader.readAsDataURL(file); // Convert to base64
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const jsonData = {
            name: category.name,
            description: category.description,
            parent_id: category.parent_id,
            sort_order: category.sort_order,
            status: category.status,
            image: category.image // Send base64 string
        };

        axios.put(`http://localhost:8000/admin/category/update/${id}`, jsonData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then(() => {
            navigate('/admin/categories');
        })
        .catch(error => {
            if (error.response && error.response.data.errors) {
                setErrors(error.response.data.errors);
            }
            console.error('Error updating category', error);
        });
    };

    return (
        <div className="container mx-60 p-6">
            <div className="flex justify-end mb-4">
                <a href="/admin/categories" className="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition">
                    <i className="fas fa-arrow-left mr-2"></i>
                    Về Danh sách
                </a>
            </div>
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Tên danh mục</label>
                    <input
                        type="text"
                        name="name"
                        value={category.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    {errors.name && <span className="text-red-500">{errors.name}</span>}
                </div>
                <div className="mb-4">
                    <label htmlFor="description" className="block text-gray-700 font-bold mb-2">Mô tả</label>
                    <textarea
                        name="description"
                        value={category.description}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="parent_id" className="block text-gray-700 font-bold mb-2">Danh mục cha</label>
                    <select
                        name="parent_id"
                        value={category.parent_id}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="0">None</option>
                        {parentCategories.map((parent) => (
                            <option key={parent.id} value={parent.id}>{parent.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="sort_order" className="block text-gray-700 font-bold mb-2">Sắp xếp</label>
                    <select
                        name="sort_order"
                        value={category.sort_order}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="0">None</option>
                        {sortOrders.map((order) => (
                            <option key={order.id} value={order.id}>{order.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="image" className="block text-gray-700 font-bold mb-2">Hình</label>
                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="status" className="block text-gray-700 font-bold mb-2">Trạng thái</label>
                    <select
                        name="status"
                        value={category.status}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="2">Chưa xuất bản</option>
                        <option value="1">Xuất bản</option>
                    </select>
                </div>
                <div className="mb-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
                    >
                        Sửa danh mục
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCategory;
