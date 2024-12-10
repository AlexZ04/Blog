import { API_URL } from "../constants.js";
import { Relocate } from "../errorsHandler/errorsHandler.js";

export async function GetAuthorList() {
    var url = API_URL + "/api/author/list";

    try {
        let response = await fetch(url);

        if (response.ok) {
            let authorJson = await response.json();

            return authorJson;
        }
        else {
            Relocate(response.status);
        }

    }
    catch (e) {
        console.log(e);
    }
}
