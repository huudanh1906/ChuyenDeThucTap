import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../../components/ProductCard';
import { useParams } from 'react-router-dom';

const BrandProduct = () => {
    const { slug } = useParams(); // Getting the brand slug from the URL
    const [products, setProducts] = useState([]);
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [isOnPromotion, setIsOnPromotion] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);

    // Price ranges similar to Product.js
    const priceRanges = [
        { label: '< 1,000,000', value: '0-1000000' },
        { label: '1,000,000 - 5,000,000', value: '1000000-5000000' },
        { label: '5,000,000 - 10,000,000', value: '5000000-10000000' },
        { label: '10,000,000 - 20,000,000', value: '10000000-20000000' },
        { label: '> 20,000,000', value: '20000000-99999999999' },
    ];

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const fetchProducts = async (page = 1) => {
        try {
            const response = await axios.get(`http://localhost:8000/thuong-hieu/${slug}`, {
                params: {
                    price_range: selectedPriceRange,
                    on_promotion: isOnPromotion,
                    sort_order: sortOrder,
                    page,
                },
            });
            setProducts(response.data.data);
            setPagination(response.data); // Assume pagination data in response
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleFilterChange = () => {
        setCurrentPage(1);
        fetchProducts(1); // Reset to page 1 when filters change
    };

    useEffect(() => {
        handleFilterChange();
    }, [selectedPriceRange, isOnPromotion, sortOrder]);

    return (
        <div className="container mx-auto p-4">
            {/* Filter Section */}
            <div className="filter bg-white w-2/3 h-20 my-5 mx-auto rounded-lg flex items-center justify-around shadow-md">
                {/* Price Filter */}
                <div className="filter_child border border-gray-300 rounded-lg p-2">
                    <span>Giá:</span>
                    <select
                        value={selectedPriceRange}
                        onChange={(e) => setSelectedPriceRange(e.target.value)}
                        className="ml-2 h-8 border-none outline-none rounded-lg"
                    >
                        <option value="">Chọn khoảng giá</option>
                        {priceRanges.map((range) => (
                            <option key={range.value} value={range.value}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                </div>
                {/* Promotion Filter */}
                <div className="filter_child border border-gray-300 rounded-lg p-2">
                    <span>Khuyến mãi:</span>
                    <select
                        value={isOnPromotion}
                        onChange={(e) => setIsOnPromotion(e.target.value)}
                        className="ml-2 h-8 border-none outline-none rounded-lg"
                    >
                        <option value="">Chọn điều kiện</option>
                        <option value="promotion">Đang khuyến mãi</option>
                    </select>
                </div>
                {/* Sorting Filter */}
                <div className="filter_child border border-gray-300 rounded-lg p-2">
                    <span>Sắp xếp:</span>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="ml-2 h-8 border-none outline-none rounded-lg"
                    >
                        <option value="newest">Sản phẩm mới nhất</option>
                        <option value="high_to_low">Giá cao đến thấp</option>
                        <option value="low_to_high">Giá thấp đến cao</option>
                        <option value="best_seller">Bán chạy nhất</option>
                    </select>
                </div>
            </div>

            {/* Product Section */}
            <div className="container_product_new bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-4 text-center">Sản phẩm</h3>
                <div className="product_new grid grid-cols-4 gap-4">
                    {products.length > 0 ? (
                        products.map((productItem) => (
                            <ProductCard key={productItem.id} productItem={productItem} />
                        ))
                    ) : (
                        <p>Không có sản phẩm nào trong danh mục này.</p>
                    )}
                </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                {pagination.links && pagination.links.map((link, index) => {
                    const cleanLabel = link.label.replace(/&laquo;|&raquo;/g, '').trim();

                    return (
                        <button
                            key={index}
                            onClick={() => {
                                if (link.url) {
                                    if (cleanLabel === "Previous" && currentPage > 1) {
                                        setCurrentPage(currentPage - 1);
                                    } else if (cleanLabel === "Next") {
                                        setCurrentPage(currentPage + 1);
                                    } else {
                                        setCurrentPage(parseInt(cleanLabel));
                                    }
                                }
                            }}
                            className={`mx-1 px-4 py-2 border rounded-md transition-colors ${link.active
                                ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                                : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300'
                                }`}
                            disabled={!link.url}
                        >
                            {cleanLabel}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default BrandProduct;
