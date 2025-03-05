import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faHeart, faMagnifyingGlass, faBox, faUser } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const [menuItems, setMenuItems] = useState([]);
    const { cartCount } = useCart();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch menu items from backend
        axios.get('http://localhost:8000/menu')
            .then(response => setMenuItems(response.data.menus));

        // Check if the user is logged in
        setIsLoggedIn(!!localStorage.getItem('authToken'));
    }, []);

    const handleLogout = async () => {
        try {
            // Send logout request to the backend
            await axios.post('http://localhost:8000/logout', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('authToken')}`
                }
            });
            // Clear local storage and update login state
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setIsLoggedIn(false);
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/tim-kiem?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <header className="bg-white sticky top-0 z-50 shadow">
            <nav className="bg-gray-800 p-4">
                <ul className="flex space-x-4 text-white">
                    {menuItems
                        .filter(menu => menu.parent_id === 0)
                        .map(menu => (
                            <li key={menu.id} className="relative group">
                                <a href={`/${menu.link}`} className="hover:text-yellow-400">
                                    {menu.name}
                                </a>
                                {menuItems.some(subMenu => subMenu.parent_id === menu.id) && (
                                    <ul className="absolute left-0 hidden group-hover:block bg-white text-gray-900 shadow-lg">
                                        {menuItems
                                            .filter(subMenu => subMenu.parent_id === menu.id)
                                            .map(subMenu => (
                                                <li key={subMenu.id} className="p-2 hover:bg-gray-100 whitespace-nowrap">
                                                    <a href={`/${subMenu.link}`}>{subMenu.name}</a>
                                                </li>
                                            ))}
                                    </ul>
                                )}
                            </li>
                        ))}

                    <li>
                        {isLoggedIn ? (
                            <button onClick={handleLogout} className="hover:text-yellow-400">Đăng xuất</button>
                        ) : (
                            <Link to="/login" className="hover:text-yellow-400">Đăng nhập</Link>
                        )}
                    </li>
                </ul>
            </nav>

            <div className="flex justify-between items-center p-4 bg-gray-100">
                <div className="logo">
                    <a href="/">
                        <img src="/imgs/logo.png" alt="Logo" className="h-10" />
                    </a>
                </div>

                <form onSubmit={handleSearch} className="flex items-center bg-white border rounded-full overflow-hidden">
                    <input
                        type="text"
                        placeholder="Tìm kiếm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 w-64 focus:outline-none"
                    />
                    <button type="submit" className="px-4 py-2 bg-yellow-400 text-white">
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </form>

                <div className="flex items-center space-x-4">
                    <Link to="/personal-page" className="relative hover:text-red-600">
                        <FontAwesomeIcon icon={faUser} className="text-2xl" />
                    </Link>
                    <Link to="/favorites" className="relative hover:text-red-600">
                        <FontAwesomeIcon icon={faHeart} className="text-2xl" />
                    </Link>
                    {/* Add Order icon */}
                    <Link to="/order" className="relative hover:text-blue-600">
                        <FontAwesomeIcon icon={faBox} className="text-2xl" />
                    </Link>
                    <div className="relative">
                        <Link to="/cart" className="relative hover:text-red-600">
                            <FontAwesomeIcon icon={faCartShopping} className="text-2xl" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-2 py-0.5">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;