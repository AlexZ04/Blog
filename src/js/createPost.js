import * as addressConnection from "./connection/addressConnection.js";

$(document).ready(function() {
    $('.select2').select2();
});

const addressSelectionContainer = document.querySelector('.address');

const adressSelectionTemplate = document.getElementById('adress_selection_template');

setSelect();

async function setSelect(parentId, query) {
    var addressInfo = await addressConnection.SearchAdress(parentId, query);

    var newSelect = adressSelectionTemplate.content.cloneNode(true);

    var selectHeader = newSelect.querySelector('p');

    var selectField = newSelect.querySelector('.select2');

    var addMap = new Map();

    addressInfo.forEach(element => {
        if (!addMap.get(element.objectLevelText)) addMap.set(element.objectLevelText, []);

        addMap.get(element.objectLevelText).push(element);
    });

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

        if (Array.from(addressSelectionContainer.children).length > 2 || 
            addressSelectionContainer.firstElementChild.nextElementSibling.querySelector('select').value != "-")

            setSelect(selectField.options[selectField.selectedIndex].dataset.index);

        selectHeader.textContent = selectField.options[selectField.selectedIndex].dataset.objectLevel;

        if (selectField.value === "-") selectHeader.textContent = 'Следующий элемент адреса';
    }

    addressSelectionContainer.appendChild(newSelect);

    $('.select2').select2();
}
