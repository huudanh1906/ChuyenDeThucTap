import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/admin/category');
                setCategories(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching categories');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const deleteCategory = async (id) => {
        try {
            await axios.get(`http://localhost:8000/admin/category/delete/${id}`);
            setCategories(categories.filter(category => category.id !== id));
        } catch (err) {
            console.error('Error deleting category', err);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        try {
            await axios.get(`http://localhost:8000/admin/category/status/${id}`);
            setCategories(categories.map(category =>
                category.id === id ? { ...category, status: currentStatus === 1 ? 2 : 1 } : category
            ));
        } catch (err) {
            console.error('Error toggling category status', err);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="container mx-60 p-4">
            <h2 className="text-2xl font-bold mb-4">Quản lí danh mục</h2>
            <div className="flex justify-end mb-4">
                <button className="bg-green-500 text-white px-4 py-2 rounded mx-2">
                    <Link to="/admin/categories/trash" className="flex items-center justify-center h-full w-full">Trash</Link>
                </button>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                    <Link to="/admin/categories/create" className="flex items-center justify-center h-full w-full">Add</Link>
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="table-auto w-full bg-white shadow-md rounded-lg">
                    <thead>
                        <tr className="bg-gray-200 text-left text-sm">
                            <th className="p-3">#</th>
                            <th className="p-3">Image</th>
                            <th className="p-3">Category Name</th>
                            <th className="p-3">Actions</th>
                            <th className="p-3">ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category, index) => (
                            <tr key={category.id} className="border-t">
                                <td className="p-3"><input type="checkbox" /></td>
                                <td className="p-3">
                                    <img
                                        src={`http://localhost:8000/imgs/categorys/${category.image}`}
                                        alt={category.name}
                                        className="w-16 h-16 object-cover rounded"
                                    />
                                </td>
                                <td className="p-3">{category.name}</td>
                                <td className="p-3 space-x-2">
                                    <button
                                        onClick={() => toggleStatus(category.id, category.status)}
                                        className={category.status === 1 ? "bg-green-500 text-white px-2 py-1 rounded" : "bg-red-500 text-white px-2 py-1 rounded"}>
                                        {category.status === 1 ? 'Active' : 'Inactive'}
                                    </button>
                                    <Link to={`/admin/categories/show/${category.id}`} className="bg-blue-500 text-white px-2 py-1 rounded">View</Link>
                                    <Link to={`/admin/categories/edit/${category.id}`} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</Link>
                                    <button
                                        onClick={() => deleteCategory(category.id)}
                                        className="bg-red-500 text-white px-2 py-1 rounded">
                                        Delete
                                    </button>
                                </td>
                                <td className="p-3">{category.id}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Categories;
