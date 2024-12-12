import * as usersConnection from "./connection/usersConnection.js";
import { delay } from "./delay.js";

const email = document.getElementById('email_login');
const passwprd = document.getElementById('password_login');
const loginButton = document.getElementById('enter_login_btn');

loginButton.addEventListener('click', async () => {
    var inpEmail = email.value.trim();
    var inpPas = passwprd.value.trim();

    if (inpEmail.length < 1) {
        email.classList.add('anim');
        delay(500).then(() => email.classList.remove('anim'));
        return;
    }

    if (inpPas.length < 1) {
        passwprd.classList.add('anim');
        document.querySelector('.password-control').classList.add('anim');
        delay(500).then(() => document.querySelector('.password-control').classList.remove('anim'));
        delay(500).then(() => passwprd.classList.remove('anim'));
        return;
    }

    var res = await usersConnection.LoginUser(inpEmail, inpPas);

    if (res) {
        localStorage.setItem("access_token", res);
        localStorage.setItem("email", inpEmail);
        localStorage.setItem("login_time", new Date());

        localStorage.setItem("user_id", await (await usersConnection.GetProfile()).id);

        window.location.href = '/index.html';
    }
});
