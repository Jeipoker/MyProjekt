document.addEventListener('DOMContentLoaded', function () {
    // Підсвічування кнопок
    // const navButtons = document.querySelectorAll('.pages a, .menu_content a:not(.account_LoginRegister)');
    // const sections = {
    //     'Home': document.querySelector('.container'),
    //     'AboutUs': document.querySelector('#about-us'),
    //     'Contact': document.querySelector('.footer')
    // };

    // function removeActiveClass() {
    //     navButtons.forEach(button => button.classList.remove('active'));
    // }

    // function setActiveButton(sectionId) {
    //     removeActiveClass();
    //     const buttons = document.querySelectorAll(`.btn_text_${sectionId}, .btn_text_${sectionId}2`);
    //     buttons.forEach(button => button.classList.add('active'));
    // }

    // function checkVisibleSection() {
    //     let currentSectionId = null;
    //     let maxVisibleHeight = 0;

    //     Object.entries(sections).forEach(([sectionId, section]) => {
    //         if (!section) return;
    //         const rect = section.getBoundingClientRect();
    //         const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

    //         if (visibleHeight > maxVisibleHeight && visibleHeight > 0) {
    //             maxVisibleHeight = visibleHeight;
    //             currentSectionId = sectionId;
    //         }
    //     });

    //     if (currentSectionId) {
    //         setActiveButton(currentSectionId);
    //     } else {
    //         setActiveButton('Home');
    //     }
    // }

    // const handleNavClick = (sectionId, selector) => {
    //     return function (event) {
    //         event.preventDefault();
    //         setActiveButton(sectionId);
    //         document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
    //     };
    // };

    // document.querySelector('.btn_text_Home')?.addEventListener('click', handleNavClick('Home', '.container'));
    // document.querySelector('.btn_text_Home2')?.addEventListener('click', handleNavClick('Home', '.container'));
    // document.querySelector('.btn_text_AboutUs')?.addEventListener('click', handleNavClick('AboutUs', '#about-us'));
    // document.querySelector('.btn_text_AboutUs2')?.addEventListener('click', handleNavClick('AboutUs', '#about-us'));
    // document.querySelector('.btn_text_Contact')?.addEventListener('click', handleNavClick('Contact', '.footer'));
    // document.querySelector('.btn_text_Contact2')?.addEventListener('click', handleNavClick('Contact', '.footer'));

    // window.addEventListener('scroll', checkVisibleSection);
    // checkVisibleSection();

    const navButtons = document.querySelectorAll('.pages a, .menu_content a:not(.account_LoginRegister)');

    const currentPage = window.location.pathname.includes('Shop.php') ? 'Shop' : 'Home';

    // Секції для прокручування на index.php
    const sections = {
        'Home': document.querySelector('.container'),
        'AboutUs': document.querySelector('#about-us'),
        'Contact': document.querySelector('.footer')
    };

    function removeActiveClass() {
        navButtons.forEach(button => button.classList.remove('active'));
    }

    function setActiveButton(sectionId) {
        removeActiveClass();
        const buttons = document.querySelectorAll(`.btn_text_${sectionId}, .btn_text_${sectionId}2`);
        buttons.forEach(button => button.classList.add('active'));
    }

    if (currentPage === 'Shop') {
        setActiveButton('Shop');
    } else {
        function checkVisibleSection() {
            let currentSectionId = null;
            let maxVisibleHeight = 0;

            Object.entries(sections).forEach(([sectionId, section]) => {
                if (!section) return;
                const rect = section.getBoundingClientRect();
                const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

                if (visibleHeight > maxVisibleHeight && visibleHeight > 0) {
                    maxVisibleHeight = visibleHeight;
                    currentSectionId = sectionId;
                }
            });

            if (currentSectionId) {
                setActiveButton(currentSectionId);
            } else {
                setActiveButton('Home');
            }
        }

        window.addEventListener('scroll', checkVisibleSection);
        checkVisibleSection();
    }

    const handleNavClick = (sectionId, selector) => {
        return function (event) {
            event.preventDefault();
            setActiveButton(sectionId);
            if (currentPage === 'Home' && selector) {
                document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth' });
            } else {
                if (['Home', 'AboutUs', 'Contact'].includes(sectionId)) {
                    window.location.href = `index.php${sectionId === 'AboutUs' ? '#about-us' : sectionId === 'Contact' ? '#footer' : ''}`;
                }
            }
        };
    };

    const handleShopClick = () => {
        return function (event) {
            event.preventDefault();
            setActiveButton('Shop');
            window.location.href = 'Shop.php';
        };
    };

    document.querySelector('.btn_text_Home')?.addEventListener('click', handleNavClick('Home', '.container'));
    document.querySelector('.btn_text_Home2')?.addEventListener('click', handleNavClick('Home', '.container'));
    document.querySelector('.btn_text_AboutUs')?.addEventListener('click', handleNavClick('AboutUs', '#about-us'));
    document.querySelector('.btn_text_AboutUs2')?.addEventListener('click', handleNavClick('AboutUs', '#about-us'));
    document.querySelector('.btn_text_Contact')?.addEventListener('click', handleNavClick('Contact', '.footer'));
    document.querySelector('.btn_text_Contact2')?.addEventListener('click', handleNavClick('Contact', '.footer'));
    document.querySelector('.btn_text_Shop')?.addEventListener('click', handleShopClick());
    document.querySelector('.btn_text_Shop2')?.addEventListener('click', handleShopClick());

    // Пошук
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

    function scrollToFirstMatch(query) {
        if (!query) return;
        const root = document.body;
        const matchedElement = findTextInDOM(root, query);
        if (matchedElement) {
            matchedElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const originalHTML = matchedElement.innerHTML;
            matchedElement.innerHTML = originalHTML.replace(
                new RegExp(query, 'gi'),
                `<span style="background-color: yellow;">${query}</span>`
            );
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
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                const query = input.value.trim();
                if (query) {
                    scrollToFirstMatch(query);
                }
            });
        } else {
            console.error(`Елементи для ${formId} не знайдені:`, { input, form });
        }
    }

    initializeSearch('main-search-input', 'main-search-form');
    initializeSearch('small-search-input', 'small-search-form');

    window.addEventListener('resize', function () {
        const smallForm = document.getElementById('small-search-form');
        if (smallForm && window.getComputedStyle(smallForm).display !== 'none') {
            console.log('Малий пошук видимий');
        }
    });

    // Бургер-меню
    const menuButton = document.querySelector(".menu_button");
    const menuContent = document.querySelector(".menu_content");

    menuButton.addEventListener("click", function (event) {
        event.stopPropagation();
        menuContent.style.display = menuContent.style.display === "block" ? "none" : "block";
    });

    menuContent.addEventListener("click", function (event) {
        event.stopPropagation();
    });

    document.addEventListener("click", function (event) {
        if (!event.target.closest('.account_LoginRegister') && !event.target.closest('.modal')) {
            menuContent.style.display = "none";
        }
    });

    const container = document.querySelector('.container');

    // Показ модального вікна вибору (для .account_LoginRegister)
    document.querySelector('.account_LoginRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Login/Register clicked');
        showModal('profileModal');
        updateProfileContent();
    });

    // Показ модального вікна входу
    document.getElementById('loginButton')?.addEventListener('click', () => {
        console.log('Login button clicked');
        showModal('loginModal', 'profileModal');
    });

    // Показ модального вікна реєстрації
    document.getElementById('registerButton')?.addEventListener('click', () => {
        console.log('Register button clicked');
        showModal('registerModal', 'profileModal');
    });

    // Показ модального вікна профілю (для #openProfileModal)
    const profileButton = document.getElementById('openProfileModal');
    if (profileButton) {
        profileButton.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Profile button clicked');
            showModal('profileModal');
            updateProfileContent();
        });
    }

    // НОВИЙ ОБРОБНИК: Додано для .account_MyAccount для відкриття профілю
    document.querySelector('.account_MyAccount')?.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('My Account clicked');
        showModal('profileModal');
        updateProfileContent();
    });

    // Закриття модальних вікон через хрестик
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const modalId = btn.getAttribute('data-modal-id');
            console.log('Close button clicked for modal:', modalId);
            closeModal(modalId);
        });
    });

    // Закриття при кліку поза модальним вікном
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            console.log('Window click outside modal, target:', e.target.id);
            closeModal(e.target.id);
        }
    });

    // Універсальна функція для показу модального вікна
    function showModal(modalId, hideModalId = null) {
        console.log(`Opening modal: ${modalId}`);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            container.classList.add('blur');
            if (hideModalId) {
                const hideModal = document.getElementById(hideModalId);
                if (hideModal) hideModal.style.display = 'none';
            }
        } else {
            console.error(`Modal ${modalId} not found`);
        }
    }

    // Універсальна функція для закриття модального вікна
    function closeModal(modalId) {
        console.log(`Closing modal: ${modalId}`);
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            const anyModalOpen = document.querySelector('.modal[style="display: flex;"]');
            if (!anyModalOpen) {
                container.classList.remove('blur');
            }
        } else {
            console.error(`Modal ${modalId} not found`);
        }
    }

    // Функція для оновлення вмісту #profileContent
    function updateProfileContent() {
        const profileContent = document.getElementById('profileContent');
        if (profileContent) {
            if (window.loggedInUser) {
                profileContent.innerHTML = `
                    <h2>Welcome, ${window.loggedInUser.name || 'User'}!</h2>
                    <p>Email: ${window.loggedInUser.email}</p>
                `;
            } else {
                profileContent.innerHTML = `
                    <h2>Select an action</h2>
                    <button id="profileLoginButton">Sign in</button>
                    <button id="profileRegisterButton">Register</button>
                `;
                document.getElementById('profileLoginButton')?.addEventListener('click', () => {
                    console.log('Profile login button clicked');
                    showModal('loginModal', 'profileModal');
                });
                document.getElementById('profileRegisterButton')?.addEventListener('click', () => {
                    console.log('Profile register button clicked');
                    showModal('registerModal', 'profileModal');
                });
            }
        } else {
            console.error('Profile content not found');
        }
    }
});