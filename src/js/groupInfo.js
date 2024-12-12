import * as communityConnection from "./connection/communityConnection.js";
import { GENDERS, FILTER_SORTING } from "./constants.js";
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

setHeader(communityInfo);

function setHeader(info) {
    var groupHeader = groupHeaderTemplate.content.cloneNode(true);

    groupHeader.querySelector('.group-header').querySelector('h2').textContent = info.name;
    groupHeader.querySelector('.group-subs').querySelector('a').textContent = info.subscribersCount + " подписчиков";

    let communityType = info.isClosed ? "закрытое" : "открытое";

    groupHeader.querySelector('.group-type').querySelector('a').textContent = `Тип сообщества: ${communityType}`;

    var groupAdminsCont = groupHeader.querySelector('.group-admins');

    info.administrators.forEach(element => {
        var admin = groupAdminTemplate.content.cloneNode(true);
        admin.querySelector('.admin-icon').classList.add(element.gender === GENDERS.MALE ? "male-image" : "female-image");
        admin.querySelector('a').textContent = element.fullName;

        groupAdminsCont.appendChild(admin);
    });

    groupMainInfoCont.appendChild(groupHeader);
}

TAG_MAP.keys().forEach(element => {
    var option = document.createElement('option');
    option.text = element;

    tagSelect.appendChild(option);
});

if (!communityInfo.isClosed) {
    var postsInfo = await communityConnection.GetCommunityPosts(groupId);
    var posts = await postsInfo.posts;
    var pagination = await postsInfo.pagination;

    loadPaginationBlock(paginContainer, 1, pagination.count, setPosts);

    posts.forEach(element => {
        blogBlockCont.appendChild(getPostTemplate(element, postTemplate, postImageTemplate, postTagsTemplate));
    });
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
    if (document.querySelector('.active-page')) currentPage = document.querySelector('.active-page').textContent;

    var postsInfo = await communityConnection.GetCommunityPosts(groupId, tagsId, sortValue, currentPage, sizeFilter.value);
    var posts = await postsInfo.posts;
    var pag = await postsInfo.pagination;
    pagesCount = await pag.count;

    blogBlockCont.innerHTML = "";

    posts.forEach(element => {
        blogBlockCont.appendChild(getPostTemplate(element, postTemplate, postImageTemplate, postTagsTemplate));
    });
}

applyFiltersBtn.addEventListener('click', () => {
    setPosts();
});

sizeFilter.onchange = async function() {
    var currentPage = Math.ceil(Number(document.querySelector('.active-page').textContent) * oldSizeValue * 1.0 / sizeFilter.value);
    loadPaginationBlock(paginContainer, currentPage, pagesCount, setPosts);
    oldSizeValue = sizeFilter.value;
    await setPosts();
    loadPaginationBlock(paginContainer, currentPage, pagesCount, setPosts);
    sizeFilter.scrollIntoView({behavior: "smooth"});
};
