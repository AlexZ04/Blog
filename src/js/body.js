const applyOnlyMineFilter = document.getElementById('apply_only_mine_filter');

applyOnlyMineFilter.addEventListener('click', () => {
    if (applyOnlyMineFilter.classList.contains('blue')) {
        applyOnlyMineFilter.classList.remove('blue');
    }
    else {
        applyOnlyMineFilter.classList.add('blue');
    }
});