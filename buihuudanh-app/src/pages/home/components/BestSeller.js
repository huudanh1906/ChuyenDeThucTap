import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../../../components/ProductCard'; // Adjust the import path as necessary

const BestSeller = () => {
    const [bestSeller, setBestSeller] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/best-seller'); // Adjust the API endpoint
                // Map the response data to extract the 'product' objects from each item
                setBestSeller(response.data.map(item => item.product).slice(0, 8)); // Get the products
            } catch (err) {
                setError('Failed to fetch best-seller');
            } finally {
                setLoading(false);
            }
        };

        fetchBestSellers();
    }, []); // Empty dependency array means this effect runs once on mount

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>{error}</div>; // Error state
    }

    return (
        <div className="container mx-auto px-4 py-10" style={{ width: '89%', borderRadius: '15px' }}>
            <h3 className="text-xl font-bold mb-6 text-center">Sản phẩm bán chạy</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {bestSeller.map((productItem) => (
                    <ProductCard key={productItem.id} productItem={productItem} />
                ))}
            </div>
        </div>
    );
};

export default BestSeller;
