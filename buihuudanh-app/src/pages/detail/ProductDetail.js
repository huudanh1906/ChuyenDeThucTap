import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard';
import { useCart } from '../../components/CartContext';
import axios from 'axios';
import { FaHeart, FaShareAlt, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProductDetail = () => {
    const { slug } = useParams();
    const { cartItems, updateCartItems } = useCart();
    const [successMessage, setSuccessMessage] = useState('');
    const [favoriteMessage, setFavoriteMessage] = useState('');
    const [product, setProduct] = useState(null);
    const [listProduct, setListProduct] = useState([]);
    const [comments, setComments] = useState([]); // State for comments
    const [newComment, setNewComment] = useState(''); // State for new comment
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const [commentsPerPage] = useState(5); // Number of comments to show per page
    const qtyRef = useRef(1);

    const handleAddToCart = () => {
        if (!product) return;
        const newItem = {
            id: product.id,
            name: product.name,
            price: product.pricesale || product.price,
            qty: parseInt(qtyRef.current.value),
            image: `http://localhost:8000/imgs/products/${product.image}`,
        };
        const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
        let updatedCart;
        if (existingItemIndex > -1) {
            updatedCart = cartItems.map((item, index) =>
                index === existingItemIndex ? { ...item, qty: item.qty + newItem.qty } : item
            );
        } else {
            updatedCart = [...cartItems, newItem];
        }
        updateCartItems(updatedCart);
        setSuccessMessage('Added to cart!');
        setTimeout(() => setSuccessMessage(''), 2000);
    };

    const handleAddToFavorites = () => {
        if (!product) return;
        const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const isFavorite = favorites.some(item => item.id === product.id);
        if (!isFavorite) {
            const updatedFavorites = [...favorites, product];
            localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
            setFavoriteMessage('Added to favorite!');
            setTimeout(() => setFavoriteMessage(''), 2000);
        }
    };

    const handleAddComment = () => {
        if (newComment.trim() === '') return;

        const comment = {
            id: Date.now(),
            content: newComment,
            date: new Date().toLocaleDateString(),
        };

        // Retrieve comments for the specific product using the slug as the key
        const productComments = JSON.parse(localStorage.getItem(slug)) || [];
        const updatedComments = [...productComments, comment];

        // Store updated comments for the product in localStorage using the slug as the key
        localStorage.setItem(slug, JSON.stringify(updatedComments));
        setComments(updatedComments);
        setNewComment('');
    };

    // Pagination logic
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/chi-tiet-san-pham/${slug}`);
                setProduct(response.data.product);
                setListProduct(response.data.listproduct.data.slice(0, 4));

                // Load comments for the specific product
                const savedComments = JSON.parse(localStorage.getItem(slug)) || [];
                setComments(savedComments);
            } catch (error) {
                console.error('Error fetching product details:', error);
            }
        };
        fetchProductDetail();
    }, [slug]);
    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1">
                        <img
                            src={`http://localhost:8000/imgs/products/${product.image}`}
                            alt={product.name}
                            className="w-full h-auto rounded-lg"
                            style={{ maxHeight: '400px', objectFit: 'contain' }}
                        />
                    </div>
                    <div className="col-span-1 mt-4 md:mt-0">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-semibold border-b pb-2">{product.name}</h3>
                            <div className="price flex items-center">
                                {product.pricesale ? (
                                    <>
                                        <h4 className="text-red-600 text-xl font-bold mr-4">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.pricesale)}
                                        </h4>
                                        <p className="text-gray-500 line-through text-md">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                        </p>
                                    </>
                                ) : (
                                    <h4 className="text-red-600 text-xl font-bold">
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                                    </h4>
                                )}
                            </div>
                            <h6 className="text-gray-700">{product.description}</h6>
                            <p className="text-gray-500">{product.detail}</p>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="number"
                                    defaultValue="1"
                                    min="1"
                                    ref={qtyRef}
                                    className="w-16 border border-gray-300 rounded-lg text-center text-lg"
                                />
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded-lg"
                                    onClick={handleAddToCart}
                                >
                                    Đặt hàng ngay
                                </button>
                            </div>
                            {successMessage && (
                                <p className="text-green-500 text-sm mt-2">{successMessage}</p>
                            )}
                            <div className="flex space-x-4 mt-4">
                                <button className="text-gray-600 hover:text-red-600" onClick={handleAddToFavorites}>
                                    <FaHeart className="w-6 h-6" />
                                </button>
                                <Link to="/favorites">
                                    <button className="text-gray-600 hover:text-blue-600">
                                        <FaShareAlt className="w-6 h-6" />
                                    </button>
                                </Link>
                                <div className="flex items-center space-x-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className="w-5 h-5 text-yellow-400" />
                                    ))}
                                    <span className="text-gray-600">(12)</span>
                                </div>
                            </div>
                            {favoriteMessage && (
                                <p className="mt-2 text-red-600 font-semibold text-center">
                                    {favoriteMessage}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                {/* Comments Section */}
                <div className="mt-8">
                    <h5 className="text-center text-xl font-semibold mb-4">Customer Comments</h5>
                    <div className="space-y-4">
                        {currentComments.length > 0 ? (
                            currentComments.map((comment) => (
                                <div key={comment.id} className="border-b pb-2 mb-2">
                                    <p className="text-gray-700">{comment.content}</p>
                                    <p className="text-gray-500 text-sm">{comment.date}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                        )}
                    </div>
                    {/* Pagination Controls */}
                    <div className="flex justify-center mt-4 space-x-4">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={indexOfLastComment >= comments.length}
                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                    {/* Add Comment Form */}
                    <div className="mt-8">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add your comment here..."
                            className="w-full p-4 border border-gray-300 rounded-lg"
                        />
                        <button
                            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                            onClick={handleAddComment}
                        >
                            Submit Comment
                        </button>
                    </div>
                </div>
                {/* Similar Products Section */}
                <div className="mt-8">
                    <h5 className="text-center text-xl font-semibold mb-4">Sản phẩm tương tự</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {listProduct.map((productItem) => (
                            <ProductCard key={productItem.id} productItem={productItem} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;