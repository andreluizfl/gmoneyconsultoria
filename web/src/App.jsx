import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPage from './pages/AdminPage';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/produtos" element={<ProductsPage />} />
                <Route path="/produto/:id" element={<ProductDetailPage />} />
                <Route path="/admin" element={<AdminPage />} />
            </Routes>
        </Router>
    );
}

export default App;
