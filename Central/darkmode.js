document.addEventListener('DOMContentLoaded', function () {
    // Check the user's preference from localStorage
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';

    // Apply dark mode styles if enabled
    if (darkModeEnabled) {
        document.documentElement.classList.add('dark-mode');
    }

    // Set the stylesheet based on the dark mode preference
    const darkModeStylesheet = document.getElementById('darkModeStylesheet');
    darkModeStylesheet.href = darkModeEnabled ? 'styles-dark.css' : 'styles.css';

    // Invert colors if dark mode is enabled
    if (darkModeEnabled) {
        document.documentElement.style.filter = 'invert(75%)';
    }
});
