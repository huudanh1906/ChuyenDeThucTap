import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateCategory = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [parentId, setParentId] = useState(0);
    const [sortOrder, setSortOrder] = useState(0);
    const [status, setStatus] = useState(1);
    const [image, setImage] = useState(null);
    const [parentCategories, setParentCategories] = useState([]);
    const navigate = useNavigate(); 

    useEffect(() => {
        // Fetch parent categories for dropdown
        axios.get('http://localhost:8000/admin/category')
            .then(response => {
                setParentCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching parent categories:', error);
            });
    }, []);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('parent_id', parentId);
        formData.append('sort_order', sortOrder);
        formData.append('status', status);
        if (image) formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:8000/admin/category/store', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Category created successfully!');
            navigate('/admin/categories');
        } catch (error) {
            console.error('Error creating category:', error);
            alert('Failed to create category.');
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Create New Category</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700 font-semibold">Category Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold">Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold">Parent Category</label>
                    <select
                        value={parentId}
                        onChange={(e) => setParentId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                    >
                        <option value="">None</option>
                        {parentCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold">Sort Order</label>
                    <input
                        type="number"
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold">Status</label>
                    <select value={status} onChange={(e) => setStatus(Number(e.target.value))}>
                        <option value={1}>Active</option>
                        <option value={2}>Inactive</option>
                    </select>
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold">Image</label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                    />
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
                    >
                        Create Category
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCategory;
