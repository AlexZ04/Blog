import { API_URL, RESULTS } from "../constants.js";
import { checkToken } from "../tokenCheck.js";

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
        var response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            },
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

export async function CreatePost(title, description, readingTime, image, addressId, tags) {
    var url = API_URL + `/api/post`;

    var body = JSON.stringify({title, description, readingTime, image, addressId, tags});

    try {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            },
            body: body
        });

        if (response.ok) {
            let id = await response.json();

            return id;
        }
        Relocate(response.status);
    }
    catch (e) {
        console.error(e);
    }
}

export async function GetPostInfo(id) {
    var url = API_URL + `/api/post/${id}`;

    try {
        let response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            },
        });

        if (response.ok) {
            let data = await response.json();

            return data;
        }
        Relocate(response.status);
    }
    catch (e) {
        console.error(e);
    }
}

export async function SetLike(postId) {
    var url = API_URL + `/api/post/${postId}/like`;

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
        });

        if (response.ok) {
            return RESULTS.SUCCESS;
        }
        Relocate(response.status);
    }
    catch (e) {
        console.error(e);
    }
}

export async function DeleteLike(postId) {
    var url = API_URL + `/api/post/${postId}/like`;

    try {
        let response = await fetch(url, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
        });

        if (response.ok) {
            return RESULTS.SUCCESS;
        }
        Relocate(response.status);
    }
    catch (e) {
        console.error(e);
    }
}
