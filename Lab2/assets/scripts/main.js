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
});