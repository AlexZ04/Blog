import { API_URL } from "../constants.js";

export async function GetPostsList(tags, author, min, max, sorting, onlyMyCommunities, page, size) {
    var url = API_URL + "api/post";

    try {
        var response = fetch(url, {
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify({tags, author, min, max, sorting, onlyMyCommunities, page, size})
        });

        if (response.ok) {
            let data = await response.json();

            return data;
        }
    }
    catch (e) {
        console.log(e);
    }
}