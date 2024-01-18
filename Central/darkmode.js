document.addEventListener('DOMContentLoaded', function () {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';

    if (darkModeEnabled) {
        document.documentElement.classList.add('dark-mode');
    }
});

// Toggle dark mode and invert colors
function toggleDarkMode() {
    const isDarkMode = document.documentElement.classList.toggle('dark-mode');
    invertColors(isDarkMode);
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
}

function invertColors(isDarkMode) {
    const filterValue = isDarkMode ? 'invert(87%)' : 'invert(0)';
    document.body.style.filter = filterValue;
}
