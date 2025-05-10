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
const supportForm = document.getElementById('supportForm');
const thankYouModal = document.getElementById('thankYouModal');
const thankYouClose = document.querySelector('.thank-you-close');

// State
let isLoggedIn = false;
let currentUser = null;
let currentPage = 'home';
let featuresCurrentSlide = 0;
let testimonialsCurrentSlide = 0;
let featuresSlideInterval;
let testimonialsSlideInterval;
let isBillingYearly = false;

// --- Testimonial Pool ---
const testimonialPool = [
    {
        text: '"Such a life-changing experience. Highly recommended!"',
        img: 'images/testimonials/kira.jpg',
        name: 'Kira Whittle',
        role: 'Verified Graduate'
    },
    {
        text: '"I received a job offer mid-course, and the subjects I learned were current, if not more so, in the company I joined. I honestly feel I got every penny\'s worth."',
        img: 'images/testimonials/daniel.jpg',
        name: 'Daniel Clifford',
        role: 'Verified Graduate'
    },
    {
        text: '"The team was very supportive and kept me motivated"',
        img: 'images/testimonials/jonathan.jpg',
        name: 'Jonathan Walters',
        role: 'Verified Graduate'
    },
    {
        text: '"An overall wonderful and rewarding experience"',
        img: 'images/testimonials/jeanette.jpg',
        name: 'Jeanette Harmon',
        role: 'Verified Graduate'
    },
    {
        text: '"Awesome teaching support from TAs who did the bootcamp themselves. Getting guidance from them and learning from their experiences was easy."',
        img: 'images/testimonials/patrick.jpg',
        name: 'Patrick Abrams',
        role: 'Verified Graduate'
    },
    {
        text: '"As a college student, this app has been a game-changer. It\'s teaching me financial habits that I wish I\'d learned years ago."',
        img: 'images/testimonials/sophia.jpg',
        name: 'Sophia Garcia',
        role: 'Student'
    },
    {
        text: '"The financial insights feature has completely transformed how I budget. I\'ve saved over $2,000 in just the first three months of using myFinancialTracker!"',
        img: 'images/testimonials/rebecca.jpg',
        name: 'Rebecca Johnson',
        role: 'Accountant'
    },
    {
        text: '"After years of struggling with debt, the payoff strategies recommended by the app have put me on track to be debt-free within two years."',
        img: 'images/testimonials/james.jpg',
        name: 'James Wilson',
        role: 'Small Business Owner'
    },
    {
        text: '"The family sharing feature has transformed how my spouse and I communicate about money. No more financial disagreements!"',
        img: 'images/testimonials/michael.jpg',
        name: 'Michael Thompson',
        role: 'Software Engineer'
    },
    {
        text: '"I\'ve tried at least five different financial apps, and myFinancialTracker is by far the most intuitive and comprehensive. The automatic categorization feature saves me hours every month."',
        img: 'images/testimonials/emma.jpg',
        name: 'Emma Rodriguez',
        role: 'Financial Advisor'
    },
    {
        text: '"As a retiree, keeping track of my fixed income is crucial. This app has given me peace of mind and confidence in my financial situation. The projection tools are especially valuable for planning my future expenses."',
        img: 'images/testimonials/robert.jpg',
        name: 'Robert Chen',
        role: 'Retired Teacher'
    },
    {
        text: '"The investment tracking feature has completely changed how I manage my portfolio. Seeing all my investments in one place is incredibly convenient."',
        img: 'images/testimonials/olivia.jpg',
        name: 'Olivia Patel',
        role: 'Investment Analyst'
    },
    {
        text: '"I travel frequently for work, and being able to track expenses in different currencies has been invaluable. This app does it automatically!"',
        img: 'images/testimonials/david.jpg',
        name: 'David Kim',
        role: 'International Consultant'
    },
    {
        text: '"The customer support is exceptional. When I had questions about setting up my budget, they responded within hours with detailed guidance."',
        img: 'images/testimonials/sarah.jpg',
        name: 'Sarah Mitchell',
        role: 'Marketing Director'
    },
    {
        text: '"I started using this app when I was deep in debt. The debt payoff strategies and bill reminders helped me become debt-free in 18 months. I can\'t recommend it enough to anyone struggling with financial organization."',
        img: 'images/testimonials/thomas.jpg',
        name: 'Thomas Anderson',
        role: 'Healthcare Professional'
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkLoginStatus();
    initFaqAccordion();
    initSlideshows();
    initTestimonialsStackSlideshow();
    renderRandomTestimonials();
    initTestimonialsSlideshow();
    renderScatteredTestimonials();
    initTestimonialStackNavigation();
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
        if (e.target === thankYouModal) {
            thankYouModal.style.display = 'none';
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
    
    // Support form submission
    supportForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        
        // In a real app, send email to support@myfinancialtracker.com 
        // using a server-side API or email service
        console.log(`Support request from ${name} (${email})`);
        console.log(`Subject: ${subject}`);
        console.log(`Message: ${message}`);
        
        // Show thank you modal
        thankYouModal.style.display = 'flex';
        
        // Reset form
        supportForm.reset();
    });
    
    // Thank you modal close button
    thankYouClose?.addEventListener('click', () => {
        thankYouModal.style.display = 'none';
    });
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
    initAboutStack();
    initTestimonialsStack();
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
    const testimonialsSlideshow = document.querySelector('.testimonials-slideshow');
    if (!testimonialsSlideshow) return;
    const slidesContainer = testimonialsSlideshow.querySelector('.slides-container');
    let slides = testimonialsSlideshow.querySelectorAll('.slide');
    const arrows = testimonialsSlideshow.querySelectorAll('.slide-arrow');
    const dotsContainer = testimonialsSlideshow.querySelector('.dots-container');
    let current = 0;
    let interval;

    // Remove old dots
    if (dotsContainer) dotsContainer.innerHTML = '';
    // Create dots
    slides = testimonialsSlideshow.querySelectorAll('.slide');
    slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = 'dot' + (idx === 0 ? ' active' : '');
        dot.addEventListener('click', () => {
            goToSlide(testimonialsSlideshow, idx);
            current = idx;
            clearInterval(interval);
        });
        dotsContainer.appendChild(dot);
    });

    function goToSlide(slideshow, idx) {
        const slides = slideshow.querySelectorAll('.slide');
        const dots = slideshow.querySelectorAll('.dot');
        slides.forEach((slide, i) => {
            slide.classList.remove('active', 'next', 'prev', 'slide-left-out', 'slide-right-out', 'slide-left-in', 'slide-right-in');
            if (i === idx) {
                slide.classList.add('active');
            } else if (i === (idx + 1) % slides.length) {
                slide.classList.add('next');
            } else if (i === (idx - 1 + slides.length) % slides.length) {
                slide.classList.add('prev');
            }
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === idx);
        });
    }

    // Arrow navigation
    if (arrows.length) {
        const prevArrow = arrows[0];
        const nextArrow = arrows[1];
        prevArrow.addEventListener('click', () => {
            current = (current - 1 + slides.length) % slides.length;
            goToSlide(testimonialsSlideshow, current);
            clearInterval(interval);
        });
        nextArrow.addEventListener('click', () => {
            current = (current + 1) % slides.length;
            goToSlide(testimonialsSlideshow, current);
            clearInterval(interval);
        });
    }

    // Auto-rotate
    interval = setInterval(() => {
        current = (current + 1) % slides.length;
        goToSlide(testimonialsSlideshow, current);
    }, 8000);
}

function randomGrey() {
    // Generate a random grey between #b0b0b0 and #e0e0e0
    const v = Math.floor(Math.random() * 64) + 176; // 176-239
    return `rgb(${v},${v},${v})`;
}

function initAboutStack() {
    initStackedCards('.about-stack');
}

function initTestimonialsStack() {
    const testimonialData = [
        {
            content: "Such a life-changing experience. Highly recommended!",
            author: "Kira Whittle",
            role: "Verified Graduate",
            image: "images/testimonials/kira.jpg"
        },
        {
            content: "I received a job offer mid-course, and the subjects I learned were current, if not more so, in the company I joined. I honestly feel I got every penny's worth.",
            author: "Daniel Clifford",
            role: "Verified Graduate",
            image: "images/testimonials/daniel.jpg"
        },
        {
            content: "The team was very supportive and kept me motivated",
            author: "Jonathan Walters",
            role: "Verified Graduate",
            image: "images/testimonials/jonathan.jpg"
        },
        {
            content: "An overall wonderful and rewarding experience",
            author: "Jeanette Harmon",
            role: "Verified Graduate",
            image: "images/testimonials/jeanette.jpg"
        },
        {
            content: "Awesome teaching support from TAs who did the bootcamp themselves. Getting guidance from them and learning from their experiences was easy.",
            author: "Patrick Abrams",
            role: "Verified Graduate",
            image: "images/testimonials/patrick.jpg"
        },
        {
            content: "As a college student, this app has been a game-changer. It's teaching me financial habits that I wish I'd learned years ago.",
            author: "Sophia Garcia",
            role: "Student",
            image: "images/testimonials/sophia.jpg"
        },
        {
            content: "The financial insights feature has completely transformed how I budget. I've saved over $2,000 in just the first three months of using myFinancialTracker!",
            author: "Rebecca Johnson",
            role: "Accountant",
            image: "images/testimonials/rebecca.jpg"
        },
        {
            content: "After years of struggling with debt, the payoff strategies recommended by the app have put me on track to be debt-free within two years.",
            author: "James Wilson",
            role: "Small Business Owner",
            image: "images/testimonials/james.jpg"
        }
    ];

    // Shuffle and select 8 random testimonials
    const shuffledTestimonials = shuffleArray([...testimonialData]).slice(0, 8);
    
    // Create testimonial cards
    const container = document.querySelector('.testimonial-stack');
    shuffledTestimonials.forEach((testimonial, index) => {
        const card = document.createElement('div');
        card.className = 'card-stack-item';
        card.dataset.card = index;
        
        card.innerHTML = `
            <div class="testimonial-content">
                <p>"${testimonial.content}"</p>
            </div>
            <div class="testimonial-author">
                <img src="${testimonial.image}" alt="${testimonial.author}">
                <div class="author-details">
                    <h3>${testimonial.author}</h3>
                    <p>${testimonial.role}</p>
                </div>
            </div>
        `;
        
        container.insertBefore(card, container.firstChild);
    });

    // Initialize the stack
    initStackedCards('.testimonial-stack');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function randomTestimonialGrey() {
    const v = Math.floor(Math.random() * 64) + 176;
    return `rgb(${v},${v},${v})`;
}

function initStackedCards(containerSelector, options = {}) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.card-stack-item'));
    const dotsContainer = container.querySelector('.stack-dots-container');
    const prevArrow = container.querySelector('.stack-arrow.prev');
    const nextArrow = container.querySelector('.stack-arrow.next');
    
    let currentIndex = 0;
    const totalCards = cards.length;

    // Generate dots
    cards.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = 'stack-dot' + (index === 0 ? ' active' : '');
        dot.dataset.card = index;
        dot.addEventListener('click', () => goToCard(index));
        dotsContainer.appendChild(dot);
    });

    const dots = Array.from(dotsContainer.querySelectorAll('.stack-dot'));

    // Set initial random positions for all cards except the first one
    cards.forEach((card, index) => {
        if (index === 0) {
            card.classList.add('active');
            return;
        }
        
        const randomRotate = (Math.random() * 20 - 10); // -10deg to +10deg
        const randomX = (Math.random() * 240 - 120);    // -120px to +120px
        const randomY = (Math.random() * 120 - 60);     // -60px to +60px
        const randomGrey = Math.floor(Math.random() * 40) + 200;
        
        card.style.setProperty('--stack-rotate', `${randomRotate}deg`);
        card.style.setProperty('--stack-x', `${randomX}px`);
        card.style.setProperty('--stack-y', `${randomY}px`);
        card.style.setProperty('--stack-grey', `rgb(${randomGrey}, ${randomGrey}, ${randomGrey})`);
        card.classList.add('inactive-grey');
    });

    function updateStack() {
        cards.forEach((card, index) => {
            card.classList.remove('active', 'move-out-right', 'move-out-left', 'move-back-in');
            
            if (index === currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.add('inactive-grey');
            }
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToCard(index) {
        if (index === currentIndex) return;
        
        const oldIndex = currentIndex;
        currentIndex = index;
        
        const oldCard = cards[oldIndex];
        const newCard = cards[currentIndex];
        
        // Determine direction
        const direction = index > oldIndex ? 'right' : 'left';
        
        // Move old card out
        oldCard.classList.add(direction === 'right' ? 'move-out-left' : 'move-out-right');
        
        // Move new card in
        newCard.classList.add('move-back-in');
        
        // Update stack after animation
        setTimeout(updateStack, 500);
    }

    function goForward() {
        const nextIndex = (currentIndex + 1) % totalCards;
        goToCard(nextIndex);
    }

    function goBackward() {
        const prevIndex = (currentIndex - 1 + totalCards) % totalCards;
        goToCard(prevIndex);
    }

    // Event listeners
    prevArrow.addEventListener('click', goBackward);
    nextArrow.addEventListener('click', goForward);

    // Initialize
    updateStack();
}

function initTestimonialStackNavigation() {
    const container = document.querySelector('.testimonial-cards-stack-container');
    if (!container) return;
    const cards = Array.from(container.querySelectorAll('.testimonial-card-stack-item'));
    const arrows = document.querySelectorAll('.testimonial-arrow');
    const dots = document.querySelectorAll('.testimonial-dot');
    let stackOrder = cards.map((_, i) => i);
    let transforms = cards.map(() => ({
        rotate: (Math.random() * 24 - 12).toFixed(1),
        x: (Math.random() * 600 - 300).toFixed(1),
        y: (Math.random() * 320 - 160).toFixed(1)
    }));
    // Assign initial random greys
    cards.forEach((card, i) => {
        if (i !== 0) {
            card.classList.add('inactive-grey');
            card.style.setProperty('--testimonial-grey', randomTestimonialGrey());
        } else {
            card.classList.remove('inactive-grey');
            card.style.setProperty('--testimonial-grey', '#fff');
        }
    });
    function updateStack() {
        cards.forEach((card, i) => {
            card.classList.remove('active', 'move-out-right', 'move-out-left', 'move-back-in', 'animate');
            card.style.zIndex = 2 + (cards.length - stackOrder.indexOf(i));
            card.style.opacity = 1;
            card.style.pointerEvents = 'none';
            const t = transforms[i];
            card.style.setProperty('--testimonial-rotate', `${t.rotate}deg`);
            card.style.setProperty('--testimonial-x', `${t.x}px`);
            card.style.setProperty('--testimonial-y', `${t.y}px`);
            if (stackOrder[0] !== i) {
                card.classList.add('inactive-grey');
            } else {
                card.classList.remove('inactive-grey');
            }
        });
        // Top card
        const topIdx = stackOrder[0];
        cards[topIdx].classList.add('active');
        cards[topIdx].style.zIndex = 20;
        cards[topIdx].style.pointerEvents = 'auto';
        cards[topIdx].style.setProperty('--testimonial-x', '0px');
        cards[topIdx].style.setProperty('--testimonial-y', '0px');
        cards[topIdx].style.setProperty('--testimonial-grey', '#fff');
        // Dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === topIdx);
        });
    }
    function goForward() {
        const topIdx = stackOrder[0];
        const card = cards[topIdx];
        const dir = Math.random() < 0.5 ? 'right' : 'left';
        const moveClass = dir === 'right' ? 'move-out-right' : 'move-out-left';
        card.style.zIndex = 30;
        card.classList.add(moveClass);
        setTimeout(() => {
            stackOrder.push(stackOrder.shift());
            card.classList.add('inactive-grey');
            card.style.setProperty('--testimonial-grey', randomTestimonialGrey());
            card.classList.add('move-back-in');
            updateStack();
            setTimeout(() => {
                card.classList.remove(moveClass, 'move-back-in');
            }, 500);
        }, 500);
    }
    function goBackward() {
        const newTopIdx = stackOrder[stackOrder.length - 1];
        const card = cards[newTopIdx];
        const dir = Math.random() < 0.5 ? 'right' : 'left';
        const moveClass = dir === 'right' ? 'move-out-right' : 'move-out-left';
        card.classList.add('move-back-in');
        card.classList.add('inactive-grey');
        card.style.setProperty('--testimonial-grey', '#fff');
        card.style.zIndex = 30;
        stackOrder.unshift(stackOrder.pop());
        updateStack();
        setTimeout(() => {
            card.classList.remove('move-back-in');
            card.classList.remove('inactive-grey');
            cards.forEach((c, i) => {
                if (i !== stackOrder[0]) {
                    c.classList.add('inactive-grey');
                    c.style.setProperty('--testimonial-grey', randomTestimonialGrey());
                }
            });
        }, 500);
    }
    // Arrow navigation
    arrows.forEach(arrow => {
        arrow.addEventListener('click', () => {
            if (arrow.classList.contains('prev')) {
                goBackward();
            } else {
                goForward();
            }
        });
    });
    // Dot navigation
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            const topIdx = stackOrder[0];
            if (idx === topIdx) return;
            const currentPos = stackOrder.indexOf(idx);
            if (currentPos === -1) return;
            if (currentPos < cards.length / 2) {
                for (let i = 0; i < currentPos; i++) goForward();
            } else {
                for (let i = 0; i < cards.length - currentPos; i++) goBackward();
            }
        });
    });
    updateStack();
} 