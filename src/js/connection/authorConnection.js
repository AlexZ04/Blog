import { API_URL } from "../constants";

export async function GetAuthorList() {
    var url = API_URL + "/api/author/list";

    try {
        let response = await fetch(url);

        if (response.ok) {
            let authorJson = await response.json();

            return authorJson;
        }
        else {
            alert(response.status);
        }

    }
    catch (e) {
        console.log(e);
    }
}
