// DOM Elements
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const categoryBtns = document.querySelectorAll('.category-btn');
const menuCategories = document.querySelectorAll('.menu-category');
const orderModal = document.getElementById('orderModal');
const successModal = document.getElementById('successModal');
const closeBtns = document.querySelectorAll('.close-btn');
const contactForm = document.getElementById('contactForm');
const orderForm = document.getElementById('orderForm');
const notification = document.getElementById('notification');

// Navigation Toggle
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }

        // Close mobile menu if open
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Menu Category Filtering
categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all buttons
        categoryBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        // Hide all menu categories
        menuCategories.forEach(category => {
            category.classList.remove('active');
        });

        // Show selected category
        const categoryId = btn.getAttribute('data-category');
        const targetCategory = document.getElementById(categoryId);
        if (targetCategory) {
            targetCategory.classList.add('active');
        }
    });
});

// Modal Functions
function showOrderModal(type) {
    const modalTitle = document.getElementById('orderModalTitle');
    const addressField = document.getElementById('addressField');

    if (type === 'delivery') {
        modalTitle.textContent = 'Order for Delivery';
        addressField.style.display = 'block';
        document.getElementById('orderAddress').required = true;
    } else if (type === 'carryout') {
        modalTitle.textContent = 'Order for Carryout';
        addressField.style.display = 'none';
        document.getElementById('orderAddress').required = false;
    } else if (type === 'catering') {
        modalTitle.textContent = 'Catering Quote Request';
        addressField.style.display = 'block';
        document.getElementById('orderAddress').required = true;
    }

    orderModal.classList.add('active');
}

function closeModal(modal) {
    modal.classList.remove('active');
}

// Close modal when clicking close button
closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal);
    });
});

// Close modal when clicking outside
[orderModal, successModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
        }
    });
});

// Contact Form Handling
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('contactName').value,
        phone: document.getElementById('contactPhone').value,
        type: document.getElementById('contactType').value,
        message: document.getElementById('contactMessage').value
    };

    // Simulate form submission
    showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');

    // Reset form
    contactForm.reset();
});

// Order Form Handling
orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('orderName').value,
        phone: document.getElementById('orderPhone').value,
        email: document.getElementById('orderEmail').value,
        address: document.getElementById('orderAddress').value,
        notes: document.getElementById('orderNotes').value
    };

    // Simulate order submission
    closeModal(orderModal);

    // Show success modal
    const confirmationDiv = document.getElementById('orderConfirmation');
    confirmationDiv.innerHTML = `
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Phone:</strong> ${formData.phone}</p>
        ${formData.email ? `<p><strong>Email:</strong> ${formData.email}</p>` : ''}
        ${formData.address ? `<p><strong>Address:</strong> ${formData.address}</p>` : ''}
        ${formData.notes ? `<p><strong>Notes:</strong> ${formData.notes}</p>` : ''}
        <p style="margin-top: 20px; color: #d32f2f;"><strong>We'll call you within 5 minutes to confirm your order!</strong></p>
    `;

    successModal.classList.add('active');

    // Reset order form
    orderForm.reset();
});

// Notification System
function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.special-card, .order-card, .about-content, .contact-content').forEach(el => {
    observer.observe(el);
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        background: white;
        padding: 20px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .nav-toggle.active span:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }

    .nav-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .nav-toggle.active span:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// Scroll-triggered navbar background
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Initialize menu with first category active
document.addEventListener('DOMContentLoaded', () => {
    if (categoryBtns.length > 0 && menuCategories.length > 0) {
        categoryBtns[0].classList.add('active');
        menuCategories[0].classList.add('active');
    }
});

// Add to cart functionality (simplified)
let cart = [];
let total = 0;

function addToCart(itemName, price) {
    cart.push({ name: itemName, price: parseFloat(price) });
    total += parseFloat(price);
    updateCartDisplay();
    showNotification(`${itemName} added to cart!`, 'success');
}

function updateCartDisplay() {
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');

    if (cart.length === 0) {
        orderItems.innerHTML = '<p class="empty-order">No items selected yet. Add items from our menu!</p>';
    } else {
        orderItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <span>${item.name}</span>
                <span>$${item.price.toFixed(2)}</span>
            </div>
        `).join('');
    }

    orderTotal.textContent = total.toFixed(2);
}

// Add click handlers to menu items for adding to cart
document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
        const itemName = item.querySelector('.item-info h3').textContent;
        const priceElement = item.querySelector('.item-price') || item.querySelector('.item-sizes span');
        if (priceElement) {
            const price = priceElement.textContent.replace('$', '').split(' ')[0];
            addToCart(itemName, price);
        }
    });
});

// Clear cart when modal closes
orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) {
        cart = [];
        total = 0;
        updateCartDisplay();
    }
});

closeBtns.forEach(btn => {
    if (btn.closest('#orderModal')) {
        btn.addEventListener('click', () => {
            cart = [];
            total = 0;
            updateCartDisplay();
        });
    }
});