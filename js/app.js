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
const subscriptionModal = document.getElementById('subscriptionModal');
const subscriptionClose = document.querySelector('.subscription-close');
const selectedPlanInfo = document.getElementById('selectedPlanInfo').querySelector('span');
const subscriptionForm = document.getElementById('subscriptionForm');
const loginForm = document.getElementById('loginForm');
const accountSections = document.querySelectorAll('.account-section');
const accountMenuItems = document.querySelectorAll('.account-menu li');
const featuresSlideshow = document.querySelector('.features-detail-slideshow');
const testimonialsSlideshow = document.querySelector('.testimonial-slides-container');
const signupLink = document.querySelector('.signup-link');

// State
let isLoggedIn = false;
let currentUser = null;
let currentPage = 'home';
let featuresCurrentSlide = 0;
let testimonialsCurrentSlide = 0;
let featuresSlideInterval;
let testimonialsSlideInterval;
let isBillingYearly = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkLoginStatus();
    initFaqAccordion();
    initSlideshows();
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
    
    // Close login modal
    closeModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
    
    // Close subscription modal
    subscriptionClose.addEventListener('click', () => {
        subscriptionModal.style.display = 'none';
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (e.target === subscriptionModal) {
            subscriptionModal.style.display = 'none';
        }
    });
    
    // Sign up link in login modal
    signupLink?.addEventListener('click', (e) => {
        // Close the modal and navigate to signup page
        loginModal.style.display = 'none';
        navigateTo('signup');
    });
    
    // Signup buttons
    signupBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Get the selected plan from the data attribute
            const selectedPlan = btn.getAttribute('data-plan');
            
            // Set the plan info in the subscription modal
            updateSelectedPlanInfo(selectedPlan);
            
            // Open the subscription modal
            openSubscriptionModal();
        });
    });
    
    // Billing toggle
    billingToggle.addEventListener('change', () => {
        isBillingYearly = billingToggle.checked;
        updatePricingDisplay();
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
    
    // Subscription form submission
    subscriptionForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Here you would typically make an API call to process the subscription
        alert('Thank you for subscribing! Your account has been created.');
        
        // Close the modal and redirect to account or dashboard
        subscriptionModal.style.display = 'none';
        
        // For demo purposes, simulate login success
        loginSuccess({
            username: document.getElementById('fullName').value,
            email: document.getElementById('signupEmail').value,
            plan: selectedPlanInfo.textContent,
            memberSince: new Date().toLocaleDateString(),
            subscription: `${selectedPlanInfo.textContent} (${isBillingYearly ? 'Yearly' : 'Monthly'})`
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

// Open login modal
function openLoginModal() {
    loginModal.style.display = 'flex';
}

// Open subscription modal
function openSubscriptionModal() {
    subscriptionModal.style.display = 'flex';
}

// Update plan information in the subscription modal
function updateSelectedPlanInfo(plan) {
    let planName = '';
    let planPrice = '';
    
    // Find the selected plan details
    const planElements = document.querySelectorAll('.pricing-plan');
    planElements.forEach(planElement => {
        const planButton = planElement.querySelector('.signup-btn');
        if (planButton && planButton.getAttribute('data-plan') === plan) {
            planName = planElement.querySelector('h2').textContent;
            
            // Get the appropriate price based on billing period
            const priceElement = isBillingYearly ? 
                planElement.querySelector('.price.yearly') : 
                planElement.querySelector('.price.monthly') || planElement.querySelector('.price');
                
            if (priceElement) {
                planPrice = priceElement.textContent;
            }
        }
    });
    
    // Set the plan info text
    selectedPlanInfo.textContent = `${planName} - ${planPrice} ${isBillingYearly ? 'per year' : 'per month'}`;
}

// Update pricing display based on billing period
function updatePricingDisplay() {
    const pricingContainer = document.querySelector('.pricing-plans');
    if (isBillingYearly) {
        pricingContainer.classList.add('yearly-pricing');
        document.querySelector('.monthly-option')?.classList.remove('selected');
        document.querySelector('.yearly-option')?.classList.add('selected');
    } else {
        pricingContainer.classList.remove('yearly-pricing');
        document.querySelector('.yearly-option')?.classList.remove('selected');
        document.querySelector('.monthly-option')?.classList.add('selected');
    }
    
    // Update any selected plan info if the modal is open
    if (subscriptionModal.style.display === 'flex' && selectedPlanInfo.textContent) {
        const currentPlan = selectedPlanInfo.textContent.split('-')[0].trim();
        const planButtons = document.querySelectorAll('.signup-btn');
        for (const btn of planButtons) {
            const planElement = btn.closest('.pricing-plan');
            if (planElement && planElement.querySelector('h2').textContent === currentPlan) {
                updateSelectedPlanInfo(btn.getAttribute('data-plan'));
                break;
            }
        }
    }
}

// Navigate to a specific page
function navigateTo(pageId) {
    // Hide all pages
    pages.forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the selected page
    document.getElementById(pageId).classList.add('active');
    
    // Update active navigation link
    navLinks.forEach(link => {
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Update the current page
    currentPage = pageId;
    
    // If on mobile, close the nav menu
    if (window.innerWidth <= 768) {
        nav.classList.remove('active');
        burger.classList.remove('toggle');
    }
    
    // Update URL hash
    window.location.hash = pageId;
}

// Check login status
function checkLoginStatus() {
    // In a real app, this would check for a valid session token
    // For this demo, we'll just check localStorage
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
        isLoggedIn = true;
        updateUIForLoggedInUser();
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser() {
    // Update the login button text
    document.querySelector('.login-text').textContent = 'My Account';
    
    // Update account page if it exists
    const accountName = document.querySelector('.account-name');
    if (accountName) {
        accountName.textContent = currentUser.username;
    }
    
    const accountEmail = document.querySelector('.account-email');
    if (accountEmail) {
        accountEmail.textContent = currentUser.email;
    }
    
    // Update plan information
    const planInfo = document.querySelector('.plan-info');
    if (planInfo) {
        planInfo.textContent = currentUser.plan;
    }
    
    const memberSince = document.querySelector('.member-since');
    if (memberSince) {
        memberSince.textContent = currentUser.memberSince;
    }
    
    const subscriptionInfo = document.querySelector('.subscription-info');
    if (subscriptionInfo) {
        subscriptionInfo.textContent = currentUser.subscription;
    }
}

// Login success handler
function loginSuccess(user) {
    currentUser = user;
    isLoggedIn = true;
    
    // Store user info in localStorage
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    // Update UI
    updateUIForLoggedInUser();
    
    // Close login modal
    loginModal.style.display = 'none';
    
    // Navigate to account page if it exists
    if (document.getElementById('account')) {
        navigateTo('account');
    } else {
        // Navigate to home by default
        navigateTo('home');
    }
}

// Initialize FAQ accordion
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            // Check if this question is already active
            const isActive = question.classList.contains('active');
            
            // Close all FAQ items first
            faqQuestions.forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = '0';
            });
            
            // If the clicked question wasn't active before, open it
            if (!isActive) {
                // Toggle active class on the question
                question.classList.add('active');
                
                // Get the answer element
                const answer = question.nextElementSibling;
                
                // Set the max-height to show the content with extra padding
                answer.style.maxHeight = (answer.scrollHeight + 30) + 'px'; // Add 30px extra space
            }
        });
    });
}

// Initialize slideshows if they exist
function initSlideshows() {
    initFeaturesSlideshow();
    initTestimonialsSlideshow();
}

// Initialize features slideshow
function initFeaturesSlideshow() {
    if (!featuresSlideshow) return;
    
    const slides = featuresSlideshow.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    // Create dots for navigation
    const dotsContainer = featuresSlideshow.querySelector('.dots-container');
    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(featuresSlideshow, index);
                featuresCurrentSlide = index;
                clearInterval(featuresSlideInterval);
            });
            dotsContainer.appendChild(dot);
        });
    }
    
    // Set up arrow navigation
    const prevArrow = featuresSlideshow.querySelector('.prev');
    const nextArrow = featuresSlideshow.querySelector('.next');
    
    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            featuresCurrentSlide = (featuresCurrentSlide - 1 + slides.length) % slides.length;
            goToSlide(featuresSlideshow, featuresCurrentSlide);
            clearInterval(featuresSlideInterval);
        });
    }
    
    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            featuresCurrentSlide = (featuresCurrentSlide + 1) % slides.length;
            goToSlide(featuresSlideshow, featuresCurrentSlide);
            clearInterval(featuresSlideInterval);
        });
    }
    
    // Auto-rotate slides
    featuresSlideInterval = setInterval(() => {
        featuresCurrentSlide = (featuresCurrentSlide + 1) % slides.length;
        goToSlide(featuresSlideshow, featuresCurrentSlide);
    }, 8000);
}

// Initialize testimonials slideshow
function initTestimonialsSlideshow() {
    if (!testimonialsSlideshow) return;
    
    const slides = testimonialsSlideshow.querySelectorAll('.testimonial-slide');
    if (slides.length === 0) return;
    
    // Set up dots navigation
    const dots = document.querySelectorAll('.testimonial-dot');
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToTestimonialSlide(index);
            testimonialsCurrentSlide = index;
            clearInterval(testimonialsSlideInterval);
        });
    });
    
    // Set up arrow navigation
    const prevArrow = testimonialsSlideshow.querySelector('.testimonial-slide-arrow.prev');
    const nextArrow = testimonialsSlideshow.querySelector('.testimonial-slide-arrow.next');
    
    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            testimonialsCurrentSlide = (testimonialsCurrentSlide - 1 + slides.length) % slides.length;
            goToTestimonialSlide(testimonialsCurrentSlide);
            clearInterval(testimonialsSlideInterval);
        });
    }
    
    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            testimonialsCurrentSlide = (testimonialsCurrentSlide + 1) % slides.length;
            goToTestimonialSlide(testimonialsCurrentSlide);
            clearInterval(testimonialsSlideInterval);
        });
    }
    
    // Auto-rotate testimonial slides
    testimonialsSlideInterval = setInterval(() => {
        testimonialsCurrentSlide = (testimonialsCurrentSlide + 1) % slides.length;
        goToTestimonialSlide(testimonialsCurrentSlide);
    }, 10000);
}

// Go to a specific testimonial slide
function goToTestimonialSlide(index) {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    
    // Update slides
    slides.forEach((slide, i) => {
        if (i === index) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    // Update dots
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Go to a specific slide
function goToSlide(slideshow, index) {
    const slides = slideshow.querySelectorAll('.slide');
    const dots = slideshow.querySelectorAll('.dot');
    
    // Update slides
    slides.forEach((slide, i) => {
        slide.classList.remove('active', 'next', 'prev', 'slide-left-out', 'slide-right-out', 'slide-left-in', 'slide-right-in');
        
        if (i === index) {
            slide.classList.add('active');
        } else if (i === (index + 1) % slides.length) {
            slide.classList.add('next');
        } else if (i === (index - 1 + slides.length) % slides.length) {
            slide.classList.add('prev');
        }
    });
    
    // Update dots
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
} 