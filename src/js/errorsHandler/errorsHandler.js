import { ERRORS_PAGES } from "../constants.js";

export function Relocate(code) {
    if (ERRORS_PAGES.get(code) == "Unauthorized") {
        alert();
        return;
    }
    window.location.href = `/src/errorsPages/${ERRORS_PAGES.get(code)}.html`;
}
