// FreshFarm Shop Functionality
class ShopManager {
    constructor() {
        this.products = [
            {
                id: 1,
                name: 'Fresh Organic Tomatoes',
                price: 4.99,
                image: 'https://te.dynamiclayers.net/organto/assets/img/product01.jpg',
                category: 'Vegetables',
                stock: 'in-stock',
                badge: 'hot'
            },
            {
                id: 2,
                name: 'Organic Lettuce',
                price: 3.49,
                image: 'https://te.dynamiclayers.net/organto/assets/img/product02.jpg',
                category: 'Vegetables',
                stock: 'in-stock'
            },
            {
                id: 3,
                name: 'Fresh Carrots',
                price: 2.99,
                image: 'https://te.dynamiclayers.net/organto/assets/img/product03.jpg',
                category: 'Vegetables',
                stock: 'sale',
                discount: 70
            },
            {
                id: 4,
                name: 'Organic Potatoes',
                price: 5.99,
                image: 'https://te.dynamiclayers.net/organto/assets/img/product04.jpg',
                category: 'Vegetables',
                stock: 'in-stock'
            },
            {
                id: 5,
                name: 'Fresh Spinach',
                price: 3.29,
                image: 'https://te.dynamiclayers.net/organto/assets/img/product05.jpg',
                category: 'Vegetables',
                stock: 'hot'
            },
            {
                id: 6,
                name: 'Organic Bell Peppers',
                price: 4.49,
                image: 'https://te.dynamiclayers.net/organto/assets/img/product06.jpg',
                category: 'Vegetables',
                stock: 'out-stock'
            }
        ];
        this.filteredProducts = [...this.products];
        this.currentCategory = 'all';
        this.sortBy = 'default';
        this.init();
    }

    init() {
        this.renderProducts();
        this.bindEvents();
        this.initializeCart();
    }

    bindEvents() {
        // Category filter
        document.querySelectorAll('.category-filter').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.filterByCategory(e.target.dataset.category);
            });
        });

        // Sort functionality
        document.querySelector('.sort-select').addEventListener('change', (e) => {
            this.sortProducts(e.target.value);
        });

        // Search functionality
        document.querySelector('.search-input').addEventListener('input', (e) => {
            this.searchProducts(e.target.value);
        });

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
    }

    initializeCart() {
        if (!window.ShoppingCart) {
            window.ShoppingCart = class ShoppingCart {
                constructor() {
                    this.items = JSON.parse(localStorage.getItem('freshfarm_cart')) || [];
                    this.updateCartUI();
                    this.bindEvents();
                }

                addToCart(productCard) {
                    const product = {
                        id: Date.now(),
                        name: productCard.querySelector('h3').textContent.trim(),
                        price: parseFloat(productCard.querySelector('.price').textContent.replace('$', '')),
                        image: productCard.querySelector('img').src,
                        quantity: 1
                    };

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

                saveCart() {
                    localStorage.setItem('freshfarm_cart', JSON.stringify(this.items));
                }

                updateCartUI() {
                    this.updateCartCount();
                }

                updateCartCount() {
                    const cartCount = document.querySelector('.cart-count');
                    if (cartCount) {
                        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
                        cartCount.textContent = totalItems;
                        cartCount.style.display = totalItems > 0 ? 'block' : 'none';
                    }
                }

                showNotification(message) {
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

                    setTimeout(() => {
                        notification.style.transform = 'translateX(0)';
                    }, 100);

                    setTimeout(() => {
                        notification.style.transform = 'translateX(100%)';
                        setTimeout(() => {
                            if (notification.parentNode) {
                                notification.parentNode.removeChild(notification);
                            }
                        }, 300);
                    }, 3000);
                }

                bindEvents() {
                    document.addEventListener('click', (e) => {
                        if (e.target.classList.contains('cart-btn') || e.target.closest('.cart-btn')) {
                            e.preventDefault();
                            const productCard = e.target.closest('.product-card');
                            if (productCard) {
                                this.addToCart(productCard);
                            }
                        }
                    });
                }
            };
        }

        new window.ShoppingCart();
    }

    filterByCategory(category) {
        this.currentCategory = category;
        if (category === 'all') {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product => product.category === category);
        }
        this.renderProducts();
    }

    sortProducts(sortBy) {
        this.sortBy = sortBy;
        let sorted = [...this.filteredProducts];

        switch(sortBy) {
            case 'price':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // 'date' or default
                sorted.sort((a, b) => a.id - b.id);
        }

        this.filteredProducts = sorted;
        this.renderProducts();
    }

    searchProducts(query) {
        if (!query.trim()) {
            this.filteredProducts = this.currentCategory === 'all' 
                ? [...this.products] 
                : this.products.filter(product => product.category === this.currentCategory);
        } else {
            const searchQuery = query.toLowerCase();
            this.filteredProducts = this.products.filter(product => 
                product.name.toLowerCase().includes(searchQuery) ||
                product.category.toLowerCase().includes(searchQuery)
            );
        }
        this.renderProducts();
    }

    renderProducts() {
        const productGrid = document.querySelector('.product-items');
        if (!productGrid) return;

        productGrid.innerHTML = '';

        if (this.filteredProducts.length === 0) {
            productGrid.innerHTML = `
                <div class="col-lg-12 text-center py-5">
                    <h3>No products found</h3>
                    <p>Try adjusting your filters or search terms</p>
                </div>
            `;
            return;
        }

        this.filteredProducts.forEach(product => {
            const productCard = this.createProductCard(product);
            productGrid.appendChild(productCard);
        });
    }

    createProductCard(product) {
        const discountBadge = product.discount 
            ? `<a href="#" class="badge sale">-${product.discount}%</a>` 
            : product.stock === 'out-stock' 
                ? '<a href="#" class="badge out-stock">Out Of Stock</a>'
                : product.badge === 'hot'
                ? '<a href="#" class="badge hot">Hot</a>'
                : product.stock === 'in-stock'
                ? '<a href="#" class="badge in-stock">In Stock</a>'
                : '';

        return `
            <div class="col-lg-4 col-md-6 padding-15">
                <div class="product-card">
                    <div class="product-thumb">
                        <img src="${product.image}" alt="${product.name}">
                        ${discountBadge}
                        <ul class="shop-action">
                            <li><a href="#"><i class="lar la-heart"></i></a></li>
                            <li><a href="#"><i class="las la-retweet"></i></a></li>
                            <li><a href="#"><i class="las la-expand-arrows-alt"></i></a></li>
                        </ul>
                        <a href="#" class="cart-btn" data-product='${JSON.stringify(product).replace(/'/g, "\\'")}'>Add To Cart</a>
                    </div>
                    <div class="product-info">
                        <div class="product-inner">
                            <ul class="category">
                                <li><a href="#" data-category="${product.category}">${product.category}</a></li>
                            </ul>
                            <ul class="ratting">
                                <li><i class="las la-star"></i></li>
                                <li><i class="las la-star"></i></li>
                                <li><i class="las la-star"></i></li>
                                <li><i class="las la-star"></i></li>
                                <li><i class="las la-star"></i></li>
                            </ul>
                        </div>
                        <h3>${product.name}</h3>
                        <h4 class="price">$${product.price.toFixed(2)}</h4>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize shop when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ShopManager();
});
