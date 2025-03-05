import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CartProvider } from './components/CartContext';



const App = () => {
  return (
    <CartProvider>
      <div className="web">
        <Header />
        <Main />
        <Footer />
      </div>
    </CartProvider>
  );
};

export default App;
