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

var postTemplate = await getTemplate('post_template'), 
    postImageTemplate = await getTemplate('post_image_template'),
    postTagsTemplate = await getTemplate('tag_template');

async function getTemplate(id) {
    var template;

    await fetch('src/components/postTemplate.html')
    .then(response => response.text())
    .then(data => {
        let temp = document.createElement('div');

        temp.innerHTML = data;

        const templateTemp = temp.querySelector(`#${id}`);

        template = templateTemp;
    });

    return template;
}

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
    var post = postTemplate.content.cloneNode(true);
    post.querySelector('.post').dataset.index = data.id;

    let postHeader = post.querySelector('.post-header');
    post.querySelector('.post-header').textContent = data.title;
    post.querySelector('.post-header').dataset.index = data.id;

    post.querySelector('.post-main-info-text').textContent = `${data.author} · ${formatToPostTime(data.createTime)} 
    ${data.communityName === null ? "" : 'в сообществе "' + data.communityName + '"'}`;

    post.querySelector('.collapse').textContent = data.description;
    post.querySelector('.post-time').textContent = `Время чтения: ${data.readingTime} мин`;

    post.querySelector('.post-comments').querySelector('a').textContent = data.commentsCount;
    post.querySelector('.post-likes-amount').textContent = data.likes;

    post.querySelector('.like-btn').classList.add(data.hasLike ? 'liked' : 'no-liked');
    post.querySelector('.like-btn').dataset.index = data.id;

    if (data.image != null) {
        let image = postImageTemplate.content.cloneNode(true).querySelector('.post-image');
        image.querySelector('img').src = data.image;
        post.querySelector('.post').insertBefore(image, post.querySelector('.post-text'));
    }

    var postTags = post.querySelector('.post-tags');

    data.tags.forEach(element => {
        let postTag = postTagsTemplate.content.cloneNode(true);
        
        let postTagText = postTag.querySelector('a');

        postTagText.textContent = '#' + element.name;
        postTagText.dataset.tagIndex = element.id;

        postTags.appendChild(postTag)
    });

    postHeader.addEventListener('click', () => {
        localStorage.setItem('post_info_id', postHeader.getAttribute("data-index"));
        localStorage.setItem('scroll_to_comments', 0);
        window.location.href = "/src/blogPost/postInfo.html";
    });

    var comment = post.querySelector('.comment');
    comment.addEventListener('click', () => {
        localStorage.setItem('post_info_id', comment.getAttribute("data-index"));
        localStorage.setItem('scroll_to_comments', 1);
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

function formatToPostTime(time) {
    let day = time.split("T")[0].split("-")[2];
    let month = time.split("-")[1];
    let year = time.split("-")[0];

    let postTime = time.split("T")[1].split(".")[0];

    let resTime = postTime.split(":")[0] + ":" + postTime.split(":")[1];

    return day + "." + month + "." + year + " " + resTime;
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
