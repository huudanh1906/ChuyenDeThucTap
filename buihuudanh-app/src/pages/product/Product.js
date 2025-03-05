import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaShoppingCart, FaHeart } from 'react-icons/fa';
import { useCart } from '../../components/CartContext';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Product = () => {
    const { cartItems, updateCartItems } = useCart();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [viewMode, setViewMode] = useState('grid');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [selectedPriceRange, setSelectedPriceRange] = useState('');
    const [isOnPromotion, setIsOnPromotion] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');
    const [favoriteMessage, setFavoriteMessage] = useState('');

    const priceRanges = [
        { label: '< 1,000,000', value: '0-1000000' },
        { label: '1,000,000 - 5,000,000', value: '1000000-5000000' },
        { label: '5,000,000 - 10,000,000', value: '5000000-10000000' },
        { label: '10,000,000 - 20,000,000', value: '10000000-20000000' },
        { label: '> 20,000,000', value: '20000000-99999999999' },
    ];

    useEffect(() => {
        fetchProducts(currentPage);
        fetchCategories();
        fetchBrands();
    }, [currentPage]);

    const fetchProducts = async (page = 1) => {
        try {
            const response = await axios.get('http://localhost:8000/san-pham', {
                params: {
                    category: selectedCategory,
                    brand: selectedBrand,
                    price_range: selectedPriceRange,
                    on_promotion: isOnPromotion,
                    sort_order: sortOrder,
                    page,
                },
            });
            setProducts(response.data.data);
            setPagination(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchCategories = async () => {
        const response = await axios.get('http://localhost:8000/category');
        setCategories(response.data);
    };

    const fetchBrands = async () => {
        const response = await axios.get('http://localhost:8000/brand');
        setBrands(response.data);
    };

    const handleFilterChange = () => {
        setCurrentPage(1);
        fetchProducts(1);
    };

    useEffect(() => {
        handleFilterChange();
    }, [selectedCategory, selectedBrand, selectedPriceRange, isOnPromotion, sortOrder]);

    const handleAddToCart = (product) => {
        const newItem = {
            id: product.id,
            name: product.name,
            price: product.pricesale || product.price,
            qty: 1,
            image: `http://localhost:8000/imgs/products/${product.image}`,
        };
        const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
        const updatedCart = existingItemIndex > -1
            ? cartItems.map((item, index) => (index === existingItemIndex ? { ...item, qty: item.qty + 1 } : item))
            : [...cartItems, newItem];

        updateCartItems(updatedCart);
        setSuccessMessage('Added to cart!');
        setTimeout(() => setSuccessMessage(''), 2000);
    };

    const handleAddToFavorites = (product) => {
        if (!product) return;
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        if (!favorites.some(item => item.id === product.id)) {
            localStorage.setItem('favorites', JSON.stringify([...favorites, product]));
            setFavoriteMessage('Added to favorites!');
            setTimeout(() => setFavoriteMessage(''), 2000);
        }
    };

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-end mb-4 space-x-2">
                <button className={`px-6 py-3 border rounded-md ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`} onClick={() => setViewMode('grid')}>Grid View</button>
                <button className={`px-6 py-3 border rounded-md ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`} onClick={() => setViewMode('list')}>List View</button>
            </div>

            <div className="flex justify-around bg-white w-full h-16 my-5 mx-auto rounded-lg shadow-md items-center">
                <FilterSelect label="Danh mục:" options={categories} value={selectedCategory} onChange={setSelectedCategory} />
                <FilterSelect label="Thương hiệu:" options={brands} value={selectedBrand} onChange={setSelectedBrand} />
                <FilterSelect label="Giá:" options={priceRanges} value={selectedPriceRange} onChange={setSelectedPriceRange} />
                <FilterSelect label="Khuyến mãi:" options={[{ label: 'Đang khuyến mãi', value: '1' }]} value={isOnPromotion} onChange={setIsOnPromotion} />
                <FilterSelect label="Sắp xếp:" options={[{ label: 'Sản phẩm mới nhất', value: 'newest' }, { label: 'Giá cao đến thấp', value: 'high_to_low' }, { label: 'Giá thấp đến cao', value: 'low_to_high' }, { label: 'Bán chạy nhất', value: 'best_seller' }]} value={sortOrder} onChange={setSortOrder} />
            </div>

            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'flex flex-col space-y-8'}`}>
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onAddToFavorites={handleAddToFavorites}
                        successMessage={successMessage}
                        favoriteMessage={favoriteMessage}
                    />
                ))}
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

const FilterSelect = ({ label, options, value, onChange }) => (
    <div className="flex items-center border border-gray-400 rounded px-2">
        <span>{label}</span>
        <select value={value} onChange={(e) => onChange(e.target.value)} className="h-8 outline-none border-none rounded ml-2">
            <option value="">{`Chọn ${label.toLowerCase()}`}</option>
            {options.map((option) => (
                <option key={option.value || option.id} value={option.value || option.slug}>{option.label || option.name}</option>
            ))}
        </select>
    </div>
);

const ProductCard = ({ product, onAddToCart, onAddToFavorites, successMessage, favoriteMessage }) => (
    <div className="flex flex-col md:flex-row bg-white p-6 rounded-lg shadow-lg space-y-6 md:space-y-0 md:space-x-6 hover:shadow-xl transition-all duration-300">
        <div className="flex-shrink-0 w-full md:w-1/3 rounded-lg overflow-hidden">
            <Link to={`/chi-tiet-san-pham/${product.slug}`}>
                <img src={`http://localhost:8000/imgs/products/${product.image}`} alt={product.name} className="w-50 object-cover" />
            </Link>
        </div>
        <div className="flex flex-col justify-between w-full md:w-2/3 space-y-4">
            <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <div className="flex flex-col justify-between items-start space-y-2">
                {product.pricesale && (
                    <span className="text-lg font-bold text-red-600">
                        {product.pricesale}₫
                    </span>
                )}
                <div className="flex items-center space-x-4">
                    <span className={`text-lg ${product.pricesale ? 'line-through text-gray-500' : 'text-black'}`}>
                        {product.price}₫
                    </span>
                </div>
                <div className="flex justify-between items-center w-full">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => onAddToCart(product)} className="px-4 py-2 bg-blue-500 text-white rounded-md flex items-center">
                            <FaShoppingCart className="mr-2" />
                        </button>
                        <button onClick={() => onAddToFavorites(product)} className="px-4 py-2 bg-pink-500 text-white rounded-md flex items-center">
                            <FaHeart className="mr-2" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
);


export default Product;