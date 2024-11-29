export function getPostCode(data) {
    var res = `<div class="post-main-info">
                        <a>${data.author} · ${formatToPostTime(data.createTime)} ${data.communityName === null ? "" : 'в сообществе "' + data.communityName + '"'}</a>
                        <h3 class="post-header" data-index="${data.id}">${data.title}</h3>
                        <hr>
                    </div>`

    if (data.image != null) {
        res += 
        `<div class="post-image">
            <img src="${data.image}" alt="Картинка к посту">
        </div>`
    }
    
    res += `<div class="post-text">
                        <a>${data.description}</a>
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

    return res;
}

function formatToPostTime(time) {
    let day = time.split("T")[0].split("-")[2];
    let month = time.split("-")[1];
    let year = time.split("-")[0];

    let postTime = time.split("T")[1].split(".")[0];

    let resTime = postTime.split(":")[0] + ":" + postTime.split(":")[1];

    return day + "." + month + "." + year + " " + resTime;
}

