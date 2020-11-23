'use strict'
const btns = document.querySelectorAll('button');

const numApart  = document.querySelector('#num-apart');
const numCad    = document.querySelector('#num-cad');
const comission = document.querySelector('#comission');
const numAg     = document.querySelector('#num-ag');


subscribeInput([numApart, numCad, comission, numAg], formCheck);

const btnY = document.querySelector('#yandex'); // <-- Yandex
const btnA = document.querySelector('#avito');  // <-- Avito
const btnC = document.querySelector('#cian');   // <-- Cian
disableElements([btnY, btnA, btnC], true);

const resCode = document.querySelector('code');

const imgCopyText = document.querySelector('#copy-to-buffer');

let objForm = {};

$(".phone").mask("+7(999)999-9999", {
    completed: formCheck
});

// let arrIts = [numApart, numCad, comission, numAg]; // <-- array inputs
let arrIts = [btnY, btnA, btnC];

function disableElements(ElementsArr, Condition) {
    ElementsArr.forEach(el => el.disabled = Condition);
}
function subscribeInput(ElementsArr, func) {
    ElementsArr.forEach(el => el.addEventListener('input', func));
}

function formCheck() {
    disableElements(arrIts, 
        numApart.value  == "" || 
        numCad.value    == "" || 
        comission.value == "" || 
        numAg.value     == "");

    // Исключение для Циана
    if (numApart.value != "" && 
        numCad.value   != "" && 
        numAg.value    != "") {
            btnC.disabled = false;
    }   
}

btns.forEach(item => {
    item.onclick = (e) => {
        e.preventDefault();        

        // Создание стилей для кнопок
        btns.forEach(itemNested => {
            if(itemNested.classList.contains('active') && itemNested != item)
                itemNested.classList.remove('active');
        })

        if(!item.classList.contains('active')) {
            item.classList.add('active');
        }

        // Создание объекта из всех значений формы
        objForm.numApart  = `${numApart.value}`;
        objForm.numCad    = `${numCad.value}`;
        objForm.comission = `${comission.value}`;
        objForm.numAg     = `${numAg.value}`;
        objForm.format    = `${item.id}`;
        
        // Формирование XML
        let strRes = '';
        switch (objForm.format) {
            case 'yandex':
                strRes = `<?xml version="1.0" encoding="utf-8"?>
<apartment>${objForm.numApart}</apartment>
<cadastral-number>${objForm.numCad}</cadastral-number>
<commission>${objForm.comission}</commission>
<sales-agent>
    <responsible_officer_phone>${objForm.numAg.match(/\d/g).join('')}</responsible_officer_phone>
</sales-agent>`;
            break
            case 'avito':
                strRes = `<?xml version="1.0" encoding="utf-8"?>
<FlatNumber>${objForm.numApart}</FlatNumber>
<CadastralNumber>${objForm.numCad}</CadastralNumber>
<commission>${objForm.comission}</commission>
<ResponsibleOfficerPhone>${objForm.numAg.match(/\d/g).join('')}</ResponsibleOfficerPhone>`;
            break
            case 'cian':
                strRes = `<?xml version="1.0" encoding="utf-8"?>
<FlatNumber>${objForm.numApart}</FlatNumber
<CadastralNumber>${objForm.numCad}</CadastralNumber>
<ResponsibleOfficerPhones>
<PhoneSchema>
        <CountryCode>+7</CountryCode>
        <Number>${objForm.numAg.slice(2).match(/\d/g).join('')}</Number>
    </PhoneSchema>
</ResponsibleOfficerPhones>`;
            break
        }
        resCode.innerText = strRes;
    }
})

// буфер
imgCopyText.onmousedown = () => {
    imgCopyText.classList.add('clicked');

    navigator.clipboard.writeText(resCode.innerText)
      .catch(err => {
        console.log('Something went wrong', err);
      });
    imgCopyText.onmouseup = () => {
        imgCopyText.classList.remove('clicked');
    }
}