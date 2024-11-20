const loginNavBtn = document.getElementById('login');
const mainNavBtn = document.getElementById('main_page');
const registerBtn = document.getElementById('register_login_btn');

registerBtn.addEventListener('click', () => {
    window.location.href = '/src/register/registration.html';
});
