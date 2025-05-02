import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cart from '../resources/views/frontend/cart';// Import your Cart component

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/cart" element={<Cart />} />
                {/* Add other routes as needed */}
            </Routes>
        </Router>
    );
};

export default App;
