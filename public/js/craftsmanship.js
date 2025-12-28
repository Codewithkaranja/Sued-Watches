/*
 * SUED Watches - Craftsmanship Page Interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Parallax effect for hero image
    function initParallax() {
        const heroImage = document.querySelector('.hero-image');
        if (!heroImage) return;
        
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.2;
            heroImage.style.transform = `translate3d(0px, ${rate}px, 0px)`;
        });
    }
    
    // Navbar scroll effect
    function initNavbarScroll() {
        const navbar = document.querySelector('.navbar-transparent');
        if (!navbar) return;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Smooth scroll for anchor links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Initialize timeline step interactions
    function initTimeline() {
        const steps = document.querySelectorAll('.timeline-step');
        if (!steps.length) return;
        
        steps.forEach(step => {
            step.addEventListener('click', function() {
                const stepNumber = parseInt(this.dataset.step);
                updateTimeline(stepNumber);
            });
        });
    }
    
    function updateTimeline(stepNumber) {
        const steps = document.querySelectorAll('.timeline-step');
        const progressBar = document.querySelector('.progress-bar');
        const currentStepSpan = document.querySelector('.current-step');
        const prevBtn = document.querySelector('.nav-btn.prev');
        const nextBtn = document.querySelector('.nav-btn.next');
        
        // Update active step
        steps.forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.toggle('active', stepNum === stepNumber);
        });
        
        // Update buttons
        if (prevBtn && nextBtn) {
            prevBtn.disabled = stepNumber === 1;
            nextBtn.disabled = stepNumber === steps.length;
        }
        
        // Update step indicator
        if (currentStepSpan) {
            currentStepSpan.textContent = `Step ${stepNumber}`;
        }
        
        // Update progress bar
        if (progressBar) {
            const progress = ((stepNumber - 1) / (steps.length - 1)) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }
    
    // Workshop gallery hover effect
    function initWorkshopGallery() {
        const workshopCards = document.querySelectorAll('.workshop-card');
        workshopCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.zIndex = '10';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.zIndex = '1';
            });
        });
    }
    
    // Initialize values animation on scroll
    function initValuesAnimation() {
        const valueCards = document.querySelectorAll('.value-card');
        if (!valueCards.length) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.2
        });
        
        valueCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }
    
    // Initialize all functions
    function init() {
        initParallax();
        initNavbarScroll();
        initSmoothScroll();
        initTimeline();
        initWorkshopGallery();
        initValuesAnimation();
        
        // Add scroll to hero section
        const scrollTrigger = document.querySelector('.hero-scroll');
        if (scrollTrigger) {
            scrollTrigger.addEventListener('click', function() {
                const nextSection = document.querySelector('.craftsmanship-intro');
                if (nextSection) {
                    window.scrollTo({
                        top: nextSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        }
        
        // Material cards animation
        const materialCards = document.querySelectorAll('.material-card');
        materialCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
});

// Export functions for use in HTML
window.craftsmanship = {
    updateTimeline: function(stepNumber) {
        const steps = document.querySelectorAll('.timeline-step');
        const progressBar = document.querySelector('.progress-bar');
        const currentStepSpan = document.querySelector('.current-step');
        const prevBtn = document.querySelector('.nav-btn.prev');
        const nextBtn = document.querySelector('.nav-btn.next');
        
        if (stepNumber < 1) stepNumber = 1;
        if (stepNumber > steps.length) stepNumber = steps.length;
        
        // Update active step
        steps.forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            step.classList.toggle('active', stepNum === stepNumber);
        });
        
        // Update buttons
        if (prevBtn && nextBtn) {
            prevBtn.disabled = stepNumber === 1;
            nextBtn.disabled = stepNumber === steps.length;
        }
        
        // Update step indicator
        if (currentStepSpan) {
            currentStepSpan.textContent = `Step ${stepNumber}`;
        }
        
        // Update progress bar
        if (progressBar) {
            const progress = ((stepNumber - 1) / (steps.length - 1)) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }
};