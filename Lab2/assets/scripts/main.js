// перенесення по кнопках
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.btn_text_AboutUs').addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('#about-us').scrollIntoView({ behavior: 'smooth' });
    });
    document.querySelector('.btn_text_AboutUs2').addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('#about-us').scrollIntoView({ behavior: 'smooth' });
    });
    document.querySelector('.btn_text_Home').addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
    });
    document.querySelector('.btn_text_Home2').addEventListener('click', function(event) {
        event.preventDefault();
        document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
    });

    // пошук
    // рекурсивний пошук
    function findTextInDOM(node, query) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.toLowerCase();
            if (text.includes(query.toLowerCase())) {
                return node.parentElement;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (const child of node.childNodes) {
                const match = findTextInDOM(child, query);
                if (match) return match;
            }
        }
        return null;
    }
    // прокрутка до першого збігу
    function scrollToFirstMatch(query) {
        if (!query) return;
        const root = document.body;
        const matchedElement= findTextInDOM(root, query);
        if (matchedElement) {
            matchedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const originalHTML = matchedElement.innerHTML;
            matchedElement.innerHTML = originalHTML.replace(
                new RegExp(query, 'gi'),
                `<span style="background-color: yellow;">${query}</span>`
            );
            // зникнення підсвітки
            setTimeout(() => {
                matchedElement.innerHTML = originalHTML;
            }, 6000);
        } else {
            console.log('Збігів не знайдено');
        }
    }
    function initializeSearch(inputId, formId) {
        const input = document.getElementById(inputId);
        const form = document.getElementById(formId);
    
        if (input && form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                const query = input.value.trim();
                console.log(`Submit для ${formId}:`, query); // Діагностика
                if (query) {
                    scrollToFirstMatch(query);
                }
            });
    
            input.addEventListener('input', function() {
                const query = this.value.trim();
                console.log(`Введено в ${inputId}:`, query); // Діагностика
            });
        } else {
            console.error(`Елементи для ${formId} не знайдені:`, { input, form });
        }
    }
    initializeSearch('main-search-input', 'main-search-form');

    // Ініціалізація малого пошуку
    initializeSearch('small-search-input', 'small-search-form');

    // Перевірка при зміні розміру вікна
    window.addEventListener('resize', function() {
        const smallForm = document.getElementById('small-search-form');
        if (smallForm && window.getComputedStyle(smallForm).display !== 'none') {
            console.log('Малий пошук видимий');
        }
    });
});

// Для відкритя, закриття бургер меню при натисканні
document.addEventListener("DOMContentLoaded", function () {
    const menuButton = document.querySelector(".menu_button");
    const menuContent = document.querySelector(".menu_content");

    // Клік по кнопці меню, перевірка чи вмикати чи вимикати меню
    menuButton.addEventListener("click", function (event) {
        event.stopPropagation(); // щоб не спрацював document.click
        menuContent.style.display = menuContent.style.display === "block" ? "none" : "block";
    });

    // Клік в самому меню, меню не закривати
    menuContent.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    // Коли клік по будь-якій іншій частині сторінки, закривається меню
    document.addEventListener("click", function () {
        menuContent.style.display = "none";
    });
});