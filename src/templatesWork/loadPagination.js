import { setAllPosts } from "../js/mainPage.js";

export function loadPaginationBlock(block, currentPage, pagesCount) {
    block.innerHTML = "";

    if (pagesCount === 0) return;
    var left = document.createElement('button');
    var right = document.createElement('button');

    left.classList.add('left-pagination-btn');
    right.classList.add('right-pagination-btn');

    left.textContent = '⭠';
    right.textContent = '⭢';

    var pagBtns = new Set([1, currentPage - 1, currentPage, Number(currentPage) + 1, pagesCount]);

    if (currentPage === 1) pagBtns.add(currentPage + 2);

    var resBtns = [];

    pagBtns.forEach(element => {
        if (element > 0 && element <= pagesCount) {
            resBtns.push(element)
        }
    });

    resBtns.sort(function(a, b) {
        return a - b;
    });

    if (pagesCount > 1) block.appendChild(left);

    resBtns.forEach(element => {
        var pagBtn = document.createElement('button');
        pagBtn.classList.add('pagination-btn');
        if (currentPage === element) pagBtn.classList.add('active-page');
        pagBtn.textContent = element;

        block.appendChild(pagBtn);
    });
    
    if (pagesCount > 1) block.appendChild(right);

    var paginationBtns = document.querySelectorAll('.pagination-btn');

    paginationBtns.forEach(element => {
        element.addEventListener('click', () => {
            loadPaginationBlock(block, Number(element.textContent), pagesCount);
            setAllPosts();
        });  
        
    });

    left.addEventListener('click', () => {
        loadPaginationBlock(block, Math.max(1, currentPage - 1), pagesCount);
        setAllPosts();
    });

    right.addEventListener('click', () => {
        loadPaginationBlock(block, Math.min(pagesCount, currentPage + 1), pagesCount);
        setAllPosts();
    });
}
