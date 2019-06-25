// creo una variabile globale user dove salvare l'utente corrente
let user;
let isEditing = false;

// GET USER BY ID
async function getPersonDetail() {
    user = null;
    const id = getParamByKey('id');
    // const loaderElement = document.querySelector('#loader'); Aggiungere
    const sectionInfoElement = document.querySelector("#section-info");

    const tableInfoElement = document.querySelector('#info');

    if (!id || isNaN(parseInt(id))) {
        sectionInfoElement.innerHTML = '<h1 style="margin:0">ID persona errato</h1>';
        loaderElement.style.display = 'none';
        tableInfoElement.style.display = 'block';
        return;
    }

    user = await getUserByIdFromApi(id);

    // loaderElement.style.display = 'none'; Aggiungere
    // tableInfoElement.style.display = 'block';

    if (!user) {
        sectionInfoElement.innerHTML = '<h1>nessuna persona</h1>';
        return;
    }

    rebuildUiAndForm();

    const formInfoElement = document.querySelector("#form-edit");
    console.log(formInfoElement);
    formInfoElement.innerHTML = '';

    formInfoElement.innerHTML += displayInfoModal(user);
}

// SAVE USER
async function savePersonDetail(form, event) {
    event.preventDefault();

    const sectionInfoElement = document.querySelector('#section-info');

    updatedUser = createObjectFromForm(form);

    // updatedUser = Object.assign({},createObjectFromForm(form));
    // updatedUser = Object.assign({},{id: 1, name: 'Daniel'}, {id:3}); // {id:3, name: 'Daniel'}

    user = await updateUserFromApi(updatedUser);

    if (!user) {
        sectionInfoElement.innerHTML = '<h1>nessuna persona</h1>';
        return;
    }

    rebuildUiAndForm();
}


// REBUILD UI and FORM
function rebuildUiAndForm() {
    const titleElement = document.querySelector('title');
    const tableInfoElement = document.querySelector('#info');
    const h1Element = document.querySelector('#h1-title');
    // const formElement = document.querySelector('#edit form');

    // Aggiorno il titolo della pagina
    titleElement.innerHTML = `${user.surname} | Scehda Paziente`;

    h1Element.innerHTML = `<a href="/index.html"><i id="home" class="fas fa-clinic-medical" style="float: left;" title="Home"></i></a> Scheda Paziente |  ${user.name} ${user.surname}<i id="icon-edit" class="fas fa-edit" data-toggle="modal" style="float: right;" data-target="#ModalEdit"></i>`;

    tableInfoElement.innerHTML = '';

    tableInfoElement.innerHTML += displayInfoTable(user);


    // // Aggiorno la UI con i dati della persona
    // updatePersonUiFromObject(sectionInfoElement, user);

    // // Compilo i campi del form
    // fillPersonFormFromObject(formElement, user);
}

// VIEW
// function updatePersonUiFromObject(element, person) {
//     Object.keys(person).forEach((key) => {
//         const value = person[key];

//         if (value && typeof value === 'object') {
//             // Gestisco gli array
//             if (Array.isArray(value)) {
//                 updateListUi(element.querySelector(`#value-${key}`), value, key)
//                 return;
//             }

//             // Gestisco gli oggetti (non con questa struttura dati)
//             if (!Array.isArray(value)) {
//                 // console.log('è un oggetto')
//                 return;
//             }
//         }
//         else {
//             // Gestisco i valori primitivi
//             const el = element.querySelector(`#value-${key}`);
//             if (el) {
//                 el.innerHTML = value ? `${value.replace('\n', '<br/>')}` : null;
//             }
//         }
//     });

//     // Gestisco l'immagine
//     const pictureElement = element.querySelector(`#value-picture`);
//     const pictureValue = person['picture']

//     if (pictureValue) {
//         pictureElement.src = pictureValue;
//         pictureElement.parentNode.style.display = 'inline-block';
//     } else {
//         pictureElement.parentNode.style.display = 'none';
//     }
// }

// function updateListUi(element, list, type) {
//     if (list && list.length > 0) {
//         element.innerHTML = '';
//     }
//     else {
//         element.innerHTML = 'nessuno';
//     }
//     list.forEach(item => {
//         switch (type) {
//             case 'contacts':
//                 element.innerHTML += displayContactListUi(item);
//                 break;
//             case 'hobbies':
//                 element.innerHTML += displayHobbyListUi(item);
//                 break;
//         }
//     });
// }
// function displayContactListUi(contact) {
//     return `
//         <li>
//             <label>${contact.label}</label>
//             <a href="${contact.url}" target="_blank">${contact.value}</a>
//         </li>`;
// }
// function displayHobbyListUi(hobby) {
//     return `
//         <li>
//             ${hobby.icon ? `<i class="fa fa-${hobby.icon}"></i>` : `<i class="fa fa-angle-right"></i>`}
//             <span>${hobby.value}</span>
//         </li>`;
// }

// // FORM 
// function fillPersonFormFromObject(formElement, user) {
//     fillFormFromObject(formElement, user);
//     createFieldsetFromObject('contacts', user.contacts);
//     createFieldsetFromObject('hobbies', user.hobbies);
// }
// function getChildrenItemFromForm(type) {
//     fieldSets = document.querySelectorAll(`#edit-${type} fieldset`);
//     let children = [];
//     if (!fieldSets) {
//         return children;
//     }

//     fieldSets.forEach(fieldset => {
//         let contact = createObjectFromForm(fieldset, true)
//         children.push(contact);
//     })

//     return children;
// }
// function createFieldsetFromObject(type, list) {
//     const containerElement = document.querySelector(`#edit-${type}`);
//     containerElement.innerHTML = '';
//     if (list && list.length > 0) {
//         list.forEach(item => {
//             addFieldset(type, item);
//         })
//     }
//     // aggiungo un campo vuoto da aggiungere
//     // else {
//     //     addFieldset(type);
//     // }
// }
// function addFieldset(type, item) {
//     const containerElement = document.querySelector(`#edit-${type}`);

//     // ATTENZIONE: innerHTML sovrascrive i value! Bisogna usare appendChild
//     // containerElement.innerHTML += displayFieldset(item,type);

//     const element = document.createElement('div');
//     element.innerHTML = displayFieldset(type, item);
//     containerElement.appendChild(element);
// }
// function removeFieldset(fieldset) {
//     fieldset.parentNode.removeChild(fieldset);
// }
// function displayFieldset(type, item) {
//     switch (type) {
//         case 'contacts':
//             return displayContactFieldset(item)
//         case 'hobbies':
//             return displayHobbyFieldset(item)
//     }
// }

//Stampa Informazioni
function displayInfoTable(user) {
    return `
    <tbody>
        <tr>
            <td class="text-right"><i class="fas fa-signature"></i> Nome</td>
            <td>
                <input class="text-left" type="text" class="form-control" readonly value="${user.name}">
            </td>
        </tr>
        <tr>
            <td class="text-right"><i class="fas fa-signature"></i> Cognome</td>
            <td>
                <input class="text-left" type="text" class="form-control" readonly value="${user.surname}">
            </td>
        </tr>
        <tr>
            <td class="text-right"><i class="fas fa-signature"></i> Codice Fiscale</td>
            <td>
                <input class="text-left" type="text" class="form-control" readonly value="${user.codice_fiscale}">
            </td>
        </tr>
        <tr>
            <td class="text-right"><i class="fas fa-phone fa-rotate-90"></i> Telefono</td>
            <td>
                <input class="text-left" type="text" class="form-control" readonly value="${user.phone}">
            </td>
        </tr>
        <tr>
            <td class="text-right"><i class="fas fa-map-marked-alt"></i> Luogo di Nascita</td>
            <td>
                <input class="text-left" type="text" class="form-control" readonly value="${user.birth_place}">
            </td>
        </tr>
        <tr>
            <td class="text-right"><i class="fas fa-birthday-cake"></i> Data di Nascita</td>
            <td>
                <input class="text-left" type="text" class="form-control" readonly value="${user.birth_date}">
            </td>
        </tr>
        <tr>
            <td class="text-right"><i class="fas fa-tint"></i> Gruppo Sanguigno</td>
            <td>
                <input class="text-left" type="text" class="form-control" readonly value="${user.blood}">
            </td>
        </tr>
    </tbody>
    `
}


//Stampa Informazioni nel modal
function displayInfoModal(user) {
    return `
    <form onsubmit="return savePersonDetail(this,event)" id="form-edit">
        <input name="id" type="hidden" value="${user.id}">
        <label for="name">Nome</label>
        <input type="text" class="form-control mb-2 mr-sm-2" class="input-modal" name="name" value="${user.name}">
        <label for="inlineFormInputName2">Cognome</label>
        <input type="text" class="form-control mb-2 mr-sm-2" class="input-modal" name="surname" value="${user.surname}">
        <label for="inlineFormInputName2">Codice Fiscale</label>
        <input type="text" class="form-control mb-2 mr-sm-2" class="input-modal" name="codice_fiscale" value="${user.codice_fiscale}">
        <label for="inlineFormInputName2">Telefono</label>
        <input type="text" class="form-control mb-2 mr-sm-2" class="input-modal" name="phone" value="${user.phone}">
        <label for="inlineFormInputName2">Luogo di Nascita</label>
        <input type="text" class="form-control mb-2 mr-sm-2" class="input-modal" name="birth_place" value="${user.birth_place}">
        <label for="inlineFormInputName2">Data di Nascita</label>
        <input type="text" class="form-control mb-2 mr-sm-2" class="input-modal" name="birth_date" value="${user.birth_date}">
        <label for="inlineFormInputName2">Gruppo Sanguigno</label>
        <input type="text" class="form-control mb-2 mr-sm-2" class="input-modal" name="blood" value="${user.blood}">
        <button type="submit" class="btn btn-success">
            Salva
        </button>
    </form>
    `
}



// CONTATTI
// function displayContactFieldset(contact) {
//     return `
//     <fieldset>
//         <span class="icon" title="Elimina contatto" onclick="removeFieldset(this.parentNode)">
//             <i class="fa fa-times"></i>
//         </span>
//         <input name="contact.label" placeholder="nome" value="${contact ? contact.label : ''}">
//         <input name="contact.value" placeholder="contatto" value="${contact ? contact.value : ''}">
//         <input name="contact.url" placeholder="url contatto" value="${contact ? contact.url : ''}">
//     </fieldset>`;
// }
// HOBBIES
// function displayHobbyFieldset(hobby) {
//     return `
//     <fieldset>
//         <span class="icon" title="Elimina hobby" onclick="removeFieldset(this.parentNode)">
//             <i class="fa fa-times"></i>
//         </span>
//         <input name="hobby.icon" placeholder="icon fontawesome" value="${hobby ? hobby.icon : ''}">
//         <input name="hobby.value" placeholder="hobby" value="${hobby ? hobby.value : ''}">
//     </fieldset>`;
// }