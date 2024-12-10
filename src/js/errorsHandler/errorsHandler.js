import { ERRORS_PAGES } from "../constants.js";

export function Relocate(code, message) {
    if (ERRORS_PAGES.get(code) == "Unauthorized") {
        alert(message);
        return;
    }
    window.location.href = `/src/errorsPages/${ERRORS_PAGES.get(code)}.html`;
}
