import * as postConnection from "./connection/postConnection.js";
import * as commentConnection from "./connection/commentConnection.js";
import { getTemplate, getPostTemplate, formatToPostTime } from "../templatesWork/postTemplate.js";
import { checkToken } from "./tokenCheck.js";

var postId = localStorage.getItem('post_info_id');

const postsContainer = document.querySelector('.blog-block');
const commentBlock = document.querySelector('.comment-block');

const postTemplate = await getTemplate('post_template'), 
    postImageTemplate = await getTemplate('post_image_template'),
    postTagsTemplate = await getTemplate('tag_template');

const mainCommentTemplate = document.getElementById('main_comment_template');
const childCommentTemplate = document.getElementById('child_comment_template');

var postInfo = await postConnection.GetPostInfo(postId);

function setPostInfo(data) {
    var post = getPostTemplate(data, postTemplate, postImageTemplate, postTagsTemplate, false);
    
    postsContainer.appendChild(post);
}

function setComments(comments) {
    comments.forEach(element => {
        setOneCommentTemplate(element);
    });
}

function setOneCommentTemplate(commentInfo) {
    var comment = mainCommentTemplate.content.cloneNode(true);

    if (commentInfo.subComments == 0 && commentInfo.deleteDate) return;

    setCommentInfo(comment, commentInfo);

    let commentReplyBlock = comment.querySelector('.comment-reply-block');

    if (commentInfo.subComments != 0) {
        commentReplyBlock.querySelector('.show-replies').classList.remove('hidden');
    }

    var replyBtn = comment.querySelector('.show-replies')
    var commentRepliesBlock = comment.querySelector('.child-comments-cont');

    replyBtn.addEventListener('click', async () => {
        replyBtn.classList.add('hidden');

        var repliesComments = await commentConnection.GetReplies(commentInfo.id);

        repliesComments.forEach(element => {
            let newReply = setOneReplyComment(element);

            if (newReply) commentRepliesBlock.appendChild(newReply);
        });
    })

    commentBlock.appendChild(comment);
}

function setOneReplyComment(reply) {
    var replyComment = childCommentTemplate.content.cloneNode(true);

    if (reply.subComments == 0 && reply.deleteDate) return;
    setCommentInfo(replyComment, reply);

    return replyComment;
}

function setCommentInfo(comment, commentInfo) {
    var commentTextBlock = comment.querySelector('.text-block');

    if (!commentInfo.deleteDate) {
        comment.querySelector('.comment-head').querySelector('a').textContent = commentInfo.author;
        commentTextBlock.querySelector('p').textContent = commentInfo.content;

        if (commentInfo.authorId != window.localStorage.getItem('user_id')) {
            comment.querySelector('.edit-icon').classList.add('hidden');
            comment.querySelector('.delete-icon').classList.add('hidden');
        }

    }
    else {
        if (commentInfo.subComments == 0) return;
        comment.querySelector('.comment-head').querySelector('a').textContent = '[Комментарий удалён]';
        commentTextBlock.querySelector('p').textContent = '[Комментарий удалён]';
        comment.querySelector('.write-reply').classList.add('hidden');

        comment.querySelector('.edit-icon').classList.add('hidden');
        comment.querySelector('.delete-icon').classList.add('hidden');
    }

    var commentModDateField = comment.querySelector('.mod-date');

    if (!commentInfo.modifiedDate || commentInfo.deleteDate) {
        commentTextBlock.querySelector('a').classList.add('hidden');  
        commentModDateField.classList.add('hidden');
    }
    else {
        commentModDateField.value = formatToPostTime(commentInfo.modifiedDate);

        commentTextBlock.querySelector('a').addEventListener('mouseover', () => {
            commentModDateField.classList.remove('hidden');
        });

        commentTextBlock.querySelector('a').addEventListener('mouseleave', () => {
            commentModDateField.classList.add('hidden');
        });
    }

    let commentReplyBlock = comment.querySelector('.comment-reply-block');

    commentReplyBlock.querySelector('a').textContent = formatToPostTime(commentInfo.createTime);

    if (!checkToken()) {
        commentReplyBlock.querySelector('.write-reply').classList.add('hidden');
    }
    
    var commentEditField = comment.querySelector('.edit-block');
    comment.querySelector('.edit-icon').addEventListener('click', () => {
        commentTextBlock.classList.add('hidden');
        commentEditField.classList.remove('hidden');
    });
    
    var commentReplyField = comment.querySelector('.reply-block');
    comment.querySelector('.write-reply').addEventListener('click', () => {
        commentReplyField.classList.remove('hidden');
    });
}

setPostInfo(postInfo);
setComments(postInfo.comments);

document.querySelector('.comment').addEventListener('click', () => {
    commentBlock.scrollIntoView({behavior: "smooth"});
});


if (localStorage.getItem('scroll_to_comments') == "1") {
    commentBlock.scrollIntoView({behavior: "smooth"});
    localStorage.setItem('scroll_to_comments', '0');
}
