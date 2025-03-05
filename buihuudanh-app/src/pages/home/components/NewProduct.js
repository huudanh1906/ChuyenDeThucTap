import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../../../components/ProductCard'; // Assuming ProductCard is a separate component

const NewProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch new products from the backend
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/san-pham'); // Adjust the endpoint as necessary
                setProducts(response.data.data.slice(0, 8)); // Assuming response structure contains 'data'
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Placeholder while loading
    }

    return (
        <div className="container mx-auto px-4 py-10" style={{ width: '89%', borderRadius: '15px' }}>
            <h3 className="text-xl font-bold mb-6 text-center">Sản phẩm mới</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(product => (
                    <ProductCard key={product.id} productItem={product} />
                ))}
            </div>
        </div>
    );
};

export default NewProduct;
