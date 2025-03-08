document.querySelectorAll('.chart-tab').forEach(tab => {
    tab.addEventListener('click', function() {
        document.querySelector('.active-tab').classList.remove('active-tab');
        document.querySelector('.active-tab').classList.add('inactive-tab');
        this.classList.remove('inactive-tab');
        this.classList.add('active-tab');
    });
});

// Preserve your existing navigation functionality
document.getElementById('dsr-nav').addEventListener('click', function() {
    window.location.href = 'dsr.ejs';
});

document.getElementById('exp-nav').addEventListener('click', function() {
    window.location.href = 'exp.ejs';
});