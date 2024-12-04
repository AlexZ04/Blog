import { API_URL } from "../constants.js";

export async function GetTagList() {
    var url = API_URL + "/api/tag";

    try {
        let response = await fetch(url);

        if (response.ok) {
            let tagJson = await response.json();

            return tagJson;
        }
        else {
            alert(response.status);
        }

    }
    catch (e) {
        console.log(e);
    }
}

export var TAG_MAP = new Map();

let tagList = await GetTagList();
tagList.forEach(element => {
    TAG_MAP.set(element.name, element.id);
});
