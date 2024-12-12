import { PHONE_REGEX, EMAIL_REGEX } from "./constants.js";

export function validPhone(phone) {
    return PHONE_REGEX.test(phone);
}

export function validEmail(email) {
    return EMAIL_REGEX.test(email);
}
