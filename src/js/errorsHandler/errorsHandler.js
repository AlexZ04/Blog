import { ERRORS_PAGES, UNAUTHORIZE_ERROR } from "../constants.js";
import { sendToast } from "../sendToast.js";

export function Relocate(code) {
    if (ERRORS_PAGES.get(code) == "Unauthorized") {
        sendToast(UNAUTHORIZE_ERROR);
        return;
    }

    window.location.href = `/src/errorsPages/${ERRORS_PAGES.get(code)}.html`;
}
