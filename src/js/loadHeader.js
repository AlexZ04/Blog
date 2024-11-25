import * as connection from "./connection/usersConnection.js";

var path = '/src/components';

document.addEventListener('DOMContentLoaded', () => {
    fetch(`${path}/header.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;

            document.querySelectorAll('.main_page').forEach(element => {
                element.addEventListener('click', () => {
                    window.location.href = '/index.html';
                });
            });

            document.getElementById('login').addEventListener('click', () => {
                window.location.href = '/src/login/login.html';
            });

            renderHeader();
            addSelectionMenu();
        });

    fetch(`${path}/footer.html`)
        .then(response => response.text())
        .then(data => document.getElementById('footer').innerHTML = data);

});


function renderHeader() {
    const accessToken = localStorage.getItem('access_token');

    const headerName = document.getElementById('header_name');
    const unauthorizedHeader = document.querySelector('.unauthorized-header');
    const authorizedHeader = document.querySelector('.loggined-header');

    if (accessToken != null) {
        unauthorizedHeader.classList.add('hidden');
        authorizedHeader.classList.remove('hidden');
        headerName.innerText = localStorage.getItem('email');
    }
    else {
        authorizedHeader.classList.add('hidden');
        unauthorizedHeader.classList.remove('hidden');
    }
}

function addSelectionMenu() {
    const profileSelectArrow = document.getElementById('profile_select');
    const profileSelectionBtn = document.querySelector('.profile-select-button-cont');

    const headerRightPart = document.querySelector(".selection-menu");
    
    headerRightPart.addEventListener('mouseover', () => {
        if (profileSelectionBtn.classList.contains('hidden')) {
            profileSelectionBtn.classList.remove('hidden');
        }
    });

    headerRightPart.addEventListener('mouseleave', () => {
        if (!profileSelectionBtn.classList.contains('hidden')) {
            profileSelectionBtn.classList.add('hidden');
        }
    });

    const profileBtn = document.getElementById('profile_nav_btn');
    const exitBtn = document.getElementById('exit_btn');

    exitBtn.addEventListener('click', () => {
        connection.Logout();
        renderHeader();
    });
}
