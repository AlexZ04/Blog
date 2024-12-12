import { RESULTS, API_URL } from "../constants.js";
import { Relocate } from "../errorsHandler/errorsHandler.js";

export async function GetReplies(id) {
    var url = API_URL + `/api/comment/${id}/tree`;

    try {
        let response = await fetch(url);

        if (response.ok) {
            let data = await response.json();

            return data;
        }
        Relocate(response.status);
    }
    catch (e) {
        console.log(e);
    }
}

export async function AddReply(id, content, parentId) {
    var url = API_URL + `/api/post/${id}/comment`;

    var body = parentId ? JSON.stringify({ content, parentId }) : JSON.stringify({ content });

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            },
            body: body
        });

        if (response.ok) {
            return RESULTS.SUCCESS;
        }
        Relocate(response.status);
    }
    catch (e) {
        console.log(e);
    }
}

export async function EditComment(id, content) {
    var url = API_URL + `/api/comment/${id}`;

    try {
        let response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            },
            body: JSON.stringify({ content })
        });

        if (response.ok) {
            return RESULTS.SUCCESS;
        }
        Relocate(response.status);
    }
    catch (e) {
        console.log(e);
    }
}

export async function DeleteComment(id) {
    var url = API_URL + `/api/comment/${id}`;

    try {
        let response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            },
        });

        if (response.ok) {
            return RESULTS.SUCCESS;
        }
        Relocate(response.status);
    }
    catch (e) {
        console.log(e);
    }
}
