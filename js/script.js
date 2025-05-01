// Initialize slideshows with arrow navigation
function initSlideshow(slideshowClass) {
    const slideshows = document.querySelectorAll(`.${slideshowClass}`);
    
    slideshows.forEach(slideshow => {
        const slides = slideshow.querySelectorAll('.slide');
        const dotsContainer = slideshow.querySelector('.dots-container');
        const prevArrow = slideshow.querySelector('.slide-arrow.prev');
        const nextArrow = slideshow.querySelector('.slide-arrow.next');
        let currentSlide = 0;
        
        // First, clear and regenerate dots for each slideshow to avoid duplicates
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            
            // Generate a dot for each slide
            slides.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.classList.add('dot');
                if (index === 0) dot.classList.add('active');
                dotsContainer.appendChild(dot);
            });
        }
        
        // Get the newly created dots
        const dots = slideshow.querySelectorAll('.dot');
        
        // Function to show a specific slide
        function showSlide(n) {
            // Reset index if out of bounds
            if (n >= slides.length) currentSlide = 0;
            if (n < 0) currentSlide = slides.length - 1;
            
            // Hide all slides and remove active from dots
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            // Show the current slide and make its dot active
            slides[currentSlide].classList.add('active');
            if (dots.length > 0 && dots[currentSlide]) {
                dots[currentSlide].classList.add('active');
            }
        }
        
        // Set up dot click handlers
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });
        
        // Set up arrow navigation
        if (prevArrow) {
            prevArrow.addEventListener('click', () => {
                currentSlide--;
                showSlide(currentSlide);
            });
        }
        
        if (nextArrow) {
            nextArrow.addEventListener('click', () => {
                currentSlide++;
                showSlide(currentSlide);
            });
        }
        
        // Initialize the first slide
        // Find the active slide if one exists
        const activeSlideIndex = Array.from(slides).findIndex(slide => slide.classList.contains('active'));
        if (activeSlideIndex >= 0) {
            currentSlide = activeSlideIndex;
        }
        showSlide(currentSlide);
    });
}

// Initialize all slideshows when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all types of slideshows
    initSlideshow('features-slideshow');
    initSlideshow('features-detail-slideshow');
    initSlideshow('testimonials-slideshow');
}); 