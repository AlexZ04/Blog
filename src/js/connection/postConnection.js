import { API_URL } from "../constants.js";

export async function GetPostsList(tags, author, min, max, sorting, onlyMyCommunities = false, page = 1, size = 5) {
    const params = new URLSearchParams();

    if (tags) {
        tags.forEach(element => {
            params.append("tags", element);
        });
    }

    if (author) params.append("author", author);

    if (min) params.append("min", min);

    if (max) params.append("max", max);

    if (sorting) params.append("sorting", sorting);

    params.append("onlyMyCommunities", onlyMyCommunities);
    params.append("page", page);
    params.append("size", size);
    var url = API_URL + "/api/post" + `?${params.toString()}`;

    try {
        var response;
        if (!localStorage.getItem('access_token')) response = await fetch(url);
        else {
            response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`
                },
            });
            
        }

        if (response.ok) {
            let data = await response.json();

            return data;
        }
    }
    catch (e) {
        console.log(e);
    }
}