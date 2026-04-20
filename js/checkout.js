// FreshFarm Checkout Functionality
class CheckoutManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('freshfarm_cart')) || [];
        this.orderData = {
            customerInfo: {},
            shippingInfo: {},
            paymentInfo: {},
            items: this.cart
        };
        this.init();
    }

    init() {
        this.renderCartSummary();
        this.bindEvents();
        this.loadSavedData();
    }

    bindEvents() {
        // Customer information form
        document.getElementById('customer-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCustomerInfo();
        });

        // Shipping information form
        document.getElementById('shipping-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveShippingInfo();
        });

        // Payment information form
        document.getElementById('payment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.savePaymentInfo();
        });

        // Place order button
        document.getElementById('place-order').addEventListener('click', () => {
            this.placeOrder();
        });

        // Form field validation
        document.querySelectorAll('input[required]').forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    saveCustomerInfo() {
        const formData = new FormData(document.getElementById('customer-form'));
        this.orderData.customerInfo = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone')
        };
        this.updateProgress();
    }

    saveShippingInfo() {
        const formData = new FormData(document.getElementById('shipping-form'));
        this.orderData.shippingInfo = {
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            zipCode: formData.get('zipCode'),
            country: formData.get('country')
        };
        this.updateProgress();
    }

    savePaymentInfo() {
        const formData = new FormData(document.getElementById('payment-form'));
        this.orderData.paymentInfo = {
            cardNumber: formData.get('cardNumber'),
            cardName: formData.get('cardName'),
            expiryDate: formData.get('expiryDate'),
            cvv: formData.get('cvv')
        };
        this.updateProgress();
    }

    validateField(field) {
        const value = field.value.trim();
        const errorElement = field.parentNode.querySelector('.error-message');
        
        if (value === '') {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = 'This field is required';
            }
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.textContent = '';
            }
        }
    }

    renderCartSummary() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const shippingCost = document.getElementById('shipping-cost');
        const orderTotal = document.getElementById('order-total');

        if (!cartItems || this.cart.length === 0) {
            cartItems.innerHTML = '<p>Your cart is empty. <a href="shop.html">Continue Shopping</a></p>';
            return;
        }

        let html = '';
        let subtotal = 0;

        this.cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            html += `
                <div class="cart-summary-item">
                    <div class="item-info">
                        <strong>${item.name}</strong><br>
                        <small>Quantity: ${item.quantity}</small><br>
                        <small>Price: $${item.price.toFixed(2)}</small>
                    </div>
                    <div class="item-total">$${itemTotal.toFixed(2)}</div>
                </div>
            `;
        });

        cartItems.innerHTML = html;
        const shipping = 5.99; // Flat shipping rate
        const total = subtotal + shipping;

        if (cartTotal) cartTotal.textContent = `$${subtotal.toFixed(2)}`;
        if (shippingCost) shippingCost.textContent = `$${shipping.toFixed(2)}`;
        if (orderTotal) orderTotal.textContent = `$${total.toFixed(2)}`;
    }

    updateProgress() {
        const steps = ['Customer Info', 'Shipping Info', 'Payment Info', 'Review Order'];
        let currentStep = 0;

        if (this.orderData.customerInfo.firstName) currentStep = 1;
        if (this.orderData.shippingInfo.address) currentStep = 2;
        if (this.orderData.paymentInfo.cardNumber) currentStep = 3;
        if (this.orderData.items.length > 0) currentStep = 4;

        // Update progress indicators
        document.querySelectorAll('.step-indicator').forEach((indicator, index) => {
            if (index < currentStep) {
                indicator.classList.add('completed');
                indicator.classList.add('active');
            } else if (index === currentStep) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('completed', 'active');
            }
        });

        // Show/hide form sections
        document.querySelectorAll('.checkout-section').forEach((section, index) => {
            if (index === currentStep) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        });
    }

    placeOrder() {
        if (!this.validateOrder()) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }

        // Simulate order processing
        this.showNotification('Processing your order...', 'info');

        setTimeout(() => {
            // Clear cart
            localStorage.removeItem('freshfarm_cart');
            
            // Show success message
            this.showNotification('Order placed successfully!', 'success');
            
            // Redirect to confirmation page
            setTimeout(() => {
                window.location.href = 'order-confirmation.html';
            }, 2000);
        }, 1500);
    }

    validateOrder() {
        return this.orderData.customerInfo.firstName &&
               this.orderData.customerInfo.lastName &&
               this.orderData.customerInfo.email &&
               this.orderData.shippingInfo.address &&
               this.orderData.shippingInfo.city &&
               this.orderData.paymentInfo.cardNumber &&
               this.orderData.paymentInfo.cardName &&
               this.cart.length > 0;
    }

    loadSavedData() {
        // Load any saved form data from localStorage
        const savedData = localStorage.getItem('freshfarm_checkout_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.orderData = { ...this.orderData, ...data };
            this.populateForms();
        }
    }

    populateForms() {
        // Populate customer form
        if (this.orderData.customerInfo.firstName) {
            document.getElementById('firstName').value = this.orderData.customerInfo.firstName;
            document.getElementById('lastName').value = this.orderData.customerInfo.lastName;
            document.getElementById('email').value = this.orderData.customerInfo.email;
            document.getElementById('phone').value = this.orderData.customerInfo.phone;
        }

        // Populate shipping form
        if (this.orderData.shippingInfo.address) {
            document.getElementById('address').value = this.orderData.shippingInfo.address;
            document.getElementById('city').value = this.orderData.shippingInfo.city;
            document.getElementById('state').value = this.orderData.shippingInfo.state;
            document.getElementById('zipCode').value = this.orderData.shippingInfo.zipCode;
            document.getElementById('country').value = this.orderData.shippingInfo.country;
        }

        // Populate payment form
        if (this.orderData.paymentInfo.cardNumber) {
            document.getElementById('cardNumber').value = this.orderData.paymentInfo.cardNumber;
            document.getElementById('cardName').value = this.orderData.paymentInfo.cardName;
            document.getElementById('expiryDate').value = this.orderData.paymentInfo.expiryDate;
            document.getElementById('cvv').value = this.orderData.paymentInfo.cvv;
        }

        this.updateProgress();
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `checkout-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc3545' : '#28a745'};
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
}

// Initialize checkout when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CheckoutManager();
});
