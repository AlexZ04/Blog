import { RESULTS } from "../constants.js";

export async function Register(fullName, password, email, birthDate, gender, phoneNumber) {
    var url = "https://blog.kreosoft.space/api/account/register";

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({fullName, password, email, birthDate, gender, phoneNumber})
        });

        if (response.ok) {
            let data = await response.json();

            return data.token;
        }
        else {
            alert(response.status);
        }
    }
    catch (e) {
        console.log(e);
    }
}

export async function LoginUser(email, pas){
    var url = "https://blog.kreosoft.space/api/account/login";

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email, password: pas})
        });

        if (response.ok) {
            let data = await response.json();

            return data.token;
        }
        else if (response.status === 401) {
            resetToken();
        }
        else {
            alert(response.status);
        }
    }
    catch (e) {
        console.log(e);
    }
}

export async function Logout() {
    var url = "https://blog.kreosoft.space/api/account/logout";

    try {
        let response = await fetch(url, {
            method: 'POST'
        })

        if (response.ok || response.status === 401) {
            resetToken();
        }
        else {
            alert(response.status);
        }
    }
    catch (e) {
        console.log(e);
    }
}

export async function GetProfile() {
    var url = "https://blog.kreosoft.space/api/account/profile";

    try {
        let response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
        }
        );

        if (response.ok) {
            var userInfo = await response.json();

            return userInfo;
        }
        else if (response.status === 401) {
            return;
        }
        else {
            alert(response.status);
        }
    }
    catch (e) {
        console.log(e);
    }
}

export async function EditProfile(email, fullName, birthDate, gender, phoneNumber) {
    var url = "https://blog.kreosoft.space/api/account/profile";

    try {
        let response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            },
            body: JSON.stringify({email, fullName, birthDate, gender, phoneNumber})
        });

        if (response.ok) {
            return RESULTS.SUCCESS;
        }
        else if (response.status === 401) {
            resetToken();
        }
        else {
            return RESULTS.ERROR;
        }
    }
    catch (e) {
        console.log(e);
    }
}

export function resetToken() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("name");
    location.reload();
}