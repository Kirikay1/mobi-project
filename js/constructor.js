const selectedItem = document.querySelectorAll('.constructor__card');
const title = document.querySelector('.constructor__card-title');


selectedItem.forEach((item, index) => {
    const itemId = index + 1;
    item.id = 'btn' + (itemId);
    item.addEventListener('click', () => {
        let text = item.firstElementChild;
        if (window.location.pathname === '/constructor.html') {
            localStorage.setItem('frame', text.textContent);
            window.location = "./brake.html";
        }
        if (window.location.pathname === '/brake.html') {
            localStorage.setItem('brake', text.textContent);
            window.location = "./color.html";
        }
        if (window.location.pathname === '/color.html') {
            localStorage.setItem('color', text.textContent);
            window.location = "./fender.html";
        }
        if (window.location.pathname === '/fender.html') {
            localStorage.setItem('fender', text.textContent);
            window.location = "./suspension.html";
        }
        if (window.location.pathname === '/suspension.html') {
            localStorage.setItem('suspension', text.textContent);
            window.location = "./wheels.html";
        }
        if (window.location.pathname === '/wheels.html') {
            localStorage.setItem('wheels', text.textContent);
            window.location = "./form.html";
        }

        console.log('text :', text.textContent);
    });
});
