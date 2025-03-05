// Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from './components/Silder';
import NewProduct from './components/NewProduct';
import Category from './components/Category';
import FlashSale from './components/FlashSale';
import NewPost from './components/NewPost';
import BestSeller from './components/BestSeller';


const Home = () => {

    return (
        <div className="container mx-auto px-4">
            <Slider />
            <Category />
            <NewProduct />
            <FlashSale />
            <BestSeller />
            <NewPost />

        </div >
    );
};

export default Home;
