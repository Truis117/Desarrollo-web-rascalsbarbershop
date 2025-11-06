// Small client-side form validation and tiny UX helpers
document.addEventListener('DOMContentLoaded', function () {
    // Set copyright year
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

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
