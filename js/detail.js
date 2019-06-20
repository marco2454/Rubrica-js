// creo una variabile globale user dove salvare l'utente corrente
let user;
let isEditing = false;

// passo dalla vista di modifica alla vista di dettaglio (e viceversa)
function toggleEdit() {
    const sectionInfoElement = document.querySelector('#info');
    const editElement = document.querySelector('#edit');
    const form = document.querySelector('#edit form');

    if (isEditing) {
        // Ricompilo i campi del form
        fillPersonFormFromObject(form, user);

        sectionInfoElement.style.display = 'block';
        editElement.style.display = 'none';
    }
    else {
        editElement.style.display = 'block';
        sectionInfoElement.style.display = 'none';
    }
    isEditing = !isEditing;
}

// GET USER BY ID
async function getPersonDetail() {
    user = null;
    const id = getParamByKey('id');
    // const loaderElement = document.querySelector('#loader'); Aggiungere
    const tableInfoElement = document.querySelector('#info');

    if (!id || isNaN(parseInt(id))) {
        tableInfoElement.innerHTML = '<h1 style="margin:0">ID persona errato</h1>';
        loaderElement.style.display = 'none';
        tableInfoElement.style.display = 'block';
        return;
    }

    user = await getUserByIdFromApi(id);

    // loaderElement.style.display = 'none'; Aggiungere
    sectionInfoElement.style.display = 'block';

    if (!user) {
        sectionInfoElement.innerHTML = '<h1>nessuna persona</h1>';
        return;
    }

    rebuildUiAndForm();
}

// SAVE USER
async function savePersonDetail(form, event) {
    event.preventDefault();

    const loaderElement = document.querySelector('#loader');
    const sectionInfoElement = document.querySelector('#info');
    const editElement = document.querySelector('#edit');

    loaderElement.style.display = 'block';
    editElement.style.display = 'none';

    updatedUser = {
        ...createObjectFromForm(form),
        contacts: getChildrenItemFromForm('contacts'),
        hobbies: getChildrenItemFromForm('hobbies')
    };

    user = await updateUserFromApi(updatedUser);

    loaderElement.style.display = 'none';
    sectionInfoElement.style.display = 'block';

    if (!user) {
        sectionInfoElement.innerHTML = '<h1>nessuna persona</h1>';
        return;
    }

    toggleEdit();

    rebuildUiAndForm();
}


// REBUILD UI and FORM
function rebuildUiAndForm() {
    const titleElement = document.querySelector('title');
    const sectionInfoElement = document.querySelector('#info');
    const formElement = document.querySelector('#edit form');

    // Aggiorno il titolo della pagina
    titleElement.innerHTML = `${user.surname} | Rubrica JS`

    // Aggiorno la UI con i dati della persona
    updatePersonUiFromObject(sectionInfoElement, user);

    // Compilo i campi del form
    fillPersonFormFromObject(formElement, user);
}

// VIEW
function updatePersonUiFromObject(element, person) {
    Object.keys(person).forEach((key) => {
        const value = person[key];

        if (value && typeof value === 'object') {
            // Gestisco gli array
            if (Array.isArray(value)) {
                updateListUi(element.querySelector(`#value-${key}`), value, key)
                return;
            }

            // Gestisco gli oggetti (non con questa struttura dati)
            if (!Array.isArray(value)) {
                // console.log('è un oggetto')
                return;
            }
        }
        else {
            // Gestisco i valori primitivi
            const el = element.querySelector(`#value-${key}`);
            if (el) {
                el.innerHTML = value ? `${value.replace('\n', '<br/>')}` : null;
            }
        }
    });

    // Gestisco l'immagine
    const pictureElement = element.querySelector(`#value-picture`);
    const pictureValue = person['picture']

    if (pictureValue) {
        pictureElement.src = pictureValue;
        pictureElement.parentNode.style.display = 'inline-block';
    } else {
        pictureElement.parentNode.style.display = 'none';
    }
}
function updateListUi(element, list, type) {
    if (list && list.length > 0) {
        element.innerHTML = '';
    }
    else {
        element.innerHTML = 'nessuno';
    }
    list.forEach(item => {
        switch (type) {
            case 'contacts':
                element.innerHTML += displayContactListUi(item);
                break;
            case 'hobbies':
                element.innerHTML += displayHobbyListUi(item);
                break;
        }
    });
}
function displayContactListUi(contact) {
    return `
        <li>
            <label>${contact.label}</label>
            <a href="${contact.url}" target="_blank">${contact.value}</a>
        </li>`;
}
function displayHobbyListUi(hobby) {
    return `
        <li>
            ${hobby.icon ? `<i class="fa fa-${hobby.icon}"></i>` : `<i class="fa fa-angle-right"></i>`}
            <span>${hobby.value}</span>
        </li>`;
}

// FORM 
function fillPersonFormFromObject(formElement, user) {
    fillFormFromObject(formElement, user);
    createFieldsetFromObject('contacts', user.contacts);
    createFieldsetFromObject('hobbies', user.hobbies);
}
function getChildrenItemFromForm(type) {
    fieldSets = document.querySelectorAll(`#edit-${type} fieldset`);
    let children = [];
    if (!fieldSets) {
        return children;
    }

    fieldSets.forEach(fieldset => {
        let contact = createObjectFromForm(fieldset, true)
        children.push(contact);
    })

    return children;
}
function createFieldsetFromObject(type, list) {
    const containerElement = document.querySelector(`#edit-${type}`);
    containerElement.innerHTML = '';
    if (list && list.length > 0) {
        list.forEach(item => {
            addFieldset(type, item);
        })
    }
    // aggiungo un campo vuoto da aggiungere
    // else {
    //     addFieldset(type);
    // }
}
function addFieldset(type, item) {
    const containerElement = document.querySelector(`#edit-${type}`);

    // ATTENZIONE: innerHTML sovrascrive i value! Bisogna usare appendChild
    // containerElement.innerHTML += displayFieldset(item,type);

    const element = document.createElement('div');
    element.innerHTML = displayFieldset(type, item);
    containerElement.appendChild(element);
}
function removeFieldset(fieldset) {
    fieldset.parentNode.removeChild(fieldset);
}
function displayFieldset(type, item) {
    switch (type) {
        case 'contacts':
            return displayContactFieldset(item)
        case 'hobbies':
            return displayHobbyFieldset(item)
    }
}

//Stampa Informazioni
function displayInfoTable(user) {
    return `
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
        <td class="text-right"><i class="fas fa-phone"></i> Telefono</td>
        <td>
                <input class="text-left" type="text" class="form-control" readonly value="${user.phone}">
        </td>
    </tr>
    <tr>
        <td class="text-right"><i class="fas fa-baby-carriage"></i> Luogo di Nascita</td>
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
    `
}


// CONTATTI
function displayContactFieldset(contact) {
    return `
    <fieldset>
        <span class="icon" title="Elimina contatto" onclick="removeFieldset(this.parentNode)">
            <i class="fa fa-times"></i>
        </span>
        <input name="contact.label" placeholder="nome" value="${contact ? contact.label : ''}">
        <input name="contact.value" placeholder="contatto" value="${contact ? contact.value : ''}">
        <input name="contact.url" placeholder="url contatto" value="${contact ? contact.url : ''}">
    </fieldset>`;
}
// HOBBIES
function displayHobbyFieldset(hobby) {
    return `
    <fieldset>
        <span class="icon" title="Elimina hobby" onclick="removeFieldset(this.parentNode)">
            <i class="fa fa-times"></i>
        </span>
        <input name="hobby.icon" placeholder="icon fontawesome" value="${hobby ? hobby.icon : ''}">
        <input name="hobby.value" placeholder="hobby" value="${hobby ? hobby.value : ''}">
    </fieldset>`;
}