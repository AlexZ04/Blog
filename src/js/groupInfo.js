import * as communityConnection from "./connection/communityConnection.js";
import { GENDERS, FILTER_SORTING, ROLES } from "./constants.js";
import { TAG_MAP } from "./connection/tagConnection.js";
import { getTemplate, getPostTemplate } from "../templatesWork/postTemplate.js";
import { loadPaginationBlock } from "../templatesWork/loadPagination.js";

const groupMainInfoCont = document.querySelector('.group-main-info');
const blogBlockCont = document.querySelector('.blog-block');

const tagSelect = document.getElementById('tags_filter');
const sort = document.getElementById('sort_filter');

const sizeFilter = document.getElementById('size-filter');

var applyFiltersBtn = document.getElementById('apply_filters_btn_group');

const paginContainer = document.querySelector('.page-num-select');

const groupHeaderTemplate = document.getElementById('group_main_info_temp');
const groupPostTemplate = document.getElementById('group_post_temp');
const groupAdminTemplate = document.getElementById('group_admin_template');

const postTemplate = await getTemplate('post_template'), 
    postImageTemplate = await getTemplate('post_image_template'),
    postTagsTemplate = await getTemplate('tag_template');

var groupId = localStorage.getItem('group_id');
var oldSizeValue = 5;
var pagesCount = 0;

var communityInfo = await communityConnection.GetCommunityInfo(groupId);
var userRole = await communityConnection.GetGreatestRole(communityInfo.id);

await setHeader(communityInfo);

async function setHeader(info) {
    var groupHeader = groupHeaderTemplate.content.cloneNode(true);

    groupHeader.querySelector('.group-header').querySelector('h2').textContent = info.name;

    var subsAmountText = groupHeader.querySelector('.group-subs').querySelector('a')
    subsAmountText.textContent = info.subscribersCount + " подписчиков";

    let communityType = info.isClosed ? "закрытое" : "открытое";

    groupHeader.querySelector('.group-type').querySelector('a').textContent = `Тип сообщества: ${communityType}`;

    var groupAdminsCont = groupHeader.querySelector('.group-admins');

    info.administrators.forEach(element => {
        var admin = groupAdminTemplate.content.cloneNode(true);
        admin.querySelector('.admin-icon').classList.add(element.gender === GENDERS.MALE ? "male-image" : "female-image");
        admin.querySelector('a').textContent = element.fullName;

        groupAdminsCont.appendChild(admin);
    });

    var userRole = await communityConnection.GetGreatestRole(info.id);

    var subBtn = groupHeader.querySelector('.sub');
    var unsubBtn = groupHeader.querySelector('.unsub');
    var writePost = groupHeader.querySelector('.write-post');

    if (userRole === ROLES.Sub) {
        subBtn.classList.add('hidden');
        // writePost.classList.add('hidden');
    }
    else if (userRole === ROLES.Admin) {
        subBtn.classList.add('hidden');
        unsubBtn.classList.add('hidden');
    }
    else {
        unsubBtn.classList.add('hidden');
        writePost.classList.add('hidden');
    }

    writePost.addEventListener('click', () => {
        localStorage.setItem('create_post_group_name', info.name);
        window.location.href = "../blogPost/createPost.html";
    });

    subBtn.addEventListener('click', async () => {
        if (await communityConnection.Subscribe(info.id)) {
            subBtn.classList.add('hidden');
            unsubBtn.classList.remove('hidden');

            subsAmountText.textContent = Number(subsAmountText.textContent.split(" ")[0]) + 1 + " подписчиков";

            document.querySelector('.group-tags').classList.remove('hidden');
            document.querySelector('.blog-block').classList.remove('hidden');
            document.querySelector('.pagination-block').classList.remove('hidden');
        }
    });

    unsubBtn.addEventListener('click', async () => {
        if (await communityConnection.Unsubscribe(info.id)) {
            subBtn.classList.remove('hidden');
            unsubBtn.classList.add('hidden');

            subsAmountText.textContent = Number(subsAmountText.textContent.split(" ")[0]) - 1 + " подписчиков";

            document.querySelector('.group-tags').classList.add('hidden');
            document.querySelector('.blog-block').classList.add('hidden');
            document.querySelector('.pagination-block').classList.add('hidden');
        }
    });

    groupMainInfoCont.appendChild(groupHeader);
}

TAG_MAP.keys().forEach(element => {
    var option = document.createElement('option');
    option.text = element;

    tagSelect.appendChild(option);
});

if (!communityInfo.isClosed || userRole === ROLES.Sub || userRole === ROLES.Admin) {
    var postsInfo = await communityConnection.GetCommunityPosts(groupId);
    var posts = await postsInfo.posts;
    var pagination = await postsInfo.pagination;

    loadPaginationBlock(paginContainer, 1, pagination.count, setPosts);

    posts.forEach(element => {
        blogBlockCont.appendChild(getPostTemplate(element, postTemplate, postImageTemplate, postTagsTemplate));
    });
}
else {
    document.querySelector('.pagination-block').classList.add('hidden');
    document.querySelector('.group-tags').classList.add('hidden');
}

async function setPosts() {
    applyFiltersBtn.scrollIntoView( { behavior: 'smooth'} );

    let tagsId = [];
    [...tagSelect.selectedOptions].map(opt => opt.value).forEach(element => {
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
    // if (document.querySelector('.active-page')) currentPage = document.querySelector('.active-page').textContent;

    var postsInfo = await communityConnection.GetCommunityPosts(groupId, tagsId, sortValue, currentPage, sizeFilter.value);
    var posts = await postsInfo.posts;
    var pag = await postsInfo.pagination;
    pagesCount = await pag.count;

    blogBlockCont.innerHTML = "";

    posts.forEach(element => {
        blogBlockCont.appendChild(getPostTemplate(element, postTemplate, postImageTemplate, postTagsTemplate));
    });

    if (localStorage.getItem('start_from_first_page') === '1') {
        loadPaginationBlock(paginContainer, 1, pagesCount, setPosts);
        localStorage.setItem('start_from_first_page', '0');
    }
}

applyFiltersBtn.addEventListener('click', async () => {
    localStorage.setItem('start_from_first_page', '1');
    await setPosts();
});

sizeFilter.onchange = async function() {
    var currentPage = Math.ceil(Number(document.querySelector('.active-page').textContent) * oldSizeValue * 1.0 / sizeFilter.value);
    loadPaginationBlock(paginContainer, currentPage, pagesCount, setPosts);
    oldSizeValue = sizeFilter.value;
    await setPosts();
    loadPaginationBlock(paginContainer, currentPage, pagesCount, setPosts);
    sizeFilter.scrollIntoView({behavior: "smooth"});
};
