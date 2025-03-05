// Category.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Category = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        // Fetch the category data from the backend
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:8000/category'); // Adjust API endpoint as needed
                setCategories(response.data); // Adjust this based on your API response structure
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div className="w-[89%] h-[150px] rounded-lg border border-gray-300 shadow-lg p-3 mx-20">
            <h5 className="text-lg font-bold text-center">DANH MỤC</h5>
            <div className="flex space-x-4 overflow-auto">
                {categories.map(item => (
                    <div key={item.id} className="flex-shrink-0">
                        <ul className="flex flex-col items-center">
                            <li className="mb-2">
                                <Link to={`/danh-muc/${item.slug}`} className="flex flex-col items-center text-center">
                                    <img
                                        src={`http://localhost:8000/imgs/categorys/${item.image}`} // Adjust based on your image path
                                        alt={item.name}
                                        className="h-10 w-10 rounded-full" // Adjust as needed
                                    />
                                    <p className="mt-1 text-sm">{item.name}</p>
                                </Link>
                            </li>
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Category;
