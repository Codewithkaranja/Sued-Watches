// DOM Elements
const navToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const searchBtn = document.querySelector('.search-btn');
const searchOverlay = document.querySelector('.search-overlay');
const closeSearch = document.querySelector('.close-search');
const cartCount = document.querySelector('.cart-count');
const userBtn = document.querySelector('.user-btn');
const loginModal = document.getElementById('loginModal');
const modalClose = document.querySelector('.modal-close');
const newsletterForm = document.querySelector('.newsletter-form');

// Navigation Toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Search Functionality
if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        searchOverlay.style.display = 'block';
        setTimeout(() => {
            searchOverlay.classList.add('active');
            document.querySelector('.search-input').focus();
        }, 10);
    });
}

if (closeSearch) {
    closeSearch.addEventListener('click', () => {
        searchOverlay.classList.remove('active');
        setTimeout(() => {
            searchOverlay.style.display = 'none';
        }, 300);
    });
}

// Cart Count (Load from localStorage)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// User Modal
if (userBtn) {
    userBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
    }
    if (e.target === searchOverlay) {
        searchOverlay.classList.remove('active');
        setTimeout(() => {
            searchOverlay.style.display = 'none';
        }, 300);
    }
});

// Newsletter Form
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                alert('Thank you for subscribing!');
                newsletterForm.reset();
            } else {
                alert('Subscription failed. Please try again.');
            }
        } catch (error) {
            console.error('Newsletter error:', error);
            alert('An error occurred. Please try again.');
        }
    });
}

// Load New Arrivals
async function loadNewArrivals() {
    const container = document.getElementById('newArrivals');
    if (!container) return;
    
    try {
        const response = await fetch('/api/products?limit=4&collection=new');
        const products = await response.json();
        
        container.innerHTML = products.map(product => `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.images[0]}" alt="${product.name}">
                    ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
                    <div class="product-actions">
                        <button class="action-btn" onclick="addToCart('${product.id}')">
                            <i class="fas fa-shopping-bag"></i>
                        </button>
                        <button class="action-btn">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-title">
                        <span>${product.name}</span>
                        <span class="product-category">${product.category}</span>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">
                        <div>
                            <span class="price-current">KES ${product.price.toLocaleString()}</span>
                            ${product.originalPrice ? 
                                `<span class="price-original">KES ${product.originalPrice.toLocaleString()}</span>` : ''}
                        </div>
                        <div class="product-rating">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5 - Math.floor(product.rating))}
                            <span>(${product.reviews})</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading new arrivals:', error);
        container.innerHTML = '<p class="error">Failed to load products. Please try again.</p>';
    }
}

// Add to Cart Function
function addToCart(productId, quantity = 1) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        // In a real app, you would fetch product details from server
        cart.push({
            id: productId,
            quantity: quantity,
            name: 'Product Name',
            price: 0,
            image: 'images/placeholder.jpg'
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // Show confirmation
    showNotification('Added to cart!', 'success');
}

// Show Notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#028A7E' : '#DC3545'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    loadNewArrivals();
});