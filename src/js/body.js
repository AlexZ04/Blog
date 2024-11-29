import * as tagConnection from "./connection/tagConnection.js";
import * as postConnection from "./connection/postConnection.js";
import { checkToken } from "./tokenCheck.js";
import { FILTER_SORTING, RESULTS } from "./constants.js";

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

    bodyContainer.querySelector('.blue').addEventListener('click', () => {
        window.location.href = "/src/blogPost/createPost.html";
    });
}

applyFiltersBtn.addEventListener('click', async () => {
    setAllPosts(true);
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

    var res = await postConnection.GetPostsList(tagsId, author.value, timeStart.value, timeEnd.value, sortValue, onlyMine, 1, size.value);

    return res;
}

async function setOnePost(data) {
    var post = document.createElement('div');
    post.classList.add('post');
    post.dataset.index = data.id;

    post.innerHTML = `<div class="post-main-info">
                        <a>${data.author} · ${formatToPostTime(data.createTime)} ${data.communityName === null ? "" : 'в сообществе "' + data.communityName + '"'}</a>
                        <h3 class="post-header" data-index="${data.id}">${data.title}</h3>
                        <hr>
                    </div>`

    if (data.image != null) {
        post.innerHTML += 
        `<div class="post-image">
            <img src="${data.image}" alt="Картинка к посту">
        </div>`
    }
    
    post.innerHTML += `<div class="post-text">
                        <a class="collapse">${data.description}</a>
                    </div>

                    <div class="post-tags">
                    </div>

                    <a class="post-time">Время чтения: ${data.readingTime} мин</a>

                    <div class="post-info">
                        <div class="post-comments">
                            <a>${data.commentsCount}</a>
                            <div class="post-info-icon comment" data-index="${data.id}"></div>
                        </div>
                        
                        <div class="post-likes">
                            <a class="post-likes-amount">${data.likes}</a>
                            <div class="post-info-icon like-btn ${data.hasLike ? 'liked' : 'no-liked'}" data-index="${data.id}"></div>
                        </div>
                    </div>`;
    
    var postTags = post.querySelector('.post-tags');

    data.tags.forEach(element => {
        postTags.innerHTML += `<a data-tagIndex="${element.id}">#${element.name}</a>`;
    });

    var postHeader = post.querySelector('.post-header');
    postHeader.addEventListener('click', () => {
        localStorage.setItem('post_info_id', postHeader.getAttribute("data-index"));
        window.location.href = "/src/blogPost/postInfo.html";
    });

    var comment = post.querySelector('.comment');
    comment.addEventListener('click', () => {
        localStorage.setItem('post_info_id', comment.getAttribute("data-index"));
        window.location.href = "/src/blogPost/postInfo.html";
    });

    var like = post.querySelector('.like-btn');
    var likesAmount = post.querySelector('.post-likes-amount');
    like.addEventListener('click', async () => {

        if (like.classList.contains('liked')) {
            if (await postConnection.DeleteLike(like.getAttribute("data-index")) === RESULTS.SUCCESS) {
                like.classList.remove('liked');
                like.classList.add('no-liked');
                likesAmount.text = Number(likesAmount.text) - 1;
            }
        }
        else {
            if (await postConnection.SetLike(like.getAttribute("data-index")) === RESULTS.SUCCESS) {
                like.classList.add('liked');
                like.classList.remove('no-liked');
                likesAmount.text = Number(likesAmount.text) + 1;
            }
        }
    });


    postsContainer.appendChild(post);
}

async function setAllPosts(getData) {
    postsContainer.innerHTML = "";

    var res;
    if (!getData) {
        res = await getPosts(false);
    }
    else {
        res = await getPosts(true);
    }

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

function formatToPostTime(time) {
    let day = time.split("T")[0].split("-")[2];
    let month = time.split("-")[1];
    let year = time.split("-")[0];

    let postTime = time.split("T")[1].split(".")[0];

    let resTime = postTime.split(":")[0] + ":" + postTime.split(":")[1];

    return day + "." + month + "." + year + " " + resTime;
}

await setAllPosts(false);

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
