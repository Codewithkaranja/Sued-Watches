const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Sample products data (in production, use MongoDB)
const products = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

// Routes
app.get('/api/products', (req, res) => {
    try {
        const { category, collection, limit, sort } = req.query;
        let filteredProducts = [...products];
        
        // Apply filters
        if (category) {
            filteredProducts = filteredProducts.filter(p => p.category === category);
        }
        
        if (collection) {
            filteredProducts = filteredProducts.filter(p => p.collection === collection);
        }
        
        // Apply sorting
        if (sort === 'price-low') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            filteredProducts.sort((a, b) => b.price - a.price);
        } else if (sort === 'newest') {
            filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        
        // Apply limit
        if (limit) {
            filteredProducts = filteredProducts.slice(0, parseInt(limit));
        }
        
        res.json(filteredProducts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

app.get('/api/products/:id', (req, res) => {
    try {
        const product = products.find(p => p.id === req.params.id);
        
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

app.post('/api/orders', (req, res) => {
    try {
        const orderData = req.body;
        
        // Generate order ID
        const orderId = 'SUED-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000);
        
        // In production, save to database
        const order = {
            ...orderData,
            orderId,
            status: 'processing',
            createdAt: new Date().toISOString()
        };
        
        // Save order (in production, save to DB)
        const orders = JSON.parse(fs.readFileSync('data/orders.json', 'utf8') || '[]');
        orders.push(order);
        fs.writeFileSync('data/orders.json', JSON.stringify(orders, null, 2));
        
        res.json({
            success: true,
            orderId,
            message: 'Order created successfully'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});

app.post('/api/payments/mpesa', (req, res) => {
    try {
        const { phone, amount, orderId } = req.body;
        
        // In production, integrate with MPESA API
        // This is a mock response
        const transactionCode = 'MPE' + Date.now().toString().slice(-6);
        
        res.json({
            success: true,
            transactionCode,
            message: 'Payment initiated. Check your phone to complete payment.'
        });
    } catch (error) {
        res.status(500).json({ error: 'Payment failed' });
    }
});

app.post('/api/newsletter/subscribe', (req, res) => {
    try {
        const { email } = req.body;
        
        // In production, save to database
        const subscribers = JSON.parse(fs.readFileSync('data/subscribers.json', 'utf8') || '[]');
        
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            fs.writeFileSync('data/subscribers.json', JSON.stringify(subscribers, null, 2));
        }
        
        res.json({ success: true, message: 'Subscribed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Subscription failed' });
    }
});

// Serve HTML pages
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});