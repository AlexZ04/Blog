import * as tagConnection from "./connection/tagConnection.js";
import * as postConnection from "./connection/postConnection.js";
import { checkToken } from "./tokenCheck.js";

const applyOnlyMineFilter = document.getElementById('apply_only_mine_filter');
const applyFiltersBtn = document.getElementById('apply_filters_btn');

const bodyContainer = document.querySelector('.body-elem-container');

var onlyMine = false;

applyOnlyMineFilter.addEventListener('click', () => {
    if (applyOnlyMineFilter.classList.contains('blue')) {
        applyOnlyMineFilter.classList.remove('blue');
        onlyMine = false;
    }
    else {
        applyOnlyMineFilter.classList.add('blue');
        onlyMine = true;
    }
});

const select = document.querySelector('.tag-select');

var tagList = await tagConnection.GetTagList();

tagList.forEach(element => {
    var option = document.createElement('option');
    option.text = element.name;

    select.appendChild(option);
});

if (checkToken()) {
    const writePost = document.createElement('div');
    writePost.classList.add('write-post-cont');

    writePost.innerHTML = `<button class="blue" id="write_post">Написать пост</button>`;
    bodyContainer.appendChild(writePost);
}

// getPosts(false);

applyFiltersBtn.addEventListener('click', () => {
    getPosts(true);
});


async function getPosts(getData) {
    if (!getData) {
        var res = await postConnection.GetPostsList();

        console.log(res);
    }

}

checkToken();