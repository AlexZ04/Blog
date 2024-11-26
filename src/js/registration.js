import * as usersConnection from "./connection/usersConnection.js";
import { GENDERS } from "./constants.js";
import * as validation from "./validation.js";

const regBtn = document.getElementById('register_user');

const name = document.getElementById('name_reg');
const birthDate = document.getElementById('date_reg');
const gender = document.getElementById('gender_reg');
const phone = document.getElementById('phone_reg');
const email = document.getElementById('email_reg');
const password = document.getElementById('password_login');
const passwordAgain = document.getElementById('password_login_repeat');

phone.oninput = function() {
    if (!validation.validPhone(phone.value) && phone.value) {
        document.querySelector('.phone-reg').classList.add("not-valid");
    }
    else {
        document.querySelector('.phone-reg').classList.remove("not-valid");
    }
}

regBtn.addEventListener('click', async () => {
    var inpName = name.value;
    var inpBirth = birthDate.value;
    var inpGender = gender.value === "Мужской" ? GENDERS.MALE : GENDERS.FEMALE;
    var inpPhone = phone.value;
    var inpEmail = email.value;
    var inpPas = password.value;
    var inpPasRepeat = passwordAgain.value; 

    if (!validation.validPhone(phone.value) && phone.value) {
        alert("Номер не подходит!");
        return;
    }

    if (inpPas !== inpPasRepeat) {
        alert("Повторите пароль!");
        return;
    }

    var res = await usersConnection.Register(inpName, inpPas, inpEmail, inpBirth, inpGender, inpPhone);

    if (res) {
        localStorage.setItem("access_token", res);
        localStorage.setItem("email", inpEmail);
        window.location.href = '/index.html';
    }
});