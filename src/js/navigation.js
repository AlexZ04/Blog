const registerBtn = document.getElementById('register_login_btn');

if (registerBtn) {
    registerBtn.addEventListener('click', () => {
        window.location.href = '/src/register/registration.html';
    });
}
