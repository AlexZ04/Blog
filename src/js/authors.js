import * as authorsConnection from "./connection/authorConnection.js";
import { GENDERS } from "./constants.js";

const authors = await authorsConnection.GetAuthorList();
const authorCont = document.querySelector(".authors-elements-cont");

var authorsSort = Object.assign([], authors);
authorsSort.sort(compareRating);

var firstPlace = [];
var secondPlace = [];
var thirdPlace = [];
var currentPlace = 1;
var prevElem;

authorsSort.forEach(element => {
    if (authorsSort[0] !== element) {
        if (compareRating(element, prevElem) > 0) {
            currentPlace++;
        }
    }

    switch (currentPlace) {
        case 1:
            firstPlace.push(element);
            break;
        case 2:
            secondPlace.push(element);
            break;
        case 3:
            thirdPlace.push(element);
            break
        
        default:
            return;
    }

    prevElem = element;
});

authors.forEach(element => {
    var author = document.createElement('div');
    author.classList.add('author');

    author.innerHTML = `<div class="author-left-part">
                    <div class="image ${element.gender === GENDERS.MALE ? 'male-image' : 'female-image'}">
                        
                    </div>

                    <div class="author-info-cont">
                        <div class="author-main-info">
                            <a class="author-name">${element.fullName}</a>
                            <a class="author-create-time">Создан: ${getDateString(element.created)}</a>
                        </div>
    
                        <div class="author-secondary-info">
                            <a class="author-birth-text">Дата рождения:</a>
                            <a class="author-birth-date">${getDateString(element.birthDate)}</a>
                        </div>
                    </div>
                    
                </div>

                <div class="author-right-part">
                    <a class="author-posts blue">Постов: ${element.posts}</a>
                    <a class="author-likes blue">Лайков: ${element.likes}</a>
                </div>`;
    
    if (firstPlace.includes(element) || secondPlace.includes(element) || thirdPlace.includes(element)) {
        var crown = document.createElement('div');
        
        if (firstPlace.includes(element)) crown.classList.add('author-first');
        else if (secondPlace.includes(element)) crown.classList.add('author-second');
        else crown.classList.add('author-third');

        author.querySelector('.image').appendChild(crown);
    }
    
    authorCont.appendChild(author);
});

function getDateString(inpDate) {
    if (inpDate == null) return "-";

    var date = inpDate.split('T')[0];
    var year = date.split('-')[0];
    var month = date.split('-')[1];
    var day = date.split('-')[2];

    return day + "." + month + "." + year;
}

function compareRating(first, second) {
    if (first.posts >= second.first) {
        return -1;
    }
    else if (first.posts < second.posts) {
        return 1;
    }
    else if (first.likes > second.likes) {
        return -1;
    }
    else if (first.likes < second.likes) {
        return 1;
    }

    return 0;
}