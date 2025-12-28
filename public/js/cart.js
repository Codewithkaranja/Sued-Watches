// Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyCart = document.querySelector('.cart-empty');
    const cartContent = document.querySelector('.cart-content');
    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingEl = document.getElementById('cartShipping');
    const totalEl = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        if (emptyCart) emptyCart.style.display = 'block';
        if (cartContent) cartContent.style.display = 'none';
        return;
    }
    
    if (emptyCart) emptyCart.style.display = 'none';
    if (cartContent) cartContent.style.display = 'grid';
    
    // Update cart items
    if (cartItemsContainer) {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.category || 'Watch'}</p>
                    <div class="cart-item-price">KES ${item.price.toLocaleString()}</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" onclick="updateQuantity('${item.id}', -1)">-</button>
                        <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                        <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Update totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 10000 ? 0 : 500; // Free shipping over 10,000 KES
    
    if (subtotalEl) subtotalEl.textContent = `KES ${subtotal.toLocaleString()}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'FREE' : `KES ${shipping.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `KES ${(subtotal + shipping).toLocaleString()}`;
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    if (item.quantity > 10) {
        item.quantity = 10;
        showNotification('Maximum quantity is 10 per item', 'error');
    }
    
    saveCart();
    updateCartDisplay();
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartDisplay();
    showNotification('Item removed from cart', 'error');
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// Clear cart
function clearCart() {
    cart = [];
    saveCart();
    updateCartDisplay();
}

// Proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }
    
    // In a real app, you would validate user login here
    window.location.href = 'checkout.html';
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
    
    // Add event listeners
    const clearCartBtn = document.getElementById('clearCart');
    const checkoutBtn = document.getElementById('proceedCheckout');
    const continueShoppingBtn = document.getElementById('continueShopping');
    
    if (clearCartBtn) clearCartBtn.addEventListener('click', clearCart);
    if (checkoutBtn) checkoutBtn.addEventListener('click', proceedToCheckout);
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', () => {
            window.location.href = 'shop.html';
        });
    }
});