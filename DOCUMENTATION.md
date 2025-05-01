# myFinancialTracker Website Documentation

## Overview

The myFinancialTracker website is a Single Page Application (SPA) that showcases the myFinancialTracker iOS app. It provides information about the app's features, allows users to sign up for a subscription, and manage their account.

## Technical Implementation

### Technologies Used

- HTML5
- CSS3 (with CSS variables and Flexbox)
- Vanilla JavaScript (ES6+)

### Architecture

The website is built as a single page application with the following key components:

1. **Navigation**: Hash-based routing for seamless page transitions
2. **Page Management**: Dynamic page loading with animation transitions
3. **Slideshow Components**: Timed auto-rotation with manual navigation options
4. **Form Management**: Client-side validation and state management
5. **Responsive Design**: Mobile-first approach with responsive layouts

## File Structure

```
myFinancialTracker-Website/
├── index.html           # Main HTML file
├── css/
│   └── styles.css       # Styles for the website
├── js/
│   └── app.js           # JavaScript functionality
└── images/              # Images used in the website
    └── testimonials/    # Testimonial images
```

## Pages and Features

### Home Page

- Hero section with call-to-action buttons
- App showcase with rotating feature highlights
- Automatic slideshow with 10-second transition time
- Navigation dots for manual control

### Features Page

- Detailed information about each app feature
- Images and comprehensive descriptions
- Automatic slideshow with 10-second transition time
- Navigation dots for manual control

### Support & Suggestions Page

- Contact form for support requests or feature suggestions
- Form validation to ensure proper input
- Responsive design for all device sizes

### Testimonials Page

- User testimonials with photos and job titles
- Automatic slideshow with 5-second transition time
- Navigation dots for manual control

### Sign Up Page

- Monthly/yearly subscription toggle with pricing information
- Three pricing tiers with feature comparisons
- Signup form with credit card processing capability
- Terms of service agreement

### Account Page

- Only accessible when logged in
- User information display
- Subscription management
- Billing history
- Password change functionality

## JavaScript Functionality

### Navigation System

The website uses a hash-based navigation system to switch between pages:

```javascript
// Navigate to a specific page
function navigateTo(pageId) {
    // Implementation for page navigation
}
```

### Slideshow Management

Slideshows are managed through these key functions:

```javascript
// Initialize all slideshows
function initSlideshows() {
    // Sets up all slideshows with appropriate intervals
}

// Go to a specific slide
function goToSlide(slideshowClass, index) {
    // Implementation for slide navigation
}
```

### User Authentication

Simple mock authentication is implemented for demonstration:

```javascript
// Handle successful login
function loginSuccess(user) {
    // Updates UI and state for logged-in user
}

// Handle logout
function logout() {
    // Reverts UI and state to logged-out state
}
```

## Customization Guide

### Changing Colors

The website uses CSS variables for easy color customization. In `styles.css`, find the `:root` selector:

```css
:root {
    --primary-color: #0054a6;
    --secondary-color: #00a651;
    --accent-color: #e0f7fa;
    /* Other color variables */
}
```

### Adding New Features

To add a new feature to the feature slideshow:

1. Add a new slide element to the HTML structure in `index.html`
2. Add corresponding images to the `images` directory
3. The JavaScript will automatically handle the navigation and timing

### Modifying Subscription Plans

To change subscription pricing or features:

1. Update the HTML in the pricing plan section of `index.html`
2. If adding a new plan, follow the same structure as existing plans
3. Update the JavaScript event handlers if necessary

## Browser Compatibility

The website is compatible with:

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest version)
- iOS Safari (latest version)
- Android Chrome (latest version)

## Performance Considerations

- All animations use CSS transitions for better performance
- Slideshows use requestAnimationFrame for smooth animations
- Images should be optimized for web use to improve loading times

## Future Enhancements

Potential improvements for future versions:

1. Implement backend API integration for real user authentication
2. Add actual payment processing with Stripe or similar service
3. Implement analytics tracking
4. Add internationalization support for multiple languages
5. Enhance accessibility features 