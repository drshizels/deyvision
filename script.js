document.addEventListener('DOMContentLoaded', function() {
    // Initialize Vanta.js dots background
    VANTA.DOTS({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        size: 3.90,
        spacing: 31.00
    });

    // Scroll-triggered fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');
    const videoSections = document.querySelectorAll('.video-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

    fadeElements.forEach(el => observer.observe(el));
    videoSections.forEach(el => observer.observe(el));

    // Parallax effect on scroll
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroContent = document.querySelector('.hero-content');
        const scrollHint = document.querySelector('.scroll-hint');

        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / 500);
        }

        if (scrollHint) {
            scrollHint.style.opacity = 1 - (scrolled / 300);
        }
    });

});
