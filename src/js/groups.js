import * as communityConnection from "./connection/communityConnection.js";
import { RESULTS, ROLES } from "./constants.js";

const groupTemplate = document.getElementById('group-small-template');
const groupCont = document.querySelector('.group-container');

var groups = await communityConnection.GetCommunities();

groups.forEach(async element => {
    var group = groupTemplate.content.cloneNode(true);
    var subBtn = group.querySelector('.blue');
    var unsubBtn = group.querySelector('.red');
    var subHead = group.querySelector('h3');

    subHead.textContent = element.name;

    var userRole = await communityConnection.GetGreatestRole(element.id);

    if (userRole === ROLES.Admin) {
        subBtn.classList.add('hidden');
        unsubBtn.classList.add('hidden');
    }
    else if (userRole === ROLES.Sub) {
        subBtn.classList.add('hidden');
    }
    else {
        unsubBtn.classList.add('hidden');
    }

    subHead.addEventListener('click', () => {
        localStorage.setItem('group_id', element.id);
        window.location.href = "./groupInfo.html";
    });

    subBtn.addEventListener('click', () => {

        if (communityConnection.Subscribe(element.id)) {
            subBtn.classList.add('hidden');
            unsubBtn.classList.remove('hidden');
        }
        
    });

    unsubBtn.addEventListener('click', () => {

        if (communityConnection.Unsubscribe(element.id)) {
            subBtn.classList.remove('hidden');
            unsubBtn.classList.add('hidden');
        }

    });

    groupCont.appendChild(group);
});
