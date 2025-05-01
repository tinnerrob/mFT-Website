// DOM Elements
const navLinks = document.querySelectorAll('.nav-links li');
const pages = document.querySelectorAll('.page');
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeModal = document.querySelector('.close');
const signupBtns = document.querySelectorAll('.signup-btn');
const billingToggle = document.getElementById('billingToggle');
const pricingPlans = document.querySelector('.pricing-plans');
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const accountSections = document.querySelectorAll('.account-section');
const accountMenuItems = document.querySelectorAll('.account-menu li');

// State
let isLoggedIn = false;
let currentUser = null;
let currentPage = 'home';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // We're using script.js for slideshow navigation now
    setupEventListeners();
    checkLoginStatus();
    initFaqAccordion();
});

// Set up all event listeners
function setupEventListeners() {
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const pageId = link.getAttribute('data-page');
            navigateTo(pageId);
            e.preventDefault();
        });
    });
    
    // Mobile menu toggle
    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        burger.classList.toggle('toggle');
    });
    
    // Login button
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (isLoggedIn) {
            navigateTo('account');
        } else {
            openLoginModal();
        }
    });
    
    // Close modal
    closeModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
    
    // Signup buttons
    signupBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Hide pricing plans and show signup form
            document.querySelectorAll('.pricing-plan').forEach(plan => {
                plan.style.display = 'none';
            });
            document.querySelector('.pricing-toggle').style.display = 'none';
            signupForm.classList.remove('hidden');
            
            // Set the selected plan in the form
            const selectedPlan = btn.getAttribute('data-plan');
            // You would typically store this for submission
        });
    });
    
    // Billing toggle
    billingToggle?.addEventListener('change', () => {
        pricingPlans.classList.toggle('yearly-pricing');
    });
    
    // Login form submission
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Here you would typically make an API call to verify credentials
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        // For demo purposes, always succeed
        loginSuccess({
            username: email.split('@')[0],
            email: email,
            plan: 'Premium',
            memberSince: 'January 1, 2023',
            subscription: 'Premium (Yearly) - Renews on Jan 1, 2024'
        });
    });
    
    // Account menu items
    accountMenuItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.getAttribute('data-section');
            
            // Remove active class from all items and sections
            accountMenuItems.forEach(i => i.classList.remove('active'));
            accountSections.forEach(s => s.classList.remove('active'));
            
            // Set active class on selected item and section
            item.classList.add('active');
            document.querySelector(`.account-section.${section}`).classList.add('active');
        });
    });
    
    // Handle hash-based navigation
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            navigateTo(hash);
        }
    });
    
    // Check initial hash
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        if (document.getElementById(hash)) {
            navigateTo(hash);
        }
    }
}

// Navigate to a specific page
function navigateTo(pageId) {
    // If pageId is not valid, default to home
    if (!document.getElementById(pageId)) {
        pageId = 'home';
    }
    
    // If trying to access account page while not logged in
    if (pageId === 'account' && !isLoggedIn) {
        openLoginModal();
        return;
    }
    
    // Store the current page for animation direction
    const oldPage = currentPage;
    currentPage = pageId;
    
    // Determine slide direction
    const pageIndex = Array.from(pages).findIndex(page => page.id === pageId);
    const oldPageIndex = Array.from(pages).findIndex(page => page.id === oldPage);
    const direction = pageIndex > oldPageIndex ? 'right' : 'left';
    
    // Update active states
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Hide all pages and show the target page
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.animation = '';
        // Reset scroll position when switching pages
        setTimeout(() => {
            page.scrollTop = 0;
        }, 0);
    });
    
    // Show the target page with animation
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        
        // For FAQ page, initialize accordion if needed
        if (pageId === 'faq') {
            const faqItems = document.querySelectorAll('.faq-item');
            if (faqItems.length > 0 && !faqItems[0].classList.contains('initialized')) {
                faqItems.forEach(item => {
                    item.classList.add('initialized');
                });
                // Make first FAQ item active by default for better UX
                faqItems[0].classList.add('active');
            }
        }
        
        // Close mobile menu after navigation
        if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
        }
    }
    
    // Update URL hash
    window.location.hash = '#' + pageId;
}

// Open the login modal
function openLoginModal() {
    loginModal.style.display = 'flex';
}

// Check if user is logged in
function checkLoginStatus() {
    // In a real app, you would check local storage, cookies, or session
    // For now, we'll assume the user is not logged in initially
    updateLoginUI();
}

// Update UI based on login status
function updateLoginUI() {
    const loginText = document.querySelector('.login-text');
    
    if (isLoggedIn && currentUser) {
        loginText.textContent = currentUser.username;
        
        // Update account page info
        document.getElementById('accountUsername').textContent = currentUser.username;
        document.getElementById('accountEmail').textContent = currentUser.email;
        document.getElementById('accountPlan').textContent = currentUser.plan + ' Plan';
        document.getElementById('memberSince').textContent = currentUser.memberSince;
        document.getElementById('subscriptionDetails').textContent = currentUser.subscription;
        
        // Add account link to navigation if not exists
        if (!document.querySelector('[data-page="account"]')) {
            const accountLink = document.createElement('li');
            accountLink.setAttribute('data-page', 'account');
            accountLink.innerHTML = '<a href="#account">My Account</a>';
            accountLink.addEventListener('click', (e) => {
                navigateTo('account');
                e.preventDefault();
            });
            
            nav.appendChild(accountLink);
        }
    } else {
        loginText.textContent = 'Login';
        
        // Remove account link from navigation if exists
        const accountLink = document.querySelector('[data-page="account"]');
        if (accountLink) {
            nav.removeChild(accountLink);
        }
    }
}

// Handle successful login
function loginSuccess(user) {
    isLoggedIn = true;
    currentUser = user;
    updateLoginUI();
    loginModal.style.display = 'none';
}

// Handle logout
function logout() {
    isLoggedIn = false;
    currentUser = null;
    updateLoginUI();
    navigateTo('home');
}

// Resize handler for responsive design
window.addEventListener('resize', () => {
    // Add any specific resize handlers here
});

// Initialize FAQ accordion functionality
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
} 