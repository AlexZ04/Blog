import * as postConnection from "./connection/postConnection.js";
import * as commentConnection from "./connection/commentConnection.js";
import * as addressConnection from "./connection/addressConnection.js";
import { getTemplate, getPostTemplate, formatToPostTime } from "../templatesWork/postTemplate.js";
import { checkToken } from "./tokenCheck.js";
import { sendToast } from "./sendToast.js";

var postId = localStorage.getItem('post_info_id');

const commentTextCreating = document.getElementById('comment_text_edit');

const postsContainer = document.querySelector('.blog-block');
const commentBlock = document.querySelector('.comment-block');

const postTemplate = await getTemplate('post_template'), 
    postImageTemplate = await getTemplate('post_image_template'),
    postTagsTemplate = await getTemplate('tag_template');

const mainCommentTemplate = document.getElementById('main_comment_template');
const childCommentTemplate = document.getElementById('child_comment_template');

var postInfo = await postConnection.GetPostInfo(postId);
var postAddress;

if (postInfo.addressId !== null) {
    var postAddress = await addressConnection.GetChain(postInfo.addressId);
}

function setPostInfo(data) {
    var post = getPostTemplate(data, postTemplate, postImageTemplate, postTagsTemplate, false, postAddress);
    
    postsContainer.appendChild(post);
}

function setComments(comments) {
    var header = document.createElement('h3');
    header.textContent = "Комментарии";
    commentBlock.innerHTML = "";
    commentBlock.appendChild(header);
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

    var commentsAmount = document.querySelector('.post-comments-amount');

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
    var commentEditBtn = comment.querySelector('.edit-comment-btn');
    commentEditBtn.dataset.id = commentInfo.id;
    comment.querySelector('.edit-icon').addEventListener('click', () => {

        if (commentTextBlock.classList.contains('hidden')) {
            commentTextBlock.classList.remove('hidden');
            commentEditField.classList.add('hidden');
        }
        else {
            commentTextBlock.classList.add('hidden');
            commentEditField.classList.remove('hidden');
            
            commentEditField.querySelector('input').value = commentInfo.content;
        }

        commentEditBtn.addEventListener('click', async () => {
            var newText = commentEditField.querySelector('input').value.trim();

            if (newText.length < 1 || newText.length > 1000) {
                sendToast("Недопустимая длина комментария!");
                return;
            }

            if (commentEditField.querySelector('input').value !== commentTextBlock.querySelector('p').textContent) {
                await commentConnection.EditComment(commentEditBtn.dataset.id, newText);
                commentTextBlock.querySelector('p').textContent = newText;

                const date = new Date();
                date.setHours(date.getHours() + 7);

                commentModDateField.value = formatToPostTime(date.toISOString());
            }

            commentTextBlock.classList.remove('hidden');
            commentEditField.classList.add('hidden');
        });
    });

    var trash = comment.querySelector('.delete-icon');
    trash.dataset.id = commentInfo.id;
    trash.addEventListener('click', async () => {
        await commentConnection.DeleteComment(trash.dataset.id);

        commentsAmount.textContent = Number(commentsAmount.textContent) - 1;

        var postInfo = await postConnection.GetPostInfo(postId);
        setComments(postInfo.comments);
    });
    
    var commentReplyField = comment.querySelector('.reply-block');
    var commentReplyBtn = commentReplyField.querySelector('.add-reply-to-main');
    commentReplyBtn.dataset.id = commentInfo.id;

    var commentReplyInputText = commentReplyField.querySelector('.reply-comment-input');

    comment.querySelector('.write-reply').addEventListener('click', () => {
        if (commentReplyField.classList.contains('hidden')) {
            commentReplyField.classList.remove('hidden');
        }
        else {
            commentReplyField.classList.add('hidden');
        }
        
        commentReplyBtn.addEventListener('click', async () => {
            var replyText = commentReplyInputText.value.trim();

            if (replyText.length < 1 || replyText.length > 1000) {
                sendToast("Недопустимая длина комментария!");
                return;
            }

            await commentConnection.AddReply(postId, replyText, commentReplyBtn.dataset.id);
            commentsAmount.textContent = Number(commentsAmount.textContent) + 1;

            var postInfo = await postConnection.GetPostInfo(postId);
            setComments(postInfo.comments);
        });

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

const sendCommetnBtn = document.getElementById('send_comment_btn');

sendCommetnBtn.addEventListener('click', async () => {
    var text = commentTextCreating.value.trim();

    if (text.length < 1 || text.length > 1000) {
        sendToast("Недопустимая длина комментария!");
        return;
    }

    await commentConnection.AddReply(postId, text);
    commentTextCreating.value = "";

    document.querySelector('.post-comments-amount').textContent = Number(document.querySelector('.post-comments-amount').textContent) + 1;

    var postInfo = await postConnection.GetPostInfo(postId);
    setComments(postInfo.comments);
});
