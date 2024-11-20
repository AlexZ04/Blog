const pasControl = document.querySelector('.password-control');
const inputPas = document.getElementById('password_login');
const inputPasRepeat = document.getElementById('password_login_repeat');

pasControl.addEventListener("click", () => {
    if (pasControl.classList.contains('view')) {
        pasControl.classList.remove('view');
        inputPas.setAttribute('type', 'password');

        if (inputPasRepeat != null) inputPasRepeat.setAttribute('type', 'password');
    }
    else {
        pasControl.classList.add('view');
        inputPas.setAttribute('type', 'text');

        if (inputPasRepeat != null) inputPasRepeat.setAttribute('type', 'text');
    }
});
