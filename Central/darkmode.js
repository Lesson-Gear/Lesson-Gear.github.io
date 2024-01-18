document.addEventListener('DOMContentLoaded', function () {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'enabled';

    if (darkModeEnabled) {
        invertColors(87);
    }
});

document.addEventListener('click', function () {
    toggleDarkMode();
});

function toggleDarkMode() {
    const isDarkMode = document.documentElement.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');

    if (isDarkMode) {
        invertColors(87);
    } else {
        invertColors(0);
    }
}

function invertColors(percentage) {
    document.body.style.filter = `invert(${percentage}%)`;
}
