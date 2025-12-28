// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// Fetch products
async function fetchProducts(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_BASE_URL}/products?${queryParams}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

// Fetch single product
async function fetchProduct(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        
        if (!response.ok) {
            throw new Error('Product not found');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
}

// Create order
async function createOrder(orderData) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create order');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
}

// Process MPESA payment
async function processMpesaPayment(paymentData) {
    try {
        const response = await fetch(`${API_BASE_URL}/payments/mpesa`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(paymentData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Payment failed');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error processing MPESA payment:', error);
        throw error;
    }
}

// User authentication
async function loginUser(credentials) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        
        const data = await response.json();
        
        // Save token
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Check user authentication
function isAuthenticated() {
    return !!localStorage.getItem('token');
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Newsletter subscription
async function subscribeNewsletter(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/newsletter/subscribe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        return response.ok;
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return false;
    }
}