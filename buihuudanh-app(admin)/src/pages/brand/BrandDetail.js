import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BrandDetail = () => {
    const { id } = useParams();
    const [brand, setBrand] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBrand = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/admin/brand/show/${id}`);
                setBrand(response.data);
            } catch (error) {
                console.error("Error fetching brand details:", error);
                navigate('/admin/brand'); // Redirect to brand list on error
            }
        };

        fetchBrand();
    }, [id, navigate]);

    if (!brand) return <div>Loading...</div>;

    return (
        <div className="container mx-60 p-4">
            <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Tên thương hiệu: {brand.name}</h2>
                    <button
                        onClick={() => navigate('/admin/brands')}
                        className="bg-green-500 text-white py-2 px-4 rounded flex items-center"
                    >
                        <i className="fas fa-arrow-left mr-2"></i>
                        Về Danh sách
                    </button>
                </div>

                <div className="flex m-4">
                    <div className="w-1/3">
                        <img
                            src={`http://localhost:8000/imgs/brands/${brand.image}`}
                            alt={brand.name}
                            className="w-36 h-36 object-fill"
                        />
                    </div>
                    <div className="w-2/3 pl-4">
                        <p>ID: {brand.id}</p>
                        <p>Miêu tả: {brand.description}</p>
                        <p>Created At: {new Date(brand.created_at).toLocaleDateString()}</p>
                        <p>Updated At: {new Date(brand.updated_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandDetail;
