import * as authorsConnection from "./connection/authorConnection.js";

const authorsList = await authorsConnection.GetAuthorList();
const authorCont = document.querySelector(".authors-elements-cont");

for (var i = 0; i < 10; i++) {
    var author = document.createElement('div');
    author.classList.add('author');

    author.innerHTML = `<div class="author-left-part">
                    <div class="male-image">
                        
                        <div class="crown">
                            <div class="author-third"></div>
                        </div>
                        
                    </div>

                    <div class="author-info-cont">
                        <div class="author-main-info">
                            <a class="author-name">Пользователь</a>
                            <a class="author-create-time">Создан: 21.12.2022</a>
                        </div>
    
                        <div class="author-secondary-info">
                            <a class="author-birth-text">Дата рождения:</a>
                            <a class="author-birth-date">15.02.2024</a>
                        </div>
                    </div>
                    
                </div>

                <div class="author-right-part">
                    <a class="author-posts blue">Постов: 10</a>
                    <a class="author-likes blue">Лайков: 10</a>
                </div>`

    authorCont.appendChild(author);
}
