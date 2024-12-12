import * as tagConnection from "./connection/tagConnection.js";
import * as postConnection from "./connection/postConnection.js";
import { checkToken } from "./tokenCheck.js";
import { FILTER_SORTING } from "./constants.js";
import { getTemplate, getPostTemplate } from "../templatesWork/postTemplate.js";
import { TAG_MAP } from "./connection/tagConnection.js";
import { sendToast } from "./sendToast.js";
import { UNAUTHORIZE_ERROR } from "./constants.js";
import { delay } from "./delay.js";
import { loadPaginationBlock } from "../templatesWork/loadPagination.js";

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

var pagesCount = 0;
var oldSizeValue = 5;

checkURL();

applyOnlyMineFilter.addEventListener('click', () => {
    if (!checkToken()) {
        sendToast(UNAUTHORIZE_ERROR);
        applyOnlyMineFilter.classList.add('anim');
        delay(500).then(() => applyOnlyMineFilter.classList.remove('anim'));
        return;
    }

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

TAG_MAP.keys().forEach(element => {
    var option = document.createElement('option');
    option.text = element;

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
    setAllPosts();
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
        tagsId.push(TAG_MAP.get(element));
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

    var currentPage = 1;
    if (document.querySelector('.active-page')) currentPage = document.querySelector('.active-page').textContent;
    
    var res = await postConnection.GetPostsList(tagsId, author.value, timeStart.value, timeEnd.value, sortValue, onlyMine, currentPage, size.value);

    return res;
}

async function setOnePost(data) {
    var post = getPostTemplate(data, postTemplate, postImageTemplate, postTagsTemplate);

    postsContainer.appendChild(post);
}

export async function setAllPosts() {
    applyFiltersBtn.scrollIntoView( { behavior: 'smooth'} );
    postsContainer.innerHTML = "";

    var res = await getPosts();
    var pag = await res.pagination;
    pagesCount = await pag.count;

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

await setAllPosts();

size.onchange = async function() {
    var currentPage = Math.ceil(Number(document.querySelector('.active-page').textContent) * oldSizeValue * 1.0 / size.value);
    loadPaginationBlock(paginationBtnsBlock, currentPage, pagesCount, setAllPosts);
    oldSizeValue = size.value;
    await setAllPosts();
    loadPaginationBlock(paginationBtnsBlock, currentPage, pagesCount, setAllPosts);
    size.scrollIntoView({behavior: "smooth"});
};

$('.collapse').collapser({
    mode: 'lines',
    truncate: 5,
    showText: 'Читать полностью',
    speed: 'fast',

    lockHide: true,
});

const paginationBtnsBlock = document.querySelector('.page-num-select');

loadPaginationBlock(paginationBtnsBlock, 1, pagesCount, setAllPosts);
