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
const featuresSlideshow = document.querySelector('.features-detail-slideshow');
const testimonialsSlideshow = document.querySelector('.testimonials-slideshow');

// State
let isLoggedIn = false;
let currentUser = null;
let currentPage = 'home';
let featuresCurrentSlide = 0;
let testimonialsCurrentSlide = 0;
let featuresSlideInterval;
let testimonialsSlideInterval;

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
    if (billingToggle) {
        const monthlyOption = document.querySelector('.monthly-option');
        const yearlyOption = document.querySelector('.yearly-option');
        
        // Function to update toggle state
        function updateToggleState(isYearly) {
            if (isYearly) {
                // Yearly is selected
                pricingPlans.classList.add('yearly-pricing');
                pricingPlans.classList.remove('monthly-pricing');
                
                // Update prices visibility
                document.querySelectorAll('.price.monthly').forEach(price => {
                    price.style.opacity = '0';
                    price.style.visibility = 'hidden';
                });
                document.querySelectorAll('.price.yearly').forEach(price => {
                    price.style.opacity = '1';
                    price.style.visibility = 'visible';
                });
                
                // Update toggle styling
                monthlyOption.classList.remove('selected');
                yearlyOption.classList.add('selected');
                
                // Update checkbox
                billingToggle.checked = true;
            } else {
                // Monthly is selected
                pricingPlans.classList.add('monthly-pricing');
                pricingPlans.classList.remove('yearly-pricing');
                
                // Update prices visibility
                document.querySelectorAll('.price.monthly').forEach(price => {
                    price.style.opacity = '1';
                    price.style.visibility = 'visible';
                });
                document.querySelectorAll('.price.yearly').forEach(price => {
                    price.style.opacity = '0';
                    price.style.visibility = 'hidden';
                });
                
                // Update toggle styling
                monthlyOption.classList.add('selected');
                yearlyOption.classList.remove('selected');
                
                // Update checkbox
                billingToggle.checked = false;
            }
        }
        
        // Toggle switch event
        billingToggle.addEventListener('change', function() {
            updateToggleState(this.checked);
        });
        
        // Click on Monthly/Yearly text
        monthlyOption.addEventListener('click', () => {
            updateToggleState(false);
        });
        
        yearlyOption.addEventListener('click', () => {
            updateToggleState(true);
        });

        // Initialize the toggle state
        updateToggleState(billingToggle.checked);
    }
    
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

// Initialize slideshows
function initSlideshows() {
    // Features slideshow
    if (featuresSlideshow) {
        const slides = featuresSlideshow.querySelectorAll('.slide');
        const dotsContainer = featuresSlideshow.querySelector('.dots-container');
        const prevArrow = featuresSlideshow.querySelector('.slide-arrow.prev');
        const nextArrow = featuresSlideshow.querySelector('.slide-arrow.next');
        
        // Create dots for each slide
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(featuresSlideshow, index, featuresCurrentSlide < index ? 'next' : 'prev');
                featuresCurrentSlide = index;
                resetFeaturesInterval();
            });
            dotsContainer.appendChild(dot);
        });
        
        // Set up arrow navigation
        prevArrow.addEventListener('click', () => {
            const nextSlideIndex = (featuresCurrentSlide - 1 + slides.length) % slides.length;
            goToSlide(featuresSlideshow, nextSlideIndex, 'prev');
            featuresCurrentSlide = nextSlideIndex;
            resetFeaturesInterval();
        });
        
        nextArrow.addEventListener('click', () => {
            const nextSlideIndex = (featuresCurrentSlide + 1) % slides.length;
            goToSlide(featuresSlideshow, nextSlideIndex, 'next');
            featuresCurrentSlide = nextSlideIndex;
            resetFeaturesInterval();
        });
        
        // Start automatic slideshow
        startFeaturesInterval();
        
        // Pause slideshow on hover
        featuresSlideshow.addEventListener('mouseenter', () => {
            clearInterval(featuresSlideInterval);
        });
        
        // Resume slideshow on mouse leave
        featuresSlideshow.addEventListener('mouseleave', () => {
            startFeaturesInterval();
        });
    }
    
    // Testimonials slideshow
    if (testimonialsSlideshow) {
        const slides = testimonialsSlideshow.querySelectorAll('.slide');
        const dotsContainer = testimonialsSlideshow.querySelector('.dots-container');
        const prevArrow = testimonialsSlideshow.querySelector('.slide-arrow.prev');
        const nextArrow = testimonialsSlideshow.querySelector('.slide-arrow.next');
        
        // Create dots for each slide
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                goToSlide(testimonialsSlideshow, index, testimonialsCurrentSlide < index ? 'next' : 'prev');
                testimonialsCurrentSlide = index;
                resetTestimonialsInterval();
            });
            dotsContainer.appendChild(dot);
        });
        
        // Set up arrow navigation
        prevArrow.addEventListener('click', () => {
            const nextSlideIndex = (testimonialsCurrentSlide - 1 + slides.length) % slides.length;
            goToSlide(testimonialsSlideshow, nextSlideIndex, 'prev');
            testimonialsCurrentSlide = nextSlideIndex;
            resetTestimonialsInterval();
        });
        
        nextArrow.addEventListener('click', () => {
            const nextSlideIndex = (testimonialsCurrentSlide + 1) % slides.length;
            goToSlide(testimonialsSlideshow, nextSlideIndex, 'next');
            testimonialsCurrentSlide = nextSlideIndex;
            resetTestimonialsInterval();
        });
        
        // Start automatic slideshow
        startTestimonialsInterval();
        
        // Pause slideshow on hover
        testimonialsSlideshow.addEventListener('mouseenter', () => {
            clearInterval(testimonialsSlideInterval);
        });
        
        // Resume slideshow on mouse leave
        testimonialsSlideshow.addEventListener('mouseleave', () => {
            startTestimonialsInterval();
        });
    }
}

// Features slideshow interval
function startFeaturesInterval() {
    clearInterval(featuresSlideInterval);
    featuresSlideInterval = setInterval(() => {
        const nextSlideIndex = (featuresCurrentSlide + 1) % featuresSlideshow.querySelectorAll('.slide').length;
        goToSlide(featuresSlideshow, nextSlideIndex, 'next');
        featuresCurrentSlide = nextSlideIndex;
    }, 10000); // 10 seconds
}

// Reset features interval
function resetFeaturesInterval() {
    clearInterval(featuresSlideInterval);
    startFeaturesInterval();
}

// Testimonials slideshow interval
function startTestimonialsInterval() {
    clearInterval(testimonialsSlideInterval);
    testimonialsSlideInterval = setInterval(() => {
        const nextSlideIndex = (testimonialsCurrentSlide + 1) % testimonialsSlideshow.querySelectorAll('.slide').length;
        goToSlide(testimonialsSlideshow, nextSlideIndex, 'next');
        testimonialsCurrentSlide = nextSlideIndex;
    }, 5000); // 5 seconds
}

// Reset testimonials interval
function resetTestimonialsInterval() {
    clearInterval(testimonialsSlideInterval);
    startTestimonialsInterval();
}

// Navigate to a specific slide with direction animation
function goToSlide(slideshow, index, direction) {
    const slides = slideshow.querySelectorAll('.slide');
    const dots = slideshow.querySelectorAll('.dot');
    
    // If no direction provided, don't animate
    if (!direction) {
        // Hide all slides and update dots
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'next', 'prev', 'slide-left-in', 'slide-right-in', 'slide-left-out', 'slide-right-out');
            dots[i].classList.remove('active');
        });
        
        // Show the selected slide and update dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        return;
    }
    
    // Find current active slide
    const currentIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
    
    // Remove any existing animation classes
    slides.forEach(slide => {
        slide.classList.remove('slide-left-in', 'slide-right-in', 'slide-left-out', 'slide-right-out');
    });
    
    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    // Animate the current slide out
    if (currentIndex !== -1) {
        if (direction === 'next') {
            slides[currentIndex].classList.add('slide-left-out');
        } else {
            slides[currentIndex].classList.add('slide-right-out');
        }
        
        // After animation, remove active class
        setTimeout(() => {
            slides[currentIndex].classList.remove('active');
        }, 500);
    }
    
    // Animate the new slide in
    if (direction === 'next') {
        slides[index].classList.add('slide-left-in');
    } else {
        slides[index].classList.add('slide-right-in');
    }
    
    // Show the new slide
    slides[index].style.display = 'block';
    
    // After animation completes, clean up classes
    setTimeout(() => {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add('active');
                slide.classList.remove('slide-left-in', 'slide-right-in');
            } else {
                slide.classList.remove('active', 'slide-left-out', 'slide-right-out');
                slide.style.display = '';
            }
        });
    }, 500);
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