// Main.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/home/Home';
import CategoryProduct from '../pages/category/CategoryProduct';
import Product from '../pages/product/Product';
import BrandProduct from '../pages/brand/BrandProduct';
import ProductDetail from '../pages/detail/ProductDetail';
import SearchResults from '../pages/search/SearchResults';
import Contact from '../pages/contact/Contact';
import Post from '../pages/post/Post';
import TopicPost from '../pages/post/TopicPost';
import PostDetail from '../pages/post/PostDetail';
import PageTopic from '../pages/single-page/PageTopic';
import Login from '../pages/user/Login';
import Register from '../pages/user/Register';
import Cart from '../pages/cart/Cart';
import Favorites from '../pages/favorite/Favorites';
import OrderSuccess from '../pages/cart/OrderSuccess';
import Order from '../pages/order/Order';
import OrderDetail from '../pages/order/OrderDetail';
import PersonalPage from '../pages/user/PersonalPage';




const Main = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trang-chu" element={<Home />} />
            <Route path="/danh-muc/:slug" element={<CategoryProduct />} />
            <Route path="/thuong-hieu/:slug" element={<BrandProduct />} />
            <Route path="san-pham" element={<Product />} />
            <Route path="/chi-tiet-san-pham/:slug" element={<ProductDetail />} />
            <Route path="/tim-kiem" element={<SearchResults />} />
            <Route path="/lien-he" element={<Contact />} />
            <Route path="/bai-viet" element={<Post />} />
            <Route path="/chu-de/:slug" element={<TopicPost />} />
            <Route path="/chi-tiet-bai-viet/:slug" element={<PostDetail />} />
            <Route path="/trang-don/:slug" element={<PageTopic />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/personal-page" element={<PersonalPage/>} />

            <Route path="/cart" element={<Cart />} />
            <Route path="/order-alert" element={<OrderSuccess />} />
            <Route path="/order" element={<Order/>} />
            <Route path="/order-detail/:orderId" element={<OrderDetail />} />

            <Route path="/favorites" element={<Favorites />} />
        </Routes>
    );
};

export default Main;
