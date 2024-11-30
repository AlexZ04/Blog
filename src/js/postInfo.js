import * as postConnection from "./connection/postConnection.js";
import { getPostCode } from '../components/posts.js';
import { RESULTS } from "./constants.js";

var postId = localStorage.getItem('post_info_id');

const bodyContainer = document.querySelector('.body-elem-container');
const postsContainer = document.querySelector('.blog-block');

var postInfo = await postConnection.GetPostInfo(postId);
console.log(postInfo);

function setPostInfo(data) {
    var post = document.createElement('div');
    post.classList.add('post');
    post.dataset.index = data.id;

    post.innerHTML = getPostCode(data);
    
    var postTags = post.querySelector('.post-tags');

    data.tags.forEach(element => {
        postTags.innerHTML += `<a data-tagIndex="${element.id}">#${element.name}</a>`;
    });

    var postHeader = post.querySelector('.post-header');
    postHeader.addEventListener('click', () => {
        localStorage.setItem('post_info_id', postHeader.getAttribute("data-index"));
        window.location.href = `/src/blogPost/postInfo.html`;
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

setPostInfo(postInfo);

function formatToPostTime(time) {
    let day = time.split("T")[0].split("-")[2];
    let month = time.split("-")[1];
    let year = time.split("-")[0];

    let postTime = time.split("T")[1].split(".")[0];

    let resTime = postTime.split(":")[0] + ":" + postTime.split(":")[1];

    return day + "." + month + "." + year + " " + resTime;
}
