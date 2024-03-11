const button = document.querySelectorAll(".services__card");
const modal = document.querySelector('.services__modal');
const modalText = document.querySelector('.modal__card-text');
const title = document.querySelector('.modal__card-title');
const card = document.querySelector('.services__modal-card');
console.log(modal);

let text = `Процедура повторной маркировки транспортного средства:
<ol>
<li>Получение в ГИБДД направления на повторную маркировку ТС и установка сотрудниками ГИБДД пломб на ТС.</li>
<li>Обращение в Компанию ТЭСПА и получение первичной консультации по телефону и запись на маркировку.</li>
<li>Приезд автомобиля.</li>
<li>Проверка документов специалистами и пломб на ТС.</li>
<li>Определение мест нанесения повторной маркировка.</li>
<li>Подготовка выбранных мест к нанесению.</li>
<li>Нанесение повторной маркировки и ее консервация.</li>
<li>Оформление Свидетельства и бухгалтерских документов.</li>
</ol>`

button.forEach(function (button, index) {
    button.id = 'btn' + (index + 1);
    button.addEventListener('click', () => {
        document.body.style = "overflow: hidden"
        modal.style = "display:flex"
        card.style = "display: flex;"
        title.style = "font-size:clamp(26px, 2.5vw, 45px);"
        modalText.style = "font-size: 16px;"

        switch (button.id) {
            case 'btn2':
                title.textContent = "Маркировка";
                modalText.innerHTML = text;

                break;

            case 'btn1':
                title.textContent = "";
                modalText.innerHTML = "";

                break;
            case 'btn3':
                title.textContent = "";
                modalText.innerHTML = "";


        }
    })
})
modal.addEventListener('click', () => {
    document.body.style = "overflow: visible"
    card.style = "display: none;"
    title.style = "font-size:0;"
    modal.style = "display:none";
    modalText.style = "font-size: 0;"

})
