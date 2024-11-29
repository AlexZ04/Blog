import * as tagConnection from "./connection/tagConnection.js";
import * as postConnection from "./connection/postConnection.js";
import { checkToken } from "./tokenCheck.js";
import { FILTER_SORTING } from "./constants.js";

const applyOnlyMineFilter = document.getElementById('apply_only_mine_filter');
const applyFiltersBtn = document.getElementById('apply_filters_btn');

const bodyContainer = document.querySelector('.body-elem-container');

const author = document.getElementById('authors_name_filter');
const timeStart = document.getElementById('time_start_filter');
const timeEnd = document.getElementById('time_end_filter');
const sort = document.getElementById('sort_filter');
const tags = document.getElementById('tags_filter');

var onlyMine = false;

var tagsMap = new Map();

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

    tagsMap.set(element.name, element.id);

    select.appendChild(option);
});

if (checkToken()) {
    const writePost = document.createElement('div');
    writePost.classList.add('write-post-cont');

    writePost.innerHTML = `<button class="blue" id="write_post">Написать пост</button>`;
    bodyContainer.insertAdjacentElement('afterbegin', writePost);
}

console.log(await getPosts(false));

applyFiltersBtn.addEventListener('click', async () => {
    console.log(await getPosts(true));
});


async function getPosts(getData) {
    if (!getData) {
        var res = await postConnection.GetPostsList();

        return res;
    }

    let tagsId = [];
    [...tags.selectedOptions].map(opt => opt.value).forEach(element => {
        tagsId.push(tagsMap.get(element));
    });

    let sortValue;
    switch (sort.value) {
        case "По дате создания (сначала новые)":
            sortValue = FILTER_SORTING.CreateDesc;
            break;
        case "По дате создания (сначала старые)":
            sortValue = FILTER_SORTING.CreateAsc;
            break;
        case "По количеству лайков (по убыванию)":
            sortValue = FILTER_SORTING.LikeDesc;
            break;
        case "По дате создания (по возрастанию)":
            sortValue = FILTER_SORTING.LikeAsc;
            break;
        default:
            sortValue = false;
            break;
    }

    var res = await postConnection.GetPostsList(tagsId, author.value, timeStart.value, timeEnd.value, sortValue, onlyMine);

    return res;
}

checkToken();