const frame = document.getElementById('frame');
const brake = document.getElementById('brake');
const wheels = document.getElementById('wheels');
const color = document.getElementById('color');
const fender = document.getElementById('fender');
const susprnsion = document.getElementById('suspension');
const submitButton = document.querySelector('.form__content-button');
const surname = document.getElementById('name');

const phone = document.getElementById('number');


surname.value = '121212';
brake.value = localStorage.getItem('brake');
wheels.value = localStorage.getItem('wheels');
color.value = localStorage.getItem('color');
fender.value = localStorage.getItem('fender');
suspension.value = localStorage.getItem('suspension');
frame.value = localStorage.getItem('frame');

function buttonChecked() {
    if (surname.value !== '' && phone.value !== '') {
        submitButton.disabled = false;
        submitButton.classList.remove('disabled');
        submitButton.addEventListener('click', () => {
            alert('Thank you');

        })
    }
    else if (surname.value === '' || phone.value === '') {

        submitButton.disabled = true;
        submitButton.classList.add('disabled');
    }
}


surname.addEventListener('change', () => {
    buttonChecked();

});
phone.addEventListener('change', () => {
    buttonChecked();
});

