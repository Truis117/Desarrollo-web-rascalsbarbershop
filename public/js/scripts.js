// Small client-side form validation and tiny UX helpers
document.addEventListener('DOMContentLoaded', function () {
    // Set copyright year
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Mobile menu toggle
    var menuToggle = document.querySelector('.menu-toggle');
    var mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function () {
            var isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
        });

        // Close menu when clicking on a link
        var navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (e) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }

    var form = document.getElementById('booking-form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        var name = form.querySelector('#name');
        if (!name || !name.value.trim()) {
            e.preventDefault();
            name.focus();
            alert('Please enter your full name to request a booking.');
            return false;
        }
        // Basic success UX (no real backend)
        e.preventDefault();
        alert('Thanks! Your booking request has been received. We will contact you to confirm.');
        form.reset();
    });
});

