import * as userConnection from "./connection/usersConnection.js";
import { GENDERS, RESULTS } from "./constants.js";
import * as validation from "./validation.js";

document.addEventListener("DOMContentLoaded", async () => {
    const emailField = document.getElementById("edit_email");
    const fullNameField = document.getElementById("edit_name");
    const phoneField = document.getElementById("edit_phone");
    const genderField = document.getElementById("edit_gender");
    const dateField = document.getElementById("edit_date");

    var profileInfo = await userConnection.GetProfile();

    emailField.value = profileInfo.email;
    fullNameField.value = profileInfo.fullName;
    phoneField.value = profileInfo.phoneNumber;
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

        if (!validation.validPhone(phoneField.value)) {
            alert("Телефон должен совподать с маской +7 (xxx) xxx-xx-xx");
            return;
        }

        var res = await userConnection.EditProfile(emailField.value, fullNameField.value, dateField.value, 
            genderField.value === "Мужской" ? GENDERS.MALE : GENDERS.FEMALE, phoneField.value);

        if (res === RESULTS.SUCCESS) {
            localStorage.setItem("email", emailField.value);
            document.getElementById('header_name').innerHTML = emailField.value;
            alert("Сохранено");
        }
        else {
            alert("Не-а");
        }
    });
});