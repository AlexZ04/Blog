import * as userConnection from "./connection/usersConnection.js";
import { GENDERS, RESULTS } from "./constants.js";

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

    saveBtn.addEventListener('click', async () => {
        var res = await userConnection.EditProfile(emailField.value, fullNameField.value, dateField.value, 
            genderField.value === "Мужской" ? GENDERS.MALE : GENDERS.FEMALE, phoneField.value);

        if (res === RESULTS.SUCCESS) {
            alert("Сохранено");
        }
        else {
            alert("Не-а");
        }
    });
});