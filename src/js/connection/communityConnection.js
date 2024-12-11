import { RESULTS, API_URL } from "../constants.js";
import { Relocate } from "../errorsHandler/errorsHandler.js";

export async function GetCommunities() {
    var url = API_URL + '/api/community';

    try {
        var response = await fetch(url);

        if (response.ok) {
            var data = await response.json();

            return data;
        }
        Relocate(response.status);
    }
    catch (e) {
        console.log(e);
    }
    
}

export async function GetUserCommunities() {
    var url = API_URL + '/api/community/my';

    try {
        var response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            },
        });

        if (response.ok) {
            var data = await response.json();

            return data;
        }
        Relocate(response.status);
    }
    catch (e) {
        console.error(e);
    }
    
}

export async function GetCommunityInfo(id) {
    var url = API_URL + `/api/community/${id}`;

    try {
        var response = await fetch(url);

        if (response.ok) {
            var data = await response.json();

            return data;
        }
        Relocate(response.status);
    }
    catch (e) {
        console.error(e);
    }
    
}

export async function GetCommunityPosts(id, tags, sorting, page = 1, size = 5) {
    const params = new URLSearchParams();

    if (tags) {
        tags.forEach(element => {
            params.append("tags", element);
        });
    }

    if (sorting) params.append("sorting", sorting);

    params.append("page", page);
    params.append("size", size);

    var url = API_URL + `/api/community/${id}/post?${params.toString()}`;

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
        Relocate(response.status);
    }
    catch (e) {
        console.error(e);
    }
}

export async function CreatePost(id, title, description, readingTime, image, addressId, tags) {
    var url = API_URL + `/api/community/${id}/role`;

    let body = JSON.stringify({title, description, readingTime, image, addressId, tags});

    try {
        let response = await fetch(url, {
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
        console.error(e);
    }
}

export async function GetGreatestRole(id) {
    var url = API_URL + `/api/community/${id}/role`;
    
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

export async function Subscribe(id) {
    var url = API_URL + `/api/community/${id}/subscribe`;

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("access_token")}`
            }
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

export async function Unsubscribe(id) {
    var url = API_URL + `/api/community/${id}/unsubscribe`;

    try {
        let response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
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
