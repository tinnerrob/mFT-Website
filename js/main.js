// myFinancialTracker Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Login Button Functionality
    const loginButton = document.querySelector('.login-button');
    if (loginButton) {
        loginButton.addEventListener('click', function() {
            showLoginModal();
        });
    }
    
    // Login Modal
    function showLoginModal() {
        const modalHtml = `
            <div class="login-modal-overlay">
                <div class="login-modal">
                    <div class="login-modal-header">
                        <h3>Login to myFinancialTracker</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" class="form-control" required>
                        </div>
                        <button type="submit" class="submit-button">Login</button>
                    </form>
                    <div class="login-modal-footer">
                        <p>Don't have an account? <a href="signup.html">Sign up</a></p>
                        <p><a href="#">Forgot password?</a></p>
                    </div>
                </div>
            </div>
        `;
        
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHtml;
        document.body.appendChild(modalContainer);
        
        // Close modal when clicking outside or on close button
        const overlay = document.querySelector('.login-modal-overlay');
        const closeButton = document.querySelector('.close-modal');
        
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeLoginModal();
            }
        });
        
        closeButton.addEventListener('click', closeLoginModal);
        
        // Handle login form submission
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Here we would normally send a request to the server
            authenticateUser(email, password);
        });
    }
    
    function closeLoginModal() {
        const modalOverlay = document.querySelector('.login-modal-overlay');
        if (modalOverlay) {
            modalOverlay.remove();
        }
    }
    
    function authenticateUser(email, password) {
        // This is where you would normally make an API call to authenticate
        // For demonstration, we'll simulate a successful login
        console.log('Attempting to authenticate user:', email);
        
        // Simulate API call with setTimeout
        setTimeout(function() {
            // Successful login simulation
            alert('Login successful! Redirecting to account page...');
            closeLoginModal();
            // In a real app, redirect to account page or update UI
            window.location.href = 'account.html';
        }, 1000);
    }
    
    // Support Form Submission
    const supportForm = document.getElementById('support-form');
    if (supportForm) {
        supportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // Normally this would send data to the server
            console.log('Support form submission:', { name, email, subject, message });
            
            // Simulate successful submission
            alert('Thank you for your message! We will respond shortly.');
            supportForm.reset();
        });
    }
    
    // Sign Up Form Submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const plan = document.querySelector('input[name="plan"]:checked').value;
            
            // Validate credit card (basic validation)
            const ccNumber = document.getElementById('cc-number').value;
            const ccExp = document.getElementById('cc-exp').value;
            const ccCvv = document.getElementById('cc-cvv').value;
            
            if (ccNumber.length < 16) {
                alert('Please enter a valid credit card number');
                return;
            }
            
            // Normally this would send data to the server
            console.log('Signup form submission:', { name, email, password, plan });
            
            // Simulate successful submission
            alert('Thank you for signing up! Redirecting to your account...');
            setTimeout(function() {
                window.location.href = 'account.html';
            }, 1500);
        });
    }
    
    // Show active link in navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (currentPage === linkPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // Testimonial Carousel (if we have multiple testimonials)
    initializeTestimonialCarousel();
});

// Testimonial Carousel
function initializeTestimonialCarousel() {
    const testimonialContainer = document.querySelector('.testimonials-carousel');
    if (!testimonialContainer) return;
    
    const testimonials = testimonialContainer.querySelectorAll('.testimonial-card');
    if (testimonials.length <= 1) return;
    
    let currentIndex = 0;
    
    // Create navigation dots
    const dotsContainer = document.createElement('div');
    dotsContainer.className = 'carousel-dots';
    
    testimonials.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.className = index === 0 ? 'dot active' : 'dot';
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });
    
    testimonialContainer.appendChild(dotsContainer);
    
    // Create next/prev buttons
    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-control prev';
    prevButton.innerHTML = '&lt;';
    prevButton.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
    });
    
    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-control next';
    nextButton.innerHTML = '&gt;';
    nextButton.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
    });
    
    testimonialContainer.appendChild(prevButton);
    testimonialContainer.appendChild(nextButton);
    
    function goToSlide(index) {
        // Handle wrapping
        if (index < 0) {
            index = testimonials.length - 1;
        } else if (index >= testimonials.length) {
            index = 0;
        }
        
        // Update testimonials
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
        
        // Update dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentIndex = index;
    }
    
    // Initialize display
    goToSlide(0);
    
    // Auto-advance every 5 seconds
    setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000);
} 