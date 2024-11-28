import * as tagConnection from "./connection/tagConnection.js";

const applyOnlyMineFilter = document.getElementById('apply_only_mine_filter');

applyOnlyMineFilter.addEventListener('click', () => {
    if (applyOnlyMineFilter.classList.contains('blue')) {
        applyOnlyMineFilter.classList.remove('blue');
    }
    else {
        applyOnlyMineFilter.classList.add('blue');
    }
});

const select = document.querySelector('.tag-select');

var tagList = await tagConnection.GetTagList();
console.log(tagList);

tagList.forEach(element => {
    var option = document.createElement('option');
    option.text = element.name;

    select.appendChild(option);
});
