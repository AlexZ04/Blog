import { API_URL } from "../constants.js";
import { Relocate } from "../errorsHandler/errorsHandler.js";

export async function SearchAdress(parentObjectId, query) {
    const params = new URLSearchParams();

    if (parentObjectId) params.append("parentObjectId", parentObjectId);
    if (query) params.append("query", query);

    var url = API_URL + `/api/address/search?${params.toString()}`;

    try {
        let response = await fetch(url);

        if (response.ok) {
            let data = await response.json();

            return data;
        }
        else {
            Relocate(response.status);
        }
    }
    catch (e) {
        console.log(e);
    }
}

export async function GetChain(objectGuid) {
    const params = new URLSearchParams();

    if (objectGuid) params.append("objectGuid", objectGuid);

    var url = API_URL + `/api/api/address/chain?${params}`;

    try {
        let response = await fetch(url);

        if (response.ok) {
            let data = await response.json();

            return data;
        }
        else {
            Relocate(response.status);
        }
    }
    catch (e) {
        console.log(e);
    }
}
