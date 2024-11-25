import { resetToken } from "./usersConnection";

export async function GetAuthorList() {
    var url = "https://blog.kreosoft.space/api/author/list";

    try {
        let response = await fetch(url);

        if (response.ok) {
            let authorJson = await response.json();

            return authorJson;
        }
        else if (response.status === 401) {
            resetToken();
        }
        else {
            alert(response.status);
        }

    }
    catch (e) {
        console.log(e);
    }
}
