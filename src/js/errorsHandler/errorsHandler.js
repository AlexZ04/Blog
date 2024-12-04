import { ERRORS_PAGES } from "../constants.js";

export function Relocate(code) {
    window.location.href = `/src/errorsPages/${ERRORS_PAGES.get(code)}.html`;
}
