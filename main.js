document.addEventListener('DOMContentLoaded', () => {

    initApp();
});

function initApp() {
    loadProducts();

    initEventListeners();
    
    initCart();
    initTheme();
}

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcons(savedTheme);
    } else {
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = prefersDarkMode ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        updateThemeIcons(theme);
    }
    
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Update theme
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icons
            updateThemeIcons(newTheme);
        });
    }
}
function updateThemeIcons(theme) {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (sunIcon && moonIcon) {
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
}

function loadProducts() {
    loadFeaturedProducts();
    loadAllProducts();
}

function loadFeaturedProducts() {
    const featuredContainer = document.querySelector('#featured .products-grid');
    if (!featuredContainer) return;
    
    const featuredProducts = products.filter(product => product.featured);

    let featuredHTML = '';
    
    featuredProducts.forEach(product => {
        featuredHTML += createProductCard(product);
    });
    
    featuredContainer.innerHTML = featuredHTML;
    initProductCardEvents();
}

function loadAllProducts() {
    const productsContainer = document.querySelector('#products .products-grid');
    if (!productsContainer) return;
    
    let productsHTML = '';
    
    products.forEach(product => {
        productsHTML += createProductCard(product);
    });
    productsContainer.innerHTML = productsHTML;
    
    initProductCardEvents();
}

function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}" data-category="${product.category}">
            <div class="product-img hover-zoom">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-details">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="quick-add" data-id="${product.id}">Add to Cart</button>
                    <button class="quick-view" data-id="${product.id}">View Details</button>
                </div>
            </div>
        </div>
    `;
}
function initEventListeners() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('open');
        });
    }
    
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const overlay = document.querySelector('.overlay');
    
    if (cartIcon && cartSidebar && closeCart && overlay) {
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('open');
            overlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
        
        closeCart.addEventListener('click', closeCartSidebar);
        overlay.addEventListener('click', closeCartSidebar);
    }

    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filter = button.getAttribute('data-filter');
            filterProducts(filter);
        });
    });
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            
            if (emailInput && emailInput.value) {
                newsletterForm.innerHTML = '<p class="success-message">Thank you for subscribing to our newsletter!</p>';
            }
        });
    }
}

function closeCartSidebar() {
    const cartSidebar = document.querySelector('.cart-sidebar');
    const overlay = document.querySelector('.overlay');
    
    if (cartSidebar && overlay) {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function filterProducts(filter) {
    const productCards = document.querySelectorAll('#products .product-card');
    
    productCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function initProductCardEvents() {
    const addToCartButtons = document.querySelectorAll('.quick-add');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(button.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            
            if (product) {
                addToCart(product);
                addToCartAnimation(e, button);
            }
        });
    });
    
    const viewDetailsButtons = document.querySelectorAll('.quick-view');
    
    viewDetailsButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            
            if (product) {
                showProductDetails(product);
            }
        });
    });
}

function initCart() {
    loadCart();
    
    updateCartCount();
}
let cartItems = [];
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        renderCartItems();
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

function addToCart(product) {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    saveCart();
    renderCartItems();
    updateCartCount();
}
function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
    updateCartCount();
}
function updateQuantity(productId, newQuantity) {
    // Find the item
    const item = cartItems.find(item => item.id === productId);
    
    if (item) {
        if (newQuantity > 0) {

            item.quantity = newQuantity;
        } else {
            removeFromCart(productId);
            return;
        }
        
        
        saveCart();
        renderCartItems();
        updateCartCount();
    }
}

function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalPriceElement = document.querySelector('.total-price');
    
    if (!cartItemsContainer || !totalPriceElement) return;
    cartItemsContainer.innerHTML = '';
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        totalPriceElement.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                <div class="cart-item-quantity">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity-num">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">&times;</button>
        `;
        
        cartItemsContainer.appendChild(itemElement);
    });
    
    totalPriceElement.textContent = `$${total.toFixed(2)}`;

    initCartItemEvents();
}

function initCartItemEvents() {

    const removeButtons = document.querySelectorAll('.remove-item');
    
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    
    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            const item = cartItems.find(item => item.id === productId);
            
            if (item) {
                updateQuantity(productId, item.quantity - 1);
            }
        });
    });
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    
    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = parseInt(button.getAttribute('data-id'));
            const item = cartItems.find(item => item.id === productId);
            
            if (item) {
                updateQuantity(productId, item.quantity + 1);
            }
        });
    });
    
    const checkoutButton = document.querySelector('.checkout-btn');
    
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            if (cartItems.length > 0) {
    
                alert('Proceeding to checkout...');
            }
        });
    }
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        const totalQuantity = cartItems.reduce((total, item) =>  item.quantity, 0);
        cartCount.textContent = totalQuantity;
    }
}

function showProductDetails(product) {
    const modal = document.createElement('div');
    modal.classList.add('product-modal');
    modal.innerHTML = `
        <div class="product-modal-content">
            <button class="close-modal">&times;</button>
            <div class="product-modal-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-modal-details">
                <h2>${product.name}</h2>
                <p class="product-modal-price">$${product.price.toFixed(2)}</p>
                <p class="product-modal-description">${product.description}</p>
                <button class="btn primary-btn add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
   
    document.body.style.overflow = 'hidden';
    const closeButton = modal.querySelector('.close-modal');
    const addToCartButton = modal.querySelector('.add-to-cart-btn');
    
    closeButton.addEventListener('click', () => {
        closeModal(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
    
    addToCartButton.addEventListener('click', (e) => {
        addToCart(product);
        addToCartAnimation(e, addToCartButton);
    });
    
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

function closeModal(modal) {
    modal.classList.remove('show');
    setTimeout(() => {
        modal.remove();
        document.body.style.overflow = '';
    }, 300);
} 