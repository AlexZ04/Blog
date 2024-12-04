import { RESULTS, API_URL } from "../constants.js";

export async function GetCommunities() {
    var url = API_URL + '/api/community';

    try {
        var response = await fetch(url);

        if (response.ok) {
            var data = await response.json();

            return data;
        }
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
    }
    catch (e) {
        console.log(e);
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
    }
    catch (e) {
        console.log(e);
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
    }
    catch (e) {
        console.log(e);
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
    }  
    catch (e) {
        console.log(e);
    }
}
