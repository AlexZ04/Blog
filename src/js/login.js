import * as usersConnection from "./connection/usersConnection.js";

const email = document.getElementById('email_login');
const passwprd = document.getElementById('password_login');
const loginButton = document.getElementById('enter_login_btn');

loginButton.addEventListener('click', async () => {
    var inpEmail = email.value;
    var inpPas = passwprd.value;

    var res = await usersConnection.LoginUser(inpEmail, inpPas);

    if (res) {
        localStorage.setItem("access_token", res);
        localStorage.setItem("email", inpEmail);
        localStorage.setItem("login_time", new Date());

        localStorage.setItem("user_id", await usersConnection.GetProfile().id);

        window.location.href = '/index.html';
    }
});
