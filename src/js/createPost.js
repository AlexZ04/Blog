import * as addressConnection from "./connection/addressConnection.js";
import * as communityConnection from "./connection/communityConnection.js";
import * as postConnection from "./connection/postConnection.js";
import { TAG_MAP } from "./connection/tagConnection.js";
import { ROLES } from "./constants.js";
import { delay } from "./delay.js";
import { checkToken } from "./tokenCheck.js";
import { sendToast } from "./sendToast.js";

checkToken();

const postName = document.getElementById('post_name');
const postTime = document.getElementById('post_time');
const postGroup = document.getElementById('post_group');
const postTags = document.getElementById('tags_filter');
const postImage = document.getElementById('post_image');
const postDescription = document.getElementById('post_description');

const createPostBtn = document.getElementById('create_post_btn');

const addressSelectionContainer = document.querySelector('.address');
const groupSelect = document.querySelector('.group-select').querySelector('select');

const adressSelectionTemplate = document.getElementById('adress_selection_template');

setSelect();

async function setSelect(parentId, query) {
    var newSelect = adressSelectionTemplate.content.cloneNode(true);

    var selectHeader = newSelect.querySelector('p');

    var selectField = newSelect.querySelector('.select2');
    selectField.dataset.parent = parentId;

    var addMap = await getOpt(parentId, query);

    for (let subjectText of addMap.keys()) {

        var newOptGroup = document.createElement('optgroup');
        newOptGroup.label = subjectText;
        
        addMap.get(subjectText).forEach(element => {
            var newOption = document.createElement('option');
            newOption.textContent = element.text;
            newOption.dataset.index = element.objectId;
            newOption.dataset.guid = element.objectGuid;
            newOption.dataset.objectLevel = element.objectLevelText;

            newOptGroup.appendChild(newOption);
        });

        selectField.appendChild(newOptGroup);
    }

    selectField.onchange = function() {
        let flag = false;
        let childrensToRemove = [];
        for (const children of addressSelectionContainer.children) {

            if (flag) {
                childrensToRemove.push(children);
            }
            else if (children.querySelector('p') && children.querySelector('select').value === selectField.value && 
                selectField.parentElement.querySelector('p').textContent === children.querySelector('p').textContent) {

                flag = true;
            }

        }

        childrensToRemove.forEach(children => {
            addressSelectionContainer.removeChild(children);
        });

        if (selectField.value !== "-")
            setSelect(selectField.options[selectField.selectedIndex].dataset.index);

        selectHeader.textContent = selectField.options[selectField.selectedIndex].dataset.objectLevel;

        if (selectField.value === "-") selectHeader.textContent = 'Следующий элемент адреса';
    }

    if (Array.from(addMap.keys()).length !== 0)
    addressSelectionContainer.appendChild(newSelect);

    $('.select2').select2();
    $('.select2').on('select2:open', function(e) {
        var searchField = $(this).data('select2').$dropdown.find('input').get(0);
        
        searchField.oninput = async function() {
            await updateOptions(selectField, searchField.value)
        }
    });

    $('.select2').on('select2:close', function(e) {
        var searchField = $(this).data('select2').$dropdown.find('input').get(0);
        
        searchField.oninput = async function() {
            await updateOptions(selectField)
        }
    });
}

const select = document.querySelector('.tag-select');

TAG_MAP.keys().forEach(element => {
    var option = document.createElement('option');
    option.text = element;

    select.appendChild(option);
});

$(window).on('resize', function () {
    $('.select2').select2();
});

async function updateOptions(select, text) {
    select.innerHTML = "";

    var addMap = await getOpt(select.dataset.parent, text);

    var newOption = document.createElement('option');
    newOption.textContent = "-";
    select.appendChild(newOption);

    for (let subjectText of addMap.keys()) {

        var newOptGroup = document.createElement('optgroup');
        newOptGroup.label = subjectText;
        
        addMap.get(subjectText).forEach(element => {
            var newOption = document.createElement('option');
            newOption.textContent = element.text;
            newOption.dataset.index = element.objectId;
            newOption.dataset.guid = element.objectGuid;
            newOption.dataset.objectLevel = element.objectLevelText;

            newOptGroup.appendChild(newOption);
        });

        select.appendChild(newOptGroup);
    }

}

async function getOpt(parentId, query) {
    var addressInfo = await addressConnection.SearchAdress(parentId, query);

    var addMap = new Map();

    addressInfo.forEach(element => {
        if (!addMap.get(element.objectLevelText)) addMap.set(element.objectLevelText, []);

        addMap.get(element.objectLevelText).push(element);
    });

    return addMap;
}

var groupsId = new Map();

async function setCommunitites() {
    var userGroups = await communityConnection.GetUserCommunities();

    userGroups.forEach(async group => {
        if (group.role === ROLES.Admin) {
            var newOpt = document.createElement('option');
    
            var groupInfo = await communityConnection.GetCommunityInfo(group.communityId);
            newOpt.textContent = groupInfo.name;
            groupSelect.appendChild(newOpt);

            if (localStorage.getItem('create_post_group_name') && localStorage.getItem('create_post_group_name') === groupInfo.name) {
                groupSelect.value = localStorage.getItem('create_post_group_name');
                localStorage.removeItem('create_post_group_name');
            }
    
            groupsId.set(groupInfo.name, group.communityId);
        }
    });

    
}

await setCommunitites();

createPostBtn.addEventListener('click', async () => {
    let flag = true;

    let tagsId = [];
    [...postTags.selectedOptions].map(opt => opt.value).forEach(element => {
        tagsId.push(TAG_MAP.get(element));
    });

    let name = postName.value.trim();
    let time = postTime.value.trim();
    let group = postGroup.value;
    let image = postImage.value.trim();
    let descr = postDescription.value.trim();
    let lastAddId;
    
    if (!name || name.length < 5 || name.length > 1000) {
        flag = false;

        postName.style.transition = "2s ease-in";
        postName.style.border = "1px solid red";
        delay(2000).then(() => postName.style.border = "1px solid rgba(184, 191, 196, 0.4)");

        if (!name) sendToast("Заголовок поста не может быть пустым!");
        else if (name.length < 5) sendToast("Минимальное количество символов в заголовке поста: 5!");
        else sendToast("Максимальное количество символов в заголовке поста: 1000!");

        return;
    }

    if (!time) {
        flag = false;
        postTime.style.transition = "2s ease-in";
        postTime.style.border = "1px solid red";
        delay(2000).then(() => postTime.style.border = "1px solid rgba(184, 191, 196, 0.4)");
        sendToast("Текст поста не может быть пустым!");

        return;
    }

    if (!descr || descr.length < 5 || descr.length > 5000) {
        flag = false;

        postDescription.style.transition = "2s ease-in";
        postDescription.style.border = "1px solid red";
        delay(2000).then(() => postDescription.style.border = "1px solid rgba(184, 191, 196, 0.4)");
        
        if (!descr) sendToast("Поле времени не может быть пустым!");
        else if (descr.length < 5) sendToast("Минимальное количество символов в тексте поста: 5!");
        else sendToast("Максимальное количество символов в тексте поста: 5000!");

        return;
    }

    if (tagsId.length === 0) {
        flag = false;

        postTags.style.transition = "2s ease-in";
        postTags.style.border = "1px solid red";
        delay(2000).then(() => postTags.style.border = "1px solid rgba(184, 191, 196, 0.4)");

        sendToast("Должен быть выбран хотя бы 1 тег!");

        return;
    }

    if (image.length > 1000) {
        flag = false;

        postImage.style.transition = "2s ease-in";
        postImage.style.border = "1px solid red";
        delay(2000).then(() => postImage.style.border = "1px solid rgba(184, 191, 196, 0.4)");

        sendToast("Максимальная длина ссылки на изображение: 1000 символов!");

        return;
    }

    var lastAddress = addressSelectionContainer.lastElementChild.previousElementSibling.querySelector('select');

    if (lastAddress) {
        lastAddId = lastAddress.options[lastAddress.selectedIndex].dataset.guid;
    }
    
    var postId;

    if (group !== "Без группы" && flag) {
        var groupId = groupsId.get(group);

        postId = await communityConnection.CreatePost(groupId, name, descr, time, image, lastAddId, tagsId);
    }
    else if (flag) {
        postId = await postConnection.CreatePost(name, descr, time, image, lastAddId, tagsId);
    }

    if (postId) {
        window.location.href = "";
    }
});
