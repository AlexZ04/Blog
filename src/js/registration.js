import * as usersConnection from "./connection/usersConnection.js";
import { GENDERS } from "./constants.js";
import { sendToast } from "./sendToast.js";
import * as validation from "./validation.js";
import { delay } from "./delay.js";

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
    var inpName = name.value.trim();
    var inpBirth = birthDate.value;
    var inpGender = gender.value === "Мужской" ? GENDERS.MALE : GENDERS.FEMALE;
    var inpPhone = phone.value.trim();
    var inpEmail = email.value.trim();
    var inpPas = password.value.trim();
    var inpPasRepeat = passwordAgain.value.trim(); 

    if (!validation.validPhone(inpPhone) && inpPhone) {
        sendToast("Номер не подходит!");
        return;
    }

    if (!validation.validEmail(inpEmail) && inpEmail) {
        sendToast("Почта не подходит!");
        return;
    }

    if (inpPas !== inpPasRepeat) {
        sendToast("Повторите пароль!");
        return;
    }

    if (inpName.length < 1) {
        name.classList.add('anim');
        delay(500).then(() => name.classList.remove('anim'));
        return;
    }
    else if (inpName.length > 1000) {
        name.style.transition = "2s ease-in";
        name.style.border = "1px solid red";
        delay(2000).then(() => name.style.border = "1px solid rgba(184, 191, 196, 0.4)");
        sendToast("Имя слишком длинное!");
        return;
    }

    if (inpEmail.length < 1) {
        email.classList.add('anim');
        delay(500).then(() => email.classList.remove('anim'));
        return;
    }

    if (inpPas.length < 6) {
        password.style.transition = "2s ease-in";
        password.style.border = "1px solid red";
        delay(2000).then(() => password.style.border = "1px solid rgba(184, 191, 196, 0.4)");
        sendToast("Пароль должен состоять минимум из 6 символов!");
        return;
    }

    var res = await usersConnection.Register(inpName, inpPas, inpEmail, inpBirth, inpGender, inpPhone);

    if (res) {
        localStorage.setItem("access_token", res);
        localStorage.setItem("email", inpEmail);
        localStorage.setItem("login_time", new Date());

        localStorage.setItem("user_id", await (await usersConnection.GetProfile()).id);
        
        window.location.href = '/index.html';
    }
});