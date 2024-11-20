var path = '/src/components';

document.addEventListener('DOMContentLoaded', () => {
    fetch(`${path}/header.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            document.getElementById('main_page').addEventListener('click', () => {
                window.location.href = '/index.html';
            });

            document.getElementById('login').addEventListener('click', () => {
                window.location.href = '/src/login/login.html';
            });
        });

    fetch(`${path}/footer.html`)
        .then(response => response.text())
        .then(data => document.getElementById('footer').innerHTML = data);
});
