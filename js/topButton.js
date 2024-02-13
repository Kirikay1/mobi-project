const topButton = document.querySelector(".galery__button-onTop");

window.onscroll = function  () {
    if (window.pageYOffset > 20) {
        topButton.style.opacity = '1'
        } else { topButton.style.opacity = '0' }
      }
      //
      topButton.onclick = function () {
          window.scrollTo(0,0)
}
