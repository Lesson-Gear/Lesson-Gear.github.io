        document.addEventListener('DOMContentLoaded', function () {
            const darkModeToggle = document.getElementById('darkModeToggle');

            darkModeToggle.addEventListener('change', function () {
                document.documentElement.classList.toggle('dark-mode', darkModeToggle.checked);
            });

            // Check the user's preference from localStorage
            if (localStorage.getItem('darkMode') === 'enabled') {
                darkModeToggle.checked = true;
                document.documentElement.classList.add('dark-mode');
            }

            // Save user's preference to localStorage
            darkModeToggle.addEventListener('change', function () {
                localStorage.setItem('darkMode', darkModeToggle.checked ? 'enabled' : 'disabled');
            });
        });
