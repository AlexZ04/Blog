import * as tagConnection from "./connection/tagConnection.js";
import * as postConnection from "./connection/postConnection.js";
import { checkToken } from "./tokenCheck.js";
import { FILTER_SORTING } from "./constants.js";
import { getTemplate, getPostTemplate } from "../templatesWork/postTemplate.js";


const applyOnlyMineFilter = document.getElementById('apply_only_mine_filter');
const applyFiltersBtn = document.getElementById('apply_filters_btn');

const bodyContainer = document.querySelector('.body-elem-container');
const postsContainer = document.querySelector('.blog-block');

const author = document.getElementById('authors_name_filter');
const timeStart = document.getElementById('time_start_filter');
const timeEnd = document.getElementById('time_end_filter');
const sort = document.getElementById('sort_filter');
const tags = document.getElementById('tags_filter');
const size = document.getElementById('size-filter');

const postTemplate = await getTemplate('post_template'), 
    postImageTemplate = await getTemplate('post_image_template'),
    postTagsTemplate = await getTemplate('tag_template');

var onlyMine = false;

var tagsMap = new Map();

checkURL();

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
    const writePostTemplate = document.getElementById('write_post_template').content.cloneNode(true);

    bodyContainer.insertBefore(writePostTemplate, bodyContainer.firstChild);
    
    document.getElementById('write_post').addEventListener('click', () => {
        window.location.href = "/src/blogPost/createPost.html";
    });
}

applyFiltersBtn.addEventListener('click', async () => {
    setAllPosts(true);
});

function checkURL() {
    let params = new URLSearchParams(document.location.search);

    if (params.get('author')) {
        author.value = params.get('author');
    }

}

async function getPosts() {
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
        case "По количеству лайков (по возрастанию)":
            sortValue = FILTER_SORTING.LikeAsc;
            break;
        default:
            sortValue = false;
            break;
    }

    var res = await postConnection.GetPostsList(tagsId, author.value, timeStart.value, timeEnd.value, sortValue, onlyMine, 1, size.value);

    return res;
}

async function setOnePost(data) {
    var post = getPostTemplate(data, postTemplate, postImageTemplate, postTagsTemplate);

    postsContainer.appendChild(post);
}

async function setAllPosts(getData) {
    postsContainer.innerHTML = "";

    var res = await getPosts();

    res.posts.forEach(async element => {
        await setOnePost(element);
    });

    $('.collapse').collapser({
        mode: 'lines',
        truncate: 5,
        showText: 'Читать полностью',
        speed: 'fast',
    
        lockHide: true,
    });
    
}

await setAllPosts(true);

size.onchange = async function() {
    await setAllPosts(true);
};

$('.collapse').collapser({
    mode: 'lines',
    truncate: 5,
    showText: 'Читать полностью',
    speed: 'fast',

    lockHide: true,
});
