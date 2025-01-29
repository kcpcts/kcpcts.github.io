const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger?.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');

        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        burger.classList.toggle('toggle');
    });
}

// Add new function to wrap title characters
const wrapTitleCharacters = () => {
    const titleElement = document.querySelector('.animate-title .letters');
    if (!titleElement) return;

    const text = titleElement.textContent;
    titleElement.textContent = ''; // Clear the element

    // Create spans for each character, handling spaces specially
    const wrappedText = text.split('').map((char, index) => {
        if (char === ' ') {
            return `<span class="letter space" style="--char-index: ${index}">&nbsp;</span>`;
        }
        return `<span class="letter" style="--char-index: ${index}">${char}</span>`;
    }).join('');

    titleElement.innerHTML = wrappedText;
};

// Add new function to get time-appropriate greeting
const getGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
        return 'morning';
    } else if (hour >= 12 && hour < 17) {
        return 'afternoon';
    } else {
        return 'evening';
    }
};

// Add function to update greeting
const updateGreeting = () => {
    const greetingElement = document.querySelector('.greeting-text');
    if (!greetingElement) return;
    
    const timeOfDay = getGreeting();
    greetingElement.textContent = `good ${timeOfDay}, I'm`;
};

// Add this to your existing script.js
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.scroll-fade-up');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing after animation
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,  // Trigger when 10% of the element is visible
        rootMargin: '-50px'  // Trigger slightly before the element comes into view
    });

    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize both functions
document.addEventListener('DOMContentLoaded', () => {
    navSlide();
    wrapTitleCharacters();
    updateGreeting();
    handleScrollAnimations();
}); 