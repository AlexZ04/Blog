const pasControl = document.querySelector('.password-control');
const input = document.getElementById('password_login');

pasControl.addEventListener("click", () => {
    if (pasControl.classList.contains('view')) {
        pasControl.classList.remove('view');
        input.setAttribute('type', 'password');
    }
    else {
        pasControl.classList.add('view');
        input.setAttribute('type', 'text');
    }
});
