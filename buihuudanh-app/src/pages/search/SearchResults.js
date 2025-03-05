import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';

const SearchResults = () => {
    const [products, setProducts] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search).get('search');
        if (query) {
            axios.get(`http://localhost:8000/tim-kiem?search=${encodeURIComponent(query)}`)
                .then(response => {
                    setProducts(response.data.data); // Adjust according to your response structure
                })
                .catch(error => {
                    console.error('Error fetching search results:', error);
                });
        }
    }, [location.search]);

    return (
        <div className="container mx-auto px-4 py-10" style={{ width: '89%', borderRadius: '15px' }}>
            <h3 className="text-xl font-bold mb-6 text-center">Kết quả tìm kiếm</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((productItem) => (
                    <ProductCard key={productItem.id} productItem={productItem} />
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
