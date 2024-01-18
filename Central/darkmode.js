document.addEventListener('DOMContentLoaded', function () {
    // Check the user's preference from localStorage
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';

    // Apply dark mode styles if enabled
    if (darkModeEnabled) {
        document.documentElement.classList.add('dark-mode');
        invertColors(87);
    }

    function invertColors(percentage) {
        // Apply inversion filter to all elements on the page
        document.body.style.filter = `invert(${percentage}%)`;
    }
});
