import { TOKEN_LIFETIME } from "./constants.js";

export function checkToken() {
    return localStorage.getItem('login_time') !== null && Date.parse(new Date()) - Date.parse(localStorage.getItem("login_time")) < TOKEN_LIFETIME;
}