import * as postConnection from "./connection/postConnection.js";
import { RESULTS } from "./constants.js";
import { getTemplate, getPostTemplate } from "../templatesWork/postTemplate.js";

var postId = localStorage.getItem('post_info_id');

const postsContainer = document.querySelector('.blog-block');
const commentBlock = document.querySelector('.comment-block');

var postTemplate = await getTemplate('post_template'), 
    postImageTemplate = await getTemplate('post_image_template'),
    postTagsTemplate = await getTemplate('tag_template');

var postInfo = await postConnection.GetPostInfo(postId);
console.log(postInfo);

function setPostInfo(data) {
    var post = getPostTemplate(data, postTemplate, postImageTemplate, postTagsTemplate, false);
    
    postsContainer.appendChild(post);
}

setPostInfo(postInfo);

document.querySelector('.comment').addEventListener('click', () => {
    commentBlock.scrollIntoView({behavior: "smooth"});
});

if (localStorage.getItem('scroll_to_comments') == "1") {
    commentBlock.scrollIntoView({behavior: "smooth"});
}

