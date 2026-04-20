// FreshFarm Shopping Cart Functionality
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('freshfarm_cart')) || [];
        this.updateCartUI();
        this.bindEvents();
    }

    bindEvents() {
        // Add to cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('cart-btn') || e.target.closest('.cart-btn')) {
                e.preventDefault();
                const productCard = e.target.closest('.product-card');
                if (productCard) {
                    this.addToCart(productCard);
                }
            }
        });

        // Quantity changes
        document.addEventListener('change', (e) => {
            if (e.target.type === 'number' && e.target.closest('.cart-item')) {
                this.updateQuantity(e.target);
            }
        });

        // Remove items
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove') || e.target.closest('.remove')) {
                e.preventDefault();
                const cartItem = e.target.closest('.cart-body .row');
                if (cartItem) {
                    this.removeFromCart(cartItem);
                }
            }
        });

        // Checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
        }
    }

    addToCart(productCard) {
        const product = {
            id: Date.now(), // Simple ID for demo
            name: productCard.querySelector('h3').textContent.trim(),
            price: parseFloat(productCard.querySelector('.price').textContent.replace('$', '')),
            image: productCard.querySelector('img').src,
            quantity: 1
        };

        // Check if product already exists
        const existingItem = this.items.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push(product);
        }

        this.saveCart();
        this.updateCartUI();
        this.showNotification('Product added to cart!');
    }

    updateQuantity(input) {
        const cartRow = input.closest('.cart-body .row');
        const productName = cartRow.querySelector('h3 a').textContent.trim();
        const item = this.items.find(item => item.name === productName);
        
        if (item) {
            item.quantity = parseInt(input.value);
            if (item.quantity < 1) item.quantity = 1;
            if (item.quantity > 10) item.quantity = 10;
            input.value = item.quantity;
        }

        this.saveCart();
        this.updateCartUI();
    }

    removeFromCart(cartRow) {
        const productName = cartRow.querySelector('h3 a').textContent.trim();
        this.items = this.items.filter(item => item.name !== productName);
        this.saveCart();
        this.updateCartUI();
        this.showNotification('Product removed from cart');
    }

    saveCart() {
        localStorage.setItem('freshfarm_cart', JSON.stringify(this.items));
    }

    updateCartUI() {
        this.updateCartPage();
        this.updateCartCount();
        this.updateCartTotal();
    }

    updateCartPage() {
        const cartBody = document.querySelector('.cart-body');
        if (!cartBody) return;

        cartBody.innerHTML = '';
        
        if (this.items.length === 0) {
            cartBody.innerHTML = `
                <div class="col-lg-12 text-center py-5">
                    <h3>Your cart is empty</h3>
                    <a href="shop.html" class="default-btn">Continue Shopping</a>
                </div>
            `;
            return;
        }

        this.items.forEach(item => {
            const itemTotal = item.price * item.quantity;
            const cartRow = document.createElement('div');
            cartRow.className = 'row cart-body';
            cartRow.innerHTML = `
                <div class="col-lg-6">
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="cart-content">
                            <h3><a href="shop-details.html">${item.name}</a></h3>
                            <p>High quality organic product from FreshFarm</p>
                        </div>
                    </div>
                </div>
                <div class="col-4 col-lg-3">
                    <div class="cart-item">
                        <input type="number" value="${item.quantity}" min="1" max="10" class="quantity-input" data-product="${item.name}">
                    </div>
                </div>
                <div class="col-2 col-lg-1">
                    <div class="cart-item">
                        <p class="item-price">$${item.price.toFixed(2)}</p>
                    </div>
                </div>
                <div class="col-2 col-lg-1">
                    <div class="cart-item">
                        <p class="item-total">$${itemTotal.toFixed(2)}</p>
                    </div>
                </div>
                <div class="col-2 col-lg-1">
                    <div class="cart-item">
                        <a class="remove" href="#" data-product="${item.name}"><i class="las la-times"></i></a>
                    </div>
                </div>
            `;
            cartBody.appendChild(cartRow);
        });
    }

    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    updateCartTotal() {
        const totalElement = document.querySelector('.cart-total');
        const subtotalElement = document.querySelector('.subtotal');
        
        if (totalElement) {
            const total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            totalElement.textContent = `$${total.toFixed(2)}`;
            
            if (subtotalElement) {
                subtotalElement.textContent = `$${total.toFixed(2)}`;
            }
        }
    }

    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showNotification('Your cart is empty!');
            return;
        }
        window.location.href = 'checkout.html';
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 9999;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize cart when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ShoppingCart();
});

// Add cart count to header
document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('freshfarm_cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Create cart count element if it doesn't exist
    let cartCount = document.querySelector('.cart-count');
    if (!cartCount) {
        cartCount = document.createElement('span');
        cartCount.className = 'cart-count';
        cartCount.style.cssText = `
            position: absolute;
            top: -8px;
            right: -8px;
            background: #ff6b6b;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: bold;
        `;
        
        const headerBtn = document.querySelector('.header-btn');
        if (headerBtn) {
            headerBtn.style.position = 'relative';
            headerBtn.appendChild(cartCount);
        }
    }
    
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
});
