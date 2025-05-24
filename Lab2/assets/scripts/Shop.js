document.addEventListener('DOMContentLoaded', () => {

    console.log('Current pathname:', window.location.pathname);

    // Показ/приховування меню
    const menuButton = document.querySelector('.menu_button');
    const menuContent = document.querySelector('.menu_content');
    if (menuButton && menuContent) {
        menuButton.addEventListener('click', () => {
            menuContent.style.display = menuContent.style.display === 'block' ? 'none' : 'block';
        });
        document.addEventListener('click', (e) => {
            if (!menuContent.contains(e.target) && !menuButton.contains(e.target)) {
                menuContent.style.display = 'none';
            }
        });
    }

    // Підсвічування кнопок
    const navButtons = document.querySelectorAll('.pages a, .menu_content a:not(.account_LoginRegister)');

    function removeActiveClass() {
        navButtons.forEach(button => button.classList.remove('active'));
    }

    function setActiveButton(sectionId) {
        removeActiveClass();
        const buttons = document.querySelectorAll(`.btn_text_${sectionId}, .btn_text_${sectionId}2`);
        buttons.forEach(button => button.classList.add('active'));
    }

    setActiveButton('Shop');

    const handleNavClick = (sectionId, url, selector) => {
        return function (event) {
            event.preventDefault();
            console.log(`Clicked ${sectionId}, url: ${url}, selector: ${selector}`);
            setActiveButton(sectionId);
            if (sectionId === 'Contact') {
                console.log('Attempting to scroll to footer');
                const footer = document.querySelector(selector);
                if (footer) {
                    console.log('Footer found, scrolling');
                    footer.scrollIntoView({ behavior: 'smooth' });
                } else {
                    console.error('Footer not found with selector:', selector);
                    console.log('Redirecting to fallback URL:', url);
                    window.location.href = url;
                }
            } else {
                console.log(`Redirecting to ${url}`);
                window.location.href = url;
            }
        };
    };

    document.querySelector('.btn_text_Home')?.addEventListener('click', handleNavClick('Home', 'index.php', '.container'));
    document.querySelector('.btn_text_Home2')?.addEventListener('click', handleNavClick('Home', 'index.php', '.container'));
    document.querySelector('.btn_text_AboutUs')?.addEventListener('click', handleNavClick('AboutUs', 'index.php#about-us', '#about-us'));
    document.querySelector('.btn_text_AboutUs2')?.addEventListener('click', handleNavClick('AboutUs', 'index.php#about-us', '#about-us'));
    document.querySelector('.btn_text_Contact')?.addEventListener('click', handleNavClick('Contact', 'index.php#footer', '#footer'));
    document.querySelector('.btn_text_Contact2')?.addEventListener('click', handleNavClick('Contact', 'index.php#footer', '#footer'));
    document.querySelector('.btn_text_Shop')?.addEventListener('click', handleNavClick('Shop', 'Shop.php', null));
    document.querySelector('.btn_text_Shop2')?.addEventListener('click', handleNavClick('Shop', 'Shop.php', null));

    document.querySelector('.account_LoginRegister')?.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Login/Register clicked');
        window.location.href = 'index.php';
    });
});