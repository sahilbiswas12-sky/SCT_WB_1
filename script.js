document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const header = document.getElementById('header');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTop = document.querySelector('.back-to-top');
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const testimonials = document.querySelectorAll('.testimonial');
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    const formMessage = document.getElementById('formMessage');
    const faqItems = document.querySelectorAll('.faq-item');

    // --- EmailJS Configuration ---
    const EMAILJS_CONFIG = {
        SERVICE_ID: 'service_05frpck',
        TEMPLATE_ID: 'template_1d903y4',
        PUBLIC_KEY: 'UcaxCDn3HhA1ZFr87' // Corrected Public Key
    };

    // Initialize EmailJS with your Public Key
    (function() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
            console.log("EmailJS SDK initialized successfully.");
        } else {
            console.error("EmailJS SDK not loaded.");
        }
    })();

    // --- Event Listeners ---
    window.addEventListener('scroll', handleScrollEffects);
    hamburger.addEventListener('click', toggleMobileMenu);
    navLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
    backToTop.addEventListener('click', scrollToTop);
    contactForm.addEventListener('submit', handleFormSubmission);
    testimonialDots.forEach(dot => dot.addEventListener('click', handleTestimonialDotClick));
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            toggleFaqItem(item);
        });
    });
    
    // --- Auto-rotate testimonials every 5 seconds ---
    let testimonialInterval = setInterval(rotateTestimonials, 5000);

    // --- Functions ---

    // Handle header style and back-to-top button visibility on scroll
    function handleScrollEffects() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    // Toggle mobile navigation menu
    function toggleMobileMenu() {
        navMenu.classList.toggle('active');
        hamburger.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    }

    // Close mobile menu (used when a nav link is clicked)
    function closeMobileMenu() {
        if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        }
    }

    // Smooth scroll to top
    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Testimonial slider - dot navigation
    function handleTestimonialDotClick(event) {
        const index = parseInt(event.target.getAttribute('data-index'));
        showTestimonial(index);
        clearInterval(testimonialInterval);
        testimonialInterval = setInterval(rotateTestimonials, 5000);
    }
    
    let currentTestimonialIndex = 0;
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.toggle('active', i === index);
        });
        testimonialDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentTestimonialIndex = index;
    }

    // Testimonial slider - auto rotation
    function rotateTestimonials() {
        let nextIndex = (currentTestimonialIndex + 1) % testimonials.length;
        showTestimonial(nextIndex);
    }
    
    // FAQ Accordion
    function toggleFaqItem(itemToActivate) {
        faqItems.forEach(item => {
            if (item === itemToActivate && !item.classList.contains('active')) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Display success or error message for the form
    function showFormMessage(type, message) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
    }

    // Handle contact form submission
    function handleFormSubmission(e) {
        e.preventDefault();

        if (typeof emailjs === 'undefined') {
            showFormMessage('error', 'Email service is not available. Please try again later.');
            return;
        }

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            showFormMessage('error', 'Please fill in all required fields.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showFormMessage('error', 'Please enter a valid email address.');
            return;
        }

        submitText.textContent = 'Sending...';
        submitSpinner.style.display = 'inline-block';
        submitBtn.disabled = true;

        const templateParams = {
            from_name: name,
            from_email: email,
            subject: subject || 'No Subject',
            message: message,
        };

        emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
            .then((response) => {
                console.log('SUCCESS!', response.status, response.text);
                showFormMessage('success', 'Thank you! Your message has been sent successfully.');
                contactForm.reset();
            })
            .catch((error) => {
                console.error('FAILED...', error);
                if (error && error.status === 404) {
                     showFormMessage('error', 'Configuration Error: EmailJS account not found. Please double-check your Public Key in the script.');
                } else {
                     showFormMessage('error', 'Sorry, something went wrong. Please check your EmailJS template configuration and try again.');
                }
            })
            .finally(() => {
                submitText.textContent = 'Send Message';
                submitSpinner.style.display = 'none';
                submitBtn.disabled = false;
            });
    }
});
