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

// App-wide state
const AppState = {
    isLoggedIn: false,
    currentUser: null,
    currentPage: 'home',
};

// Page navigation logic
class PageNavigator {
    constructor() {
        this.pages = document.querySelectorAll('.page');
        this.navLinks = document.querySelectorAll('.nav-links li');
        this.nav = document.querySelector('.nav-links');
        this.burger = document.querySelector('.burger');
        this.setup();
    }
    setup() {
    // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', e => {
            const pageId = link.getAttribute('data-page');
                this.navigateTo(pageId);
            e.preventDefault();
        });
    });
    // Mobile menu toggle
        this.burger.addEventListener('click', () => {
            this.nav.classList.toggle('active');
            this.burger.classList.toggle('toggle');
    });
        // Hash-based navigation
        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.substring(1);
            if (hash && document.getElementById(hash)) {
                this.navigateTo(hash);
            }
        });
        // Initial hash
        if (window.location.hash) {
            const hash = window.location.hash.substring(1);
            if (document.getElementById(hash)) {
                this.navigateTo(hash);
            }
        }
    }
    navigateTo(pageId) {
        // Hide all pages
        this.pages.forEach(page => page.classList.remove('active'));
        // Show selected page
        document.getElementById(pageId).classList.add('active');
        // Update nav link
        this.navLinks.forEach(link => {
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        AppState.currentPage = pageId;
        // Close nav on mobile
        if (window.innerWidth <= 768) {
            this.nav.classList.remove('active');
            this.burger.classList.remove('toggle');
        }
        // Update URL hash
        window.location.hash = pageId;
    }
}

// Stacked cards logic as a module
const StackedCards = (() => {
    function init(containerSelector) {
        const container = document.querySelector(containerSelector);
        if (!container) return;
        const cards = Array.from(container.querySelectorAll('.card-stack-item'));
        const dotsContainer = container.querySelector('.stack-dots-container');
        const prevArrow = container.querySelector('.stack-arrow.prev');
        const nextArrow = container.querySelector('.stack-arrow.next');
        let stackOrder = cards.map((_, i) => i);
        let cardRotations = cards.map(() => (Math.random() * 20 - 10));
        // Generate dots
        dotsContainer.innerHTML = '';
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
                card.style.setProperty('--stack-rotate', '0deg');
                return;
            }
            const randomRotate = cardRotations[index];
            const randomX = (Math.random() * 440 - 220);
            const randomY = (Math.random() * 120 - 60);
            const randomGrey = Math.floor(Math.random() * 40) + 200;
            card.style.setProperty('--stack-rotate', `${randomRotate}deg`);
            card.style.setProperty('--stack-x', `${randomX}px`);
            card.style.setProperty('--stack-y', `${randomY}px`);
            card.style.setProperty('--stack-grey', `rgb(${randomGrey}, ${randomGrey}, ${randomGrey})`);
            card.classList.add('inactive-grey');
        });
        function updateStack() {
            cards.forEach((card, i) => {
                card.classList.remove('active', 'move-out-right', 'move-out-left', 'move-back-in');
                card.style.zIndex = 2 + (cards.length - stackOrder.indexOf(i));
                card.style.opacity = 1;
                card.style.pointerEvents = 'none';
                if (stackOrder[0] !== i) {
                    card.classList.add('inactive-grey');
                    card.style.setProperty('--stack-rotate', `${cardRotations[i]}deg`);
                } else {
                    card.classList.remove('inactive-grey');
                    card.style.setProperty('--stack-rotate', '0deg');
                }
            });
            // Top card
            const topIdx = stackOrder[0];
            cards[topIdx].classList.add('active');
            cards[topIdx].style.zIndex = 20;
            cards[topIdx].style.pointerEvents = 'auto';
            cards[topIdx].style.setProperty('--stack-x', '0px');
            cards[topIdx].style.setProperty('--stack-y', '0px');
            cards[topIdx].style.setProperty('--stack-grey', '#fff');
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
                cardRotations[topIdx] = Math.random() * 20 - 10;
                const randomX = (Math.random() * 440 - 220);
                const randomY = (Math.random() * 120 - 60);
                card.style.setProperty('--stack-x', `${randomX}px`);
                card.style.setProperty('--stack-y', `${randomY}px`);
                card.classList.add('inactive-grey');
                card.style.setProperty('--stack-grey', randomTestimonialGrey());
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
            const oldTopIdx = stackOrder[0];
            cardRotations[oldTopIdx] = Math.random() * 20 - 10;
            const randomX = (Math.random() * 440 - 220);
            const randomY = (Math.random() * 120 - 60);
            cards[oldTopIdx].style.setProperty('--stack-x', `${randomX}px`);
            cards[oldTopIdx].style.setProperty('--stack-y', `${randomY}px`);
            const dir = Math.random() < 0.5 ? 'right' : 'left';
            const moveClass = dir === 'right' ? 'move-out-right' : 'move-out-left';
            card.classList.add('move-back-in');
            card.classList.add('inactive-grey');
            card.style.setProperty('--stack-grey', '#fff');
            card.style.zIndex = 30;
            stackOrder.unshift(stackOrder.pop());
            updateStack();
            setTimeout(() => {
                card.classList.remove('move-back-in');
                card.classList.remove('inactive-grey');
                cards.forEach((c, i) => {
                    if (i !== stackOrder[0]) {
                        c.classList.add('inactive-grey');
                        c.style.setProperty('--stack-grey', randomTestimonialGrey());
                    }
                });
            }, 500);
        }
        function goToCard(index) {
            const currentPos = stackOrder.indexOf(index);
            if (currentPos === -1 || currentPos === 0) return;
            if (currentPos < cards.length / 2) {
                for (let i = 0; i < currentPos; i++) goForward();
            } else {
                for (let i = 0; i < cards.length - currentPos; i++) goBackward();
            }
        }
        prevArrow.addEventListener('click', goBackward);
        nextArrow.addEventListener('click', goForward);
        updateStack();
    }
    return { init };
})();

// Utility
const randomTestimonialGrey = () => {
    const v = Math.floor(Math.random() * 64) + 176;
    return `rgb(${v},${v},${v})`;
};

// Testimonial data
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
    },
    // ... add more testimonials as needed ...
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Setup event listeners
const setupEventListeners = () => {
    // Login button
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (AppState.isLoggedIn) {
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
};

// Modal logic for Login and Sign Up
function setupModalPopups() {
    // Open Login Modal
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        closeAllModals();
    loginModal.style.display = 'flex';
    });
    // Open Subscription Modal (Sign Up)
    signupBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeAllModals();
            subscriptionModal.style.display = 'flex';
            // Set selected plan info if available
            const selectedPlan = btn.getAttribute('data-plan');
            if (selectedPlanInfo) {
                selectedPlanInfo.textContent = selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1);
}
        });
    });
    // Close modals on close button
    closeModal.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });
    subscriptionClose.addEventListener('click', () => {
        subscriptionModal.style.display = 'none';
    });
    // Close modals when clicking outside modal content
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.style.display = 'none';
        if (e.target === subscriptionModal) subscriptionModal.style.display = 'none';
        if (e.target === thankYouModal) thankYouModal.style.display = 'none';
    });
    // Sign Up link in login modal footer
    signupLink?.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal.style.display = 'none';
    subscriptionModal.style.display = 'flex';
    });
}
// Utility to close all modals
function closeAllModals() {
    loginModal.style.display = 'none';
    subscriptionModal.style.display = 'none';
    thankYouModal.style.display = 'none';
}

// --- Pure JS CSV Parser ---
function parseCSV(text) {
    const rows = [];
    let row = [];
    let inQuotes = false;
    let value = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char === '"') {
            if (inQuotes && text[i + 1] === '"') {
                value += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            row.push(value);
            value = '';
        } else if ((char === '\n' || char === '\r') && !inQuotes) {
            if (value || row.length > 0) row.push(value);
            if (row.length > 0) rows.push(row);
            row = [];
            value = '';
            if (char === '\r' && text[i + 1] === '\n') i++;
        } else {
            value += char;
}
    }
    if (value || row.length > 0) row.push(value);
    if (row.length > 0) rows.push(row);
    // Convert to array of objects using header row
    const headers = rows[0];
    return rows.slice(1).map(r => {
        const obj = {};
        headers.forEach((h, i) => obj[h.trim()] = (r[i] || '').trim());
        return obj;
    });
}

// --- CSV Loading Utility ---
async function loadCSV(url) {
    const res = await fetch(url);
    const text = await res.text();
    return parseCSV(text);
    }
    
// --- Populate About Stack from CSV ---
async function populateAboutStack() {
    const data = await loadCSV('data/about.csv');
    console.log('About CSV data:', data);
    const container = document.querySelector('.about-stack');
    if (!container) return;
    container.querySelectorAll('.card-stack-item').forEach(card => card.remove());
    data.forEach((item, idx) => {
        console.log('About card data:', item);
        // Randomly choose left or right for image
        const imageSide = Math.random() < 0.5 ? 'image-left' : 'image-right';
        const card = document.createElement('div');
        card.className = 'card-stack-item ' + imageSide;
        card.dataset.card = idx;
        let descHtml = '';
        if (item.title === 'Our Values' && item.description.includes(';')) {
            const bullets = item.description.split(';').map(s => s.trim()).filter(Boolean);
            descHtml = '<ul>' + bullets.map(b => `<li>${b}</li>`).join('') + '</ul>';
        } else {
            descHtml = `<p>${item.description}</p>`;
        }
        card.innerHTML = `
            <div class="about-card-flex">
                <div class="about-image-container">
                    <img src="${item.image}" alt="${item.title}" style="width:100px;height:100px;object-fit:cover;border-radius:12px;">
                </div>
                <div class="about-content-container">
                    <h2>${item.title}</h2>
                    ${descHtml}
                </div>
            </div>
        `;
        const nav = container.querySelector('.stack-arrows');
        container.insertBefore(card, nav);
    });
}

// --- Populate Features Stack from CSV ---
async function populateFeaturesStack() {
    const data = await loadCSV('data/features.csv');
    console.log('Features CSV data:', data);
    const container = document.querySelector('.features-stack');
    if (!container) return;
    container.querySelectorAll('.card-stack-item').forEach(card => card.remove());
    data.forEach((item, idx) => {
        console.log('Feature card data:', item);
        const card = document.createElement('div');
        card.className = 'card-stack-item ' + (idx % 2 === 0 ? 'image-left' : 'image-right');
        card.dataset.card = idx;
        let bulletsHtml = '';
        if (item.bullets) {
            const bullets = item.bullets.split(';').map(s => s.trim()).filter(Boolean);
            bulletsHtml = '<ul>' + bullets.map(b => `<li>${b}</li>`).join('') + '</ul>';
        }
        card.innerHTML = `
            <div class="feature-detail">
                <div class="feature-content">
                    <div class="feature-image-container">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="feature-content-container">
                        <h2>${item.title}</h2>
                        <div class="feature-description">
                            <p>${item.description}</p>
                            ${bulletsHtml}
                        </div>
                    </div>
                </div>
            </div>
        `;
        const nav = container.querySelector('.stack-arrows');
        container.insertBefore(card, nav);
    });
}

// --- Populate Testimonials Stack from CSV ---
async function populateTestimonialStack() {
    const data = await loadCSV('data/testimonials.csv');
    console.log('Testimonials CSV data:', data);
    const container = document.querySelector('.testimonial-stack');
    if (!container) return;
    container.querySelectorAll('.card-stack-item').forEach(card => card.remove());
    // Shuffle and select 8
    const selected = shuffleArray([...data]).slice(0, 8);
    selected.forEach((item, idx) => {
        console.log('Testimonial card data:', item);
        const card = document.createElement('div');
        card.className = 'card-stack-item';
        card.dataset.card = idx;
        card.innerHTML = `
            <div class="testimonial-content">
                <p>"${item.content}"</p>
            </div>
            <div class="testimonial-author">
                <img src="${item.image}" alt="${item.author}">
                <div class="author-details">
                    <h3>${item.author}</h3>
                    <p>${item.role}</p>
                </div>
            </div>
        `;
        const nav = container.querySelector('.stack-arrows');
        container.insertBefore(card, nav);
    });
}

// --- Populate FAQ from CSV ---
async function populateFaqSection() {
    const data = await loadCSV('data/faq.csv');
    console.log('FAQ CSV data:', data);
    const faqContainer = document.querySelector('.faq-container');
    if (!faqContainer) return;
    faqContainer.innerHTML = '';
    data.forEach((item, idx) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        faqItem.innerHTML = `
            <div class="faq-question">
                <h3>${item.question}</h3>
                <span class="faq-toggle"><i class="fas fa-plus"></i></span>
            </div>
            <div class="faq-answer">
                <p>${item.answer}</p>
            </div>
        `;
        faqContainer.appendChild(faqItem);
    });
    // Initialize accordion after populating FAQs
    initFaqAccordion();
}

// Initialize FAQ accordion
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    console.log('Initializing FAQ accordion with', faqQuestions.length, 'questions');
    
    faqQuestions.forEach(question => {
        // Add click event to both the question and the toggle icon
        const toggleIcon = question.querySelector('.faq-toggle');
        const clickableElements = [question, toggleIcon];
        
        clickableElements.forEach(element => {
            if (element) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('FAQ clicked');
                    
                    // Get the answer element
                    const answer = question.nextElementSibling;
                    const isActive = question.classList.contains('active');
                    
                    // Close all FAQ items
                    faqQuestions.forEach(q => {
                        const a = q.nextElementSibling;
                        q.classList.remove('active');
                        a.style.maxHeight = '0';
                    });
                    
                    // If the clicked question wasn't active, open it
                    if (!isActive) {
                        question.classList.add('active');
                        // Set max-height to the scroll height plus some padding
                        answer.style.maxHeight = `${answer.scrollHeight + 32}px`;
                    }
                });
            }
        });
    });
}

// --- Populate Legal Section (Privacy or Terms) from CSV ---
async function populateLegalSection(section) {
    const csvFile = section === 'privacy' ? 'data/privacy.csv' : 'data/terms.csv';
    const container = document.getElementById(section + '-content');
    if (!container) return;
    const data = await loadCSV(csvFile);
    container.innerHTML = '';
    // Always show meta rows (date and intro)
    data.filter(row => row.section === 'meta').forEach(row => {
        if (row.heading && row.heading.toLowerCase().includes('last updated')) {
            const dateP = document.createElement('p');
            dateP.className = 'legal-date';
            dateP.textContent = `Last updated: ${row.content}`;
            container.appendChild(dateP);
        } else if (row.content) {
            const introP = document.createElement('p');
            introP.className = 'legal-intro';
            introP.textContent = row.content;
            container.appendChild(introP);
        }
    });
    // Render each section as an accordion
    data.filter(row => row.section === 'section').forEach((row, idx) => {
        const item = document.createElement('div');
        item.className = 'legal-accordion-item';
        // Question/heading
        const question = document.createElement('div');
        question.className = 'legal-accordion-question';
        question.innerHTML = `<h2>${row.heading}</h2><span class="legal-toggle"><i class="fas fa-plus"></i></span>`;
        // Answer/content
        const answer = document.createElement('div');
        answer.className = 'legal-accordion-answer';
        let html = `<p>${row.content}</p>`;
        if (row.bullets) {
            const bullets = row.bullets.split(';').map(b => b.trim()).filter(Boolean);
            html += '<ul>' + bullets.map(b => `<li>${b}</li>`).join('') + '</ul>';
        }
        answer.innerHTML = html;
        item.appendChild(question);
        item.appendChild(answer);
        container.appendChild(item);
    });
    // Initialize accordion
    initLegalAccordion(section);
}

function initLegalAccordion(section) {
    const container = document.getElementById(section + '-content');
    if (!container) return;
    const questions = container.querySelectorAll('.legal-accordion-question');
    questions.forEach(question => {
        const toggleIcon = question.querySelector('.legal-toggle');
        [question, toggleIcon].forEach(element => {
            if (element) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const answer = question.nextElementSibling;
                    const isActive = question.classList.contains('active');
                    // Close all
                    questions.forEach(q => {
                        const a = q.nextElementSibling;
                        q.classList.remove('active');
                        a.style.maxHeight = '0';
                    });
                    // Open if not already
                    if (!isActive) {
                        question.classList.add('active');
                        answer.style.maxHeight = `${answer.scrollHeight + 32}px`;
                    }
                });
            }
        });
    });
}

// --- Initialize all stacks from CSV ---
const initAllStacks = async () => {
    await populateAboutStack();
    await populateFeaturesStack();
    await populateTestimonialStack();
    StackedCards.init('.about-stack');
    StackedCards.init('.features-stack');
    StackedCards.init('.testimonial-stack');
    await populateFaqSection();
    await populateLegalSection('privacy');
    await populateLegalSection('terms');
};

// On DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
    new PageNavigator();
    setupEventListeners();
    setupModalPopups();
    initAllStacks();
    checkLoginStatus();
    initFaqAccordion();
});

// Check login status
function checkLoginStatus() {
    // In a real app, this would check for a valid session token
    // For this demo, we'll just check localStorage
    const user = localStorage.getItem('currentUser');
    if (user) {
        AppState.currentUser = JSON.parse(user);
        AppState.isLoggedIn = true;
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
        accountName.textContent = AppState.currentUser.username;
    }
    
    const accountEmail = document.querySelector('.account-email');
    if (accountEmail) {
        accountEmail.textContent = AppState.currentUser.email;
    }
    
    // Update plan information
    const planInfo = document.querySelector('.plan-info');
    if (planInfo) {
        planInfo.textContent = AppState.currentUser.plan;
    }
    
    const memberSince = document.querySelector('.member-since');
    if (memberSince) {
        memberSince.textContent = AppState.currentUser.memberSince;
    }
    
    const subscriptionInfo = document.querySelector('.subscription-info');
    if (subscriptionInfo) {
        subscriptionInfo.textContent = AppState.currentUser.subscription;
    }
}

// Login success handler
function loginSuccess(user) {
    AppState.currentUser = user;
    AppState.isLoggedIn = true;
    
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

// Initialize slideshows if they exist
function initSlideshows() {
    // Remove old features slideshow logic
    // initFeaturesSlideshow();
    initAboutStack();
    initTestimonialsStack();
    initFeaturesStack();
}

function initFeaturesStack() {
    initStackedCards('.features-stack');
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

// Add this function to update pricing display
function updatePricingDisplay() {
    if (billingToggle && pricingPlans) {
        if (billingToggle.checked) {
            pricingPlans.classList.add('yearly-pricing');
        } else {
            pricingPlans.classList.remove('yearly-pricing');
        }
    }
}

// Update event listener for billingToggle
if (billingToggle) {
    billingToggle.addEventListener('change', () => {
        updatePricingDisplay();
    });
    // Set initial state on page load
    updatePricingDisplay();
} 