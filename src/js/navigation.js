const loginNavBtn = document.getElementById('login');
const mainNavBtn = document.getElementById('main_page');
const registerBtn = document.getElementById('register_login_btn');

loginNavBtn.addEventListener('click', () => {
    window.location.href = '/src/login/login.html';
});

mainNavBtn.addEventListener('click', () => {
    window.location.href = '/index.html';
});

registerBtn.addEventListener('click', () => {
    window.location.href = '/src/register/registration.html';
});
