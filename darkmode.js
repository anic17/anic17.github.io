function setupDarkMode() {
    const toggle = document.getElementById('dark-mode-toggle');
    const icon = document.getElementById('theme-icon');
    
    if (!toggle || !icon) return;

    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        const isDark = document.body.classList.contains('dark-theme');
        
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        icon.className = isDark ? 'fa fa-sun-o' : 'fa fa-moon-o';
    });

    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
        icon.className = 'fa fa-sun-o';
    }
}

const checkExist = setInterval(() => {
    if (document.getElementById('dark-mode-toggle')) {
        setupDarkMode();
        clearInterval(checkExist);
    }
}, 100);
