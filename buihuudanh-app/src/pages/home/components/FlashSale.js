import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../../../components/ProductCard'; // Adjust the import path as necessary

const FlashSale = () => {
    const [productSale, setProductSale] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSaleProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/flash-sale'); // Adjust the API endpoint
                setProductSale(response.data.data.slice(0, 8)); // Access the paginated data
            } catch (err) {
                setError('Failed to fetch sale products');
            } finally {
                setLoading(false);
            }
        };

        fetchSaleProducts();
    }, []); // Empty dependency array means this effect runs once on mount

    if (loading) {
        return <div>Loading...</div>; // Loading state
    }

    if (error) {
        return <div>{error}</div>; // Error state
    }

    return (
        <div className="container mx-auto px-4 py-10" style={{ width: '89%', borderRadius: '15px' }}>
            <h3 className="text-xl font-bold mb-6 text-center">Sản phẩm giảm giá</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {productSale.map((productItem) => (
                    <ProductCard key={productItem.id} productItem={productItem} />
                ))}
            </div>
        </div>
    );
};

export default FlashSale;
