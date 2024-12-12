import * as userConnection from "./connection/usersConnection.js";
import { GENDERS, RESULTS } from "./constants.js";
import * as validation from "./validation.js";
import { delay } from "./delay.js";
import { sendToast, sendToastSaved } from "./sendToast.js";

document.addEventListener("DOMContentLoaded", async () => {
    const emailField = document.getElementById("edit_email");
    const fullNameField = document.getElementById("edit_name");
    const phoneField = document.getElementById("edit_phone");
    const genderField = document.getElementById("edit_gender");
    const dateField = document.getElementById("edit_date");

    var profileInfo = await userConnection.GetProfile();

    emailField.value = profileInfo.email.trim();
    fullNameField.value = profileInfo.fullName.trim();
    phoneField.value = profileInfo.phoneNumber.trim();
    dateField.value = profileInfo.birthDate.split('T')[0];

    if (profileInfo.gender === GENDERS.MALE) {
        genderField.value = "Мужской";
    }
    else {
        genderField.value = "Женский";
    }


    const saveBtn = document.getElementById("save_edit_profile");

    phoneField.oninput = function() {
        if (!validation.validPhone(phoneField.value)) {
            document.querySelector('.edit-phone').classList.add("not-valid");
        }
        else {
            document.querySelector('.edit-phone').classList.remove("not-valid");
        }
    }

    saveBtn.addEventListener('click', async () => {

        var emailVal = emailField.value.trim();
        var nameVal = fullNameField.value.trim();
        var phoneVal = phoneField.value.trim();

        if (emailVal.length < 1) {
            emailField.classList.add('anim');
            delay(500).then(() => emailField.classList.remove('anim'));
            return;
        }
        else if (!validation.validEmail(emailVal) && emailVal) {
            sendToast("Неверный email-адрес!");
            emailField.style.transition = "2s ease-in";
            emailField.style.border = "1px solid red";
            delay(2000).then(() => emailField.style.border = "1px solid rgba(184, 191, 196, 0.4)");
            return;
        }

        if (!validation.validPhone(phoneVal) && phoneVal) {
            sendToast("Неверный номер телефона!");
            phoneField.style.transition = "2s ease-in";
            phoneField.style.border = "1px solid red";
            delay(2000).then(() => phoneField.style.border = "1px solid rgba(184, 191, 196, 0.4)");
            return;
        }

        if (nameVal.length < 1) {
            fullNameField.classList.add('anim');
            delay(500).then(() => fullNameField.classList.remove('anim'));
            return;
        }
        else if (nameVal.length > 1000) {
            sendToast("Слишком длинное имя");
            fullNameField.style.transition = "2s ease-in";
            fullNameField.style.border = "1px solid red";
            delay(2000).then(() => fullNameField.style.border = "1px solid rgba(184, 191, 196, 0.4)");
            return;
        }

        var res = await userConnection.EditProfile(emailVal, nameVal, dateField.value, 
            genderField.value === "Мужской" ? GENDERS.MALE : GENDERS.FEMALE, phoneVal);

        if (res === RESULTS.SUCCESS) {
            localStorage.setItem("email", emailVal);
            document.getElementById('header_name').innerHTML = emailVal;
            sendToastSaved("Сохранено!");
        }
    });
});