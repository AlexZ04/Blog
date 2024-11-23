export async function LoginUser(email, pas){
    var url = "https://blog.kreosoft.space/api/account/login";

    try {
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email, password: pas})
        });

        if (response.ok) {
            let data = await response.json();

            return data.token;
        }
    }
    catch (e) {
        console.log(e);
    }
}