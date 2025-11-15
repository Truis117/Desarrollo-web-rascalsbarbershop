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

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        var name = form.querySelector('#name');
        var phone = form.querySelector('#phone');
        var service = form.querySelector('#service');
        var dateTime = form.querySelector('#date');
        var barberoSelect = form.querySelector('#barbero');

        // Validaciones básicas
        if (!name || !name.value.trim()) {
            name.focus();
            alert('Please enter your full name to request a booking.');
            return false;
        }

        if (!service || !service.value) {
            service.focus();
            alert('Please select a service.');
            return false;
        }

        if (!barberoSelect || !barberoSelect.value) {
            barberoSelect.focus();
            alert('Please select a barber.');
            return false;
        }

        if (!dateTime || !dateTime.value) {
            dateTime.focus();
            alert('Please select a date and time.');
            return false;
        }

        // Parsear fecha y hora
        var datetime = new Date(dateTime.value);
        var fecha = datetime.toISOString().split('T')[0]; // YYYY-MM-DD
        var hora = datetime.toTimeString().split(' ')[0]; // HH:MM:SS

        // Preparar datos para la API
        var bookingData = {
            nombre_completo: name.value.trim(),
            telefono: phone.value.trim() || null,
            id_barbero: parseInt(barberoSelect.value),
            id_servicio: parseInt(service.value),
            fecha: fecha,
            hora: hora
        };

        try {
            // Deshabilitar botón de envío
            var submitBtn = form.querySelector('button[type="submit"]');
            var originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            // Enviar a la API
            var response = await fetch('/api/citas/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(bookingData)
            });

            var result = await response.json();

            if (response.ok) {
                alert('Thanks! Your booking request has been received. We will contact you to confirm.');
                form.reset();
            } else {
                alert('Error: ' + (result.error || 'Could not process your booking. Please try again.'));
            }

        } catch (error) {
            console.error('Booking error:', error);
            alert('Network error. Please check your connection and try again.');
        } finally {
            // Rehabilitar botón
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        }
    });
});

