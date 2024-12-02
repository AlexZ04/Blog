import * as postConnection from "../js/connection/postConnection.js";
import { RESULTS } from "../js/constants.js";

export async function getTemplate(id) {
    var template;

    await fetch('/src/components/postTemplate.html')
    .then(response => response.text())
    .then(data => {
        let temp = document.createElement('div');

        temp.innerHTML = data;

        const templateTemp = temp.querySelector(`#${id}`);

        template = templateTemp;
    });

    return template;
}

export function getPostTemplate(data, postTemplate, postImageTemplate, postTagsTemplate, setRegirect = true) {

    var post = postTemplate.content.cloneNode(true);
    post.querySelector('.post').dataset.index = data.id;

    let postHeader = post.querySelector('.post-header');
    post.querySelector('.post-header').textContent = data.title;
    post.querySelector('.post-header').dataset.index = data.id;

    if (!setRegirect) postHeader.classList.add('not-clickable');

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

    if (setRegirect) {
        postHeader.addEventListener('click', () => {
            localStorage.setItem('post_info_id', postHeader.getAttribute("data-index"));
            localStorage.setItem('scroll_to_comments', 0);
            window.location.href = "/src/blogPost/postInfo.html";
        });
    }

    if (setRegirect) {
        var comment = post.querySelector('.comment');
        comment.dataset.index = data.id;
        comment.addEventListener('click', () => {
            localStorage.setItem('post_info_id', comment.getAttribute("data-index"));
            localStorage.setItem('scroll_to_comments', 1);
            window.location.href = "/src/blogPost/postInfo.html";
        });
    }

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

    return post;
}

function formatToPostTime(time) {
    let day = time.split("T")[0].split("-")[2];
    let month = time.split("-")[1];
    let year = time.split("-")[0];

    let postTime = time.split("T")[1].split(".")[0];

    let resTime = postTime.split(":")[0] + ":" + postTime.split(":")[1];

    return day + "." + month + "." + year + " " + resTime;
}
