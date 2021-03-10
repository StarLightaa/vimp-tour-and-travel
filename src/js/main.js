$(function() {})

const menuBtn = document.querySelector('.js--menu-toogle');
const menu = document.querySelector('.menu');

menuBtn.addEventListener('click', function() {
    this.classList.toggle('menu-toggle--active');
    menu.classList.toggle('menu--active');
})

const swiper = new Swiper('.swiper-container', {
    // Navigation arrows
    navigation: {
      nextEl: '.reviews-arrow-next',
      prevEl: '.reviews-arrow-prev',
    },
});
