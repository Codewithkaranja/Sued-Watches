// Shop Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize shop functionality
    initShop();
});

function initShop() {
    // Initialize filters
    initFilters();
    
    // Initialize sort functionality
    initSorting();
    
    // Initialize view toggle
    initViewToggle();
    
    // Initialize pagination
    initPagination();
    
    // Initialize product interactions
    initProductInteractions();
    
    // Initialize search
    initSearch();
    
    // Load initial products
    loadProducts();
}

function initFilters() {
    // Filter toggle
    const filterTitles = document.querySelectorAll('.filter-title');
    filterTitles.forEach(title => {
        title.addEventListener('click', () => {
            title.classList.toggle('active');
            const content = title.nextElementSibling;
            content.style.maxHeight = content.style.maxHeight ? null : content.scrollHeight + 'px';
        });
    });
    
    // Price range slider
    const priceMin = document.getElementById('priceSliderMin');
    const priceMax = document.getElementById('priceSliderMax');
    const minPriceInput = document.getElementById('minPrice');
    const maxPriceInput = document.getElementById('maxPrice');
    const sliderTrack = document.querySelector('.slider-track');
    
    function updatePriceSlider() {
        const min = parseInt(priceMin.value);
        const max = parseInt(priceMax.value);
        
        // Update input fields
        minPriceInput.value = min;
        maxPriceInput.value = max;
        
        // Update slider track
        const minPercent = (min / priceMin.max) * 100;
        const maxPercent = (max / priceMax.max) * 100;
        sliderTrack.style.left = minPercent + '%';
        sliderTrack.style.right = (100 - maxPercent) + '%';
    }
    
    priceMin.addEventListener('input', updatePriceSlider);
    priceMax.addEventListener('input', updatePriceSlider);
    
    minPriceInput.addEventListener('change', function() {
        const value = Math.min(parseInt(this.value), parseInt(priceMax.value) - 1000);
        priceMin.value = value;
        updatePriceSlider();
    });
    
    maxPriceInput.addEventListener('change', function() {
        const value = Math.max(parseInt(this.value), parseInt(priceMin.value) + 1000);
        priceMax.value = value;
        updatePriceSlider();
    });
    
    // Color selection
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            this.classList.toggle('active');
            applyFilters();
        });
    });
    
    // Size selection
    const sizeOptions = document.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', function() {
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            applyFilters();
        });
    });
    
    // Apply filters button
    const applyBtn = document.querySelector('.apply-filters');
    applyBtn.addEventListener('click', applyFilters);
    
    // Clear filters
    const clearBtn = document.getElementById('clearFilters');
    clearBtn.addEventListener('click', clearFilters);
    
    // Filter tags removal
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('fa-times')) {
            const tag = e.target.closest('.filter-tag');
            tag.remove();
            applyFilters();
        }
    });
}

function initSorting() {
    const sortSelect = document.getElementById('sortSelect');
    sortSelect.addEventListener('change', function() {
        applyFilters();
    });
}

function initViewToggle() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const gridView = document.getElementById('gridView');
    const listView = document.getElementById('listView');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show/hide views
            const view = this.dataset.view;
            gridView.classList.toggle('active', view === 'grid');
            listView.classList.toggle('active', view === 'list');
            
            // Update products display
            updateProductsView(view);
        });
    });
}

function initPagination() {
    const pageNumbers = document.querySelectorAll('.page-number');
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    const jumpBtn = document.querySelector('.jump-btn');
    const jumpInput = document.querySelector('.jump-input');
    
    pageNumbers.forEach(number => {
        number.addEventListener('click', function() {
            pageNumbers.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            loadPage(parseInt(this.textContent));
        });
    });
    
    prevBtn.addEventListener('click', function() {
        const currentPage = document.querySelector('.page-number.active').textContent;
        if (parseInt(currentPage) > 1) {
            loadPage(parseInt(currentPage) - 1);
        }
    });
    
    nextBtn.addEventListener('click', function() {
        const currentPage = document.querySelector('.page-number.active').textContent;
        const totalPages = pageNumbers.length;
        if (parseInt(currentPage) < totalPages) {
            loadPage(parseInt(currentPage) + 1);
        }
    });
    
    jumpBtn.addEventListener('click', function() {
        const page = parseInt(jumpInput.value);
        if (page >= 1 && page <= 8) {
            loadPage(page);
        }
    });
    
    jumpInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            jumpBtn.click();
        }
    });
}

function initProductInteractions() {
    // Quick view
    const quickViewButtons = document.querySelectorAll('.quick-view');
    const quickViewModal = document.getElementById('quickViewModal');
    const modalClose = quickViewModal.querySelector('.modal-close');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            showQuickView(productId);
        });
    });
    
    modalClose.addEventListener('click', () => {
        quickViewModal.style.display = 'none';
    });
    
    quickViewModal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
        }
    });
    
    // Add to cart
    const addToCartButtons = document.querySelectorAll('.add-to-cart, .add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            addToCart(productId);
        });
    });
    
    // Add to wishlist
    const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            addToWishlist(productId);
        });
    });
    
    // Compare
    const compareButtons = document.querySelectorAll('.compare-btn');
    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.product;
            addToCompare(productId);
        });
    });
}

function initSearch() {
    const searchToggle = document.getElementById('searchToggle');
    const searchBar = document.getElementById('searchBar');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchSuggestions = document.getElementById('searchSuggestions');
    
    searchToggle.addEventListener('click', () => {
        searchBar.classList.toggle('active');
        if (searchBar.classList.contains('active')) {
            searchInput.focus();
        }
    });
    
    searchClose.addEventListener('click', () => {
        searchBar.classList.remove('active');
    });
    
    // Search suggestions
    searchInput.addEventListener('input', debounce(function() {
        const query = this.value.trim();
        if (query.length > 2) {
            showSearchSuggestions(query);
        } else {
            searchSuggestions.classList.remove('active');
        }
    }, 300));
    
    // Close search on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            searchBar.classList.remove('active');
        }
    });
}

function loadProducts(filters = {}) {
    const productsContainer = document.getElementById('productsContainer');
    const loadingState = document.getElementById('loadingState');
    const emptyState = document.getElementById('emptyState');
    
    // Show loading
    productsContainer.style.opacity = '0.5';
    loadingState.style.display = 'flex';
    emptyState.style.display = 'none';
    
    // Simulate API call
    setTimeout(() => {
        // Hide loading
        productsContainer.style.opacity = '1';
        loadingState.style.display = 'none';
        
        // Check if products exist (in real app, check response)
        const hasProducts = true; // This would come from API response
        
        if (!hasProducts) {
            emptyState.style.display = 'block';
        }
        
        // Update results count
        updateResultsInfo(50, 12);
        
    }, 1000);
}

function applyFilters() {
    // Collect all filter values
    const filters = {
        categories: [],
        priceRange: {
            min: parseInt(document.getElementById('minPrice').value),
            max: parseInt(document.getElementById('maxPrice').value)
        },
        collections: [],
        materials: [],
        colors: [],
        size: '',
        rating: null,
        availability: [],
        sort: document.getElementById('sortSelect').value,
        view: document.querySelector('.view-btn.active').dataset.view
    };
    
    // Get selected categories
    document.querySelectorAll('input[name="category"]:checked').forEach(checkbox => {
        filters.categories.push(checkbox.value);
    });
    
    // Get selected collections
    document.querySelectorAll('input[name="collection"]:checked').forEach(checkbox => {
        filters.collections.push(checkbox.value);
    });
    
    // Get selected materials
    document.querySelectorAll('input[name="material"]:checked').forEach(checkbox => {
        filters.materials.push(checkbox.value);
    });
    
    // Get selected colors
    document.querySelectorAll('.color-option.active').forEach(option => {
        filters.colors.push(option.dataset.color);
    });
    
    // Get selected size
    const activeSize = document.querySelector('.size-option.active');
    if (activeSize) {
        filters.size = activeSize.dataset.size;
    }
    
    // Get selected rating
    const selectedRating = document.querySelector('input[name="rating"]:checked');
    if (selectedRating) {
        filters.rating = parseInt(selectedRating.value);
    }
    
    // Get availability
    document.querySelectorAll('input[name="availability"]:checked').forEach(checkbox => {
        filters.availability.push(checkbox.value);
    });
    
    // Update filter tags
    updateFilterTags(filters);
    
    // Load products with filters
    loadProducts(filters);
}

function clearFilters() {
    // Uncheck all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Reset price range
    document.getElementById('minPrice').value = 0;
    document.getElementById('maxPrice').value = 50000;
    document.getElementById('priceSliderMin').value = 0;
    document.getElementById('priceSliderMax').value = 50000;
    
    // Reset colors
    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('active');
    });
    
    // Reset size
    document.querySelectorAll('.size-option').forEach(option => {
        option.classList.remove('active');
    });
    document.querySelector('.size-option[data-size="medium"]').classList.add('active');
    
    // Reset sort
    document.getElementById('sortSelect').value = 'featured';
    
    // Clear filter tags
    const filterTags = document.getElementById('filterTags');
    filterTags.innerHTML = '';
    
    // Apply cleared filters
    applyFilters();
}

function updateFilterTags(filters) {
    const filterTags = document.getElementById('filterTags');
    let tagsHTML = '';
    
    // Category tags
    filters.categories.forEach(category => {
        tagsHTML += `<span class="filter-tag">${category} <i class="fas fa-times"></i></span>`;
    });
    
    // Price range tag
    tagsHTML += `<span class="filter-tag">KES ${filters.priceRange.min.toLocaleString()}-${filters.priceRange.max.toLocaleString()} <i class="fas fa-times"></i></span>`;
    
    // Collection tags
    filters.collections.forEach(collection => {
        tagsHTML += `<span class="filter-tag">${collection} <i class="fas fa-times"></i></span>`;
    });
    
    // Rating tag
    if (filters.rating) {
        tagsHTML += `<span class="filter-tag">${filters.rating}+ stars <i class="fas fa-times"></i></span>`;
    }
    
    filterTags.innerHTML = tagsHTML;
}

function updateResultsInfo(total, showing) {
    const resultsCount = document.querySelector('.results-count');
    resultsCount.innerHTML = `Showing <strong>1-${showing}</strong> of <strong>${total}</strong> watches`;
}

function loadPage(page) {
    // Update active page
    const pageNumbers = document.querySelectorAll('.page-number');
    pageNumbers.forEach(n => n.classList.remove('active'));
    pageNumbers[page - 1].classList.add('active');
    
    // Update pagination buttons
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === pageNumbers.length;
    
    // Update jump input
    document.querySelector('.jump-input').value = page;
    
    // Load products for page
    loadProducts();
}

function updateProductsView(view) {
    // This would transform the products display based on view
    console.log(`Switching to ${view} view`);
}

function showQuickView(productId) {
    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    
    // Load product data (simulated)
    const productData = {
        id: productId,
        name: 'Nairobi Leather Classic',
        price: 18999,
        originalPrice: 22999,
        description: 'Premium full-grain Italian leather with minimalist design. Hand-stitched in Nairobi workshop.',
        images: ['images/products/nairobi-classic-1.jpg', 'images/products/nairobi-classic-2.jpg', 'images/products/nairobi-classic-3.jpg'],
        specs: {
            material: 'Italian Full-Grain Leather',
            strap: 'Adjustable 18-22cm',
            waterResistant: 'Yes (3 ATM)',
            warranty: '2 Years',
            movement: 'Japanese Quartz',
            case: 'Stainless Steel'
        },
        colors: [
            { name: 'Black', code: '#000000', image: 'images/products/color-black.jpg' },
            { name: 'Brown', code: '#8B4513', image: 'images/products/color-brown.jpg' },
            { name: 'Tan', code: '#D2B48C', image: 'images/products/color-tan.jpg' }
        ]
    };
    
    // Generate quick view content
    content.innerHTML = `
        <div class="quick-view-product">
            <div class="product-images">
                <div class="main-image">
                    <img src="${productData.images[0]}" alt="${productData.name}">
                </div>
                <div class="thumbnails">
                    ${productData.images.map(img => `
                        <div class="thumbnail">
                            <img src="${img}" alt="${productData.name}">
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="product-details">
                <h2>${productData.name}</h2>
                <div class="product-rating">
                    <div class="stars">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                    </div>
                    <span class="review-count">(42 reviews)</span>
                </div>
                <div class="product-price">
                    <span class="current">KES ${productData.price.toLocaleString()}</span>
                    <span class="original">KES ${productData.originalPrice.toLocaleString()}</span>
                    <span class="save">Save KES 4,000</span>
                </div>
                <p class="product-description">${productData.description}</p>
                
                <div class="product-specs">
                    <h4>Specifications</h4>
                    <div class="specs-grid">
                        ${Object.entries(productData.specs).map(([key, value]) => `
                            <div class="spec">
                                <strong>${key}:</strong>
                                <span>${value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="product-colors">
                    <h4>Available Colors</h4>
                    <div class="color-options">
                        ${productData.colors.map(color => `
                            <div class="color-option" data-color="${color.name.toLowerCase()}">
                                <div class="color-swatch" style="background-color: ${color.code};"></div>
                                <span>${color.name}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="product-actions">
                    <div class="quantity-selector">
                        <button class="qty-btn minus">-</button>
                        <input type="number" value="1" min="1" max="10" class="qty-input">
                        <button class="qty-btn plus">+</button>
                    </div>
                    <button class="btn btn-primary add-to-cart-qv" data-product="${productId}">
                        <i class="fas fa-shopping-bag"></i> Add to Cart
                    </button>
                    <button class="btn btn-outline">
                        <i class="far fa-heart"></i> Wishlist
                    </button>
                </div>
                
                <div class="product-meta">
                    <div class="meta-item">
                        <i class="fas fa-truck"></i>
                        <span>Free shipping in Nairobi</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-shield-alt"></i>
                        <span>2-year warranty</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-exchange-alt"></i>
                        <span>30-day returns</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
    
    // Add event listeners for quick view
    const addToCartBtn = content.querySelector('.add-to-cart-qv');
    addToCartBtn.addEventListener('click', () => {
        addToCart(productId);
        modal.style.display = 'none';
    });
}

function addToCart(productId, quantity = 1) {
    // Add product to cart logic
    console.log(`Adding product ${productId} to cart`);
    
    // Show notification
    showNotification('Product added to cart!', 'success');
    
    // Update cart count
    updateCartCount();
}

function addToWishlist(productId) {
    console.log(`Adding product ${productId} to wishlist`);
    showNotification('Added to wishlist!', 'success');
}

function addToCompare(productId) {
    console.log(`Adding product ${productId} to compare`);
    showNotification('Added to compare!', 'info');
}

function showSearchSuggestions(query) {
    const suggestions = document.getElementById('searchSuggestions');
    
    // Simulate API call for suggestions
    const mockSuggestions = [
        'Leather Watches',
        'Maasai Beaded Collection',
        'Nairobi Classic',
        'Limited Edition Watches',
        'Watch Accessories'
    ];
    
    const filtered = mockSuggestions.filter(s => 
        s.toLowerCase().includes(query.toLowerCase())
    );
    
    if (filtered.length > 0) {
        suggestions.innerHTML = filtered.map(s => `
            <div class="suggestion-item">
                <i class="fas fa-search"></i>
                <span>${s}</span>
            </div>
        `).join('');
        suggestions.classList.add('active');
    } else {
        suggestions.classList.remove('active');
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Notification function
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#028a7e'};
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

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    // In real app, get from localStorage or API
    const count = parseInt(cartCount.textContent) + 1 || 1;
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? 'flex' : 'none';
}