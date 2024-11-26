import { PHONE_REGEX } from "./constants.js";

export function validPhone(phone) {
    return PHONE_REGEX.test(phone);
}