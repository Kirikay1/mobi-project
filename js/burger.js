const burgerButton = document.querySelector(".burger__button");
const burgerMenu = document.querySelector(".burger__menu");
const burgerLinks = document.querySelector("#header__container-nav");
const burgerLinksItem = document.querySelector(".header__nav-items");


burgerButton.addEventListener('click', () => {
    document.body.style = "overflow: hidden";
    burgerLinks.style = "display: flex";
    burgerLinksItem.style = "flex-direction: column";
    burgerMenu.style = "left: 0%";
});

burgerMenu.addEventListener('click', () => {
    document.body.style = "overflow: visible";
    burgerMenu.style = "left: -100%";

});
