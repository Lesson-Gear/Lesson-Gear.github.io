document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeStylesheet = document.getElementById('darkModeStylesheet');

    darkModeToggle.addEventListener('change', function () {
        document.documentElement.classList.toggle('dark-mode', darkModeToggle.checked);

        // Toggle between lightmode.css and darkmode.css
        const newStylesheet = darkModeToggle.checked ? 'darkmode.css' : 'lightmode.css';
        darkModeStylesheet.href = newStylesheet;

        localStorage.setItem('darkMode', darkModeToggle.checked ? 'enabled' : 'disabled');
    });

    // Check the user's preference from localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        darkModeToggle.checked = true;
        document.documentElement.classList.add('dark-mode');
        darkModeStylesheet.href = 'darkmode.css';
    }
});
