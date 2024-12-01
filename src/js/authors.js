import * as authorsConnection from "./connection/authorConnection.js";
import { GENDERS } from "./constants.js";

const authors = await authorsConnection.GetAuthorList();
const authorCont = document.querySelector(".authors-elements-cont");
const authorTemplate = document.getElementById('author_template');

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
    var author = getAuthorCode(element);
    
    authorCont.appendChild(author);
});

function getAuthorCode(element) {
    var author = authorTemplate.content.cloneNode(true);
    author.querySelector('.image').classList.add(element.gender === GENDERS.MALE ? 'male-image' : 'female-image');
    author.querySelector('.author-name').textContent = element.fullName;
    author.querySelector('.author-create-time').textContent = getDateString(element.created);
    author.querySelector('.author-birth-date').textContent = getDateString(element.birthDate);
    author.querySelector('.author-posts').textContent = `Постов: ${element.posts}`;
    author.querySelector('.author-likes').textContent = `Лайков: ${element.likes}`;
    
    if (firstPlace.includes(element) || secondPlace.includes(element) || thirdPlace.includes(element)) {
        var crown = document.createElement('div');
        
        if (firstPlace.includes(element)) crown.classList.add('author-first');
        else if (secondPlace.includes(element)) crown.classList.add('author-second');
        else crown.classList.add('author-third');

        author.querySelector('.image').appendChild(crown);
    }

    return author;
}

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