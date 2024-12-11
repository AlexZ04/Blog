import * as addressConnection from "./connection/addressConnection.js";
import * as communityConnection from "./connection/communityConnection.js";
import { TAG_MAP } from "./connection/tagConnection.js";
import { ROLES } from "./constants.js";

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
    
            groupsId.set(groupInfo.name, group.communityId);
        }
    });

}

await setCommunitites();

createPostBtn.addEventListener('click', () => {
    
});
