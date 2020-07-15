'use strict';

const modalAdd = document.querySelector('.modal__add');
const btnAdd = document.querySelector('.btn-add__ad');
const modalBtnSubmit = document.querySelector('.modal__btn-submit');
const modalSubmit = document.querySelector('.modal__submit');
const catalog = document.querySelector('.catalog');
const modalItem = document.querySelector('.modal__item');
const modalBtnWarning = document.querySelector('.modal__btn-warning');
const modalFileInput = document.querySelector('.modal__file-input');
const modalFileBtn = document.querySelector('.modal__file-btn');
const modalImageAdd = document.querySelector('.modal__image-add');
const modalImageItem = document.querySelector('.modal__image-item');
const modalHeaderItem = document.querySelector('.modal__header-item');
const modalStatusItem = document.querySelector('.modal__status-item');
const modalDescriptionItem = document.querySelector('.modal__description-item');
const modalCostItem = document.querySelector('.modal__cost-item');

const textFileBtn = modalFileBtn.textContent;
const srcModalImage = modalImageAdd.src;

const dataBase = JSON.parse(localStorage.getItem('awito')) || [];

//selection of form elements
const elementsModalSubmit = [...modalSubmit.elements]
    .filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit');

const infoPhoto = {};

//function
const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));

const checkForm = () => {
    const validForm = elementsModalSubmit.every(elem => elem.value);
    modalBtnSubmit.disabled = !validForm;
    modalBtnWarning.style.display = validForm ? 'none' : '';
}

const closeModal = event => {
    const target = event.target;

    if (target.closest('.modal__close') ||
        target.classList.contains('modal') ||
        event.code === 'Escape') {
        modalAdd.classList.add('hide');
        modalItem.classList.add('hide');
        document.removeEventListener('keydown', closeModal);
        modalSubmit.reset();
        modalImageAdd.src = srcModalImage;
        modalFileBtn.textContent = textFileBtn;
        checkForm();
    }
};

const renderCard = () => {
    catalog.textContent = '';

    dataBase.forEach((item, i) => {
        catalog.insertAdjacentHTML('beforeend',
   `<li class="card" data-id-item="${i}">
            <img class="card__image" src="data:image/jpg;base64,${item.image}" alt="test">
            <div class="card__description">
                <h3 class="card__header">${item.nameItem}</h3>
                <div class="card__price">${item.costItem} ₽</div>
            </div>
          </li>
        `)
    });
};

//event handler
modalFileInput.addEventListener('change', event => {
    const target = event.target;
    const reader = new FileReader();
    const file = target.files[0];

    infoPhoto.filename = file.name;
    infoPhoto.size = file.size;

    reader.readAsBinaryString(file);

    reader.addEventListener('load', event => {
        if (infoPhoto.size < 200000) {
            modalFileBtn.textContent = infoPhoto.filename;
            infoPhoto.base64 = btoa(event.target.result);
            modalImageAdd.src = `data:image/jpg;base64,${infoPhoto.base64}`
        } else {
            modalFileBtn.textContent = 'файла превышает 200kb';
            modalFileInput.value = '';
            checkForm();
        }
    })
})

modalSubmit.addEventListener('input', checkForm);

modalSubmit.addEventListener('submit', event => {
    event.preventDefault();
    const itemObject = {};

    for (const elem of elementsModalSubmit) {
        itemObject[elem.name] = elem.value;
    }
    itemObject.image = infoPhoto.base64;
    dataBase.push(itemObject);
    closeModal({target: modalAdd});
    saveDB();
    renderCard();
});

btnAdd.addEventListener('click', () => {
    modalAdd.classList.remove('hide');
    modalBtnSubmit.disabled = true;

    document.addEventListener('keydown', closeModal);
});

modalAdd.addEventListener('click', closeModal);

catalog.addEventListener('click', event => {
    const target = event.target;
    const card = target.closest('.card');

    if (card) {
        const item = dataBase[card.dataset.idItem];

        modalImageItem.src = `data:image/jpg;base64,${item.image}`;
        modalHeaderItem.textContent = item.nameItem;
        modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У';
        modalDescriptionItem.textContent = item.descriptionItem;
        modalCostItem.textContent = item.costItem;

        modalItem.classList.remove('hide');
        document.addEventListener('keydown', closeModal);
    }
});

modalItem.addEventListener('click', closeModal);

//function call
renderCard();
