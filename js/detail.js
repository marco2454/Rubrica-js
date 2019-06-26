// creo una variabile globale user dove salvare l'utente corrente
let user;
let visits = [];
let lastVisitId = 0;
let nRow = 0;

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
    visits = user.visits;
    if (!visits || visits.length === 0) {
        let tableVisitsTbody = document.querySelector('#visits-table tbody');
        tableVisitsTbody.innerHTML = '<tr><td colspan="5">nessuna visita</td></tr>';
    }else{
        let lastVisit = visits[visits.length-1];
        lastVisitId = lastVisit.id;    
    }

    // loaderElement.style.display = 'none'; Aggiungere
    // tableInfoElement.style.display = 'block';

    if (!user) {
        sectionInfoElement.innerHTML = '<h1>nessuna persona</h1>';
        return;
    }

    rebuildUiAndForm();
}

// SAVE USER
async function savePersonDetail(form, event) {
    event.preventDefault();

    const sectionInfoElement = document.querySelector('#section-info');

    updatedUser = createObjectFromForm(form);

    updatedUser = { 
        ...createObjectFromForm(form),
        visits: visits 
    };

    // updatedUser = Object.assign({},createObjectFromForm(form));
    // updatedUser = Object.assign({},{id: 1, name: 'Daniel'}, {id:3}); // {id:3, name: 'Daniel'}

    // Gestione degli errori
    Array.from(form.querySelectorAll('input')).forEach(field => {
        field.classList.remove('has-error');
    })

    if ((!updatedUser.surname || updatedUser.surname.trim() === '') && (!updatedUser.codice_fiscale || updatedUser.codice_fiscale.trim() === '')) {
        form.querySelector('[name="surname"]').classList.add('has-error');
        form.querySelector('[name="codice_fiscale"]').classList.add('has-error');
        bootbox.alert('Il cognome e il codice fiscali sono obbligatori!');
        return;
    }

    if (!updatedUser.surname || updatedUser.surname.trim() === '') {
        form.querySelector('[name="surname"]').classList.add('has-error');
        bootbox.alert('Il cognome è obbligatorio!');
        return;
    }

    if (!updatedUser.codice_fiscale || updatedUser.codice_fiscale.trim() === '') {
        form.querySelector('[name="codice_fiscale"]').classList.add('has-error');
        bootbox.alert('Il codice fiscale è obbligatorio!');
        return;
    }

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

    //Riempie il form del modale della modifica del paziente
    const formInfoElement = document.querySelector("#form-edit");
    formInfoElement.innerHTML = '';
    formInfoElement.innerHTML += displayInfoModal(user);

    //Riempie la tabella delle visite
    if (!visits || visits.length === 0) {
        return;
    }else{
        const tableTbody = document.querySelector('#visits-table tbody');
        n = 0;
        visits.forEach(function (visits) {
            n++;
            tableTbody.innerHTML += printTableVisits(visits, n);
        });
    }
}

// CREATE VISIT
async function addTableVisit(form, event) {
    event.preventDefault();
    const tableTbody = document.querySelector('#visits-table tbody');

    let newVisit = createObjectFromForm(form);
    newVisit = Object.assign({id: (lastVisitId+1)}, newVisit); 
    visits.push(newVisit);

    updatedUser = { 
        ...user, 
        visits: visits 
    };

    user = await updateUserFromApi(updatedUser);

    Array.from(form.querySelectorAll('input')).forEach(field => {
        field.value = '';
    });


    if (!user) {
        return;
    }

    tableTbody.innerHTML += printTableVisits(user);
}

//Modifica Visita
async function EditVisit(form, event) {
    event.preventDefault();
    const tableTbody = document.querySelector('#visits-table tbody');

    let newVisit = createObjectFromForm(form);
    newVisit = Object.assign({id: (lastVisitId+1)}, newVisit); 
    visits.push(newVisit);

    updatedUser = { 
        ...user, 
        visits: visits 
    };

    user = await updateUserFromApi(updatedUser);

    Array.from(form.querySelectorAll('input')).forEach(field => {
        field.value = '';
    });


    if (!user) {
        return;
    }

    tableTbody.innerHTML += printTableVisits(user);
}


//Elimina una visita
async function removeVisit(td) {
    // let valore = visits[id];
    // let indice = visits.indexOf(valore);
    // console.log(`Indice: ${indice}`);
    // console.log(visits.valueOf());
    
    let tr = td.parentNode;
    let id = tr.childNodes[1].innerText;
    // console.log(`Id: ${id}`);
    visits.splice((id - 1), id);
    console.log(visits);
    updatedUser = { 
        ...user, 
        visits: visits 
    };

    user = await updateUserFromApi(updatedUser);
    // tr.remove();
}

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

//Stampa tabella per le visite
function printTableVisits(visits, n) {
    return `<tr id="row${n}">
        <td class="visit-number">${n}</td>
        <td>${visits.date}</td>
        <td>${visits.details}</td>
        <td><span class="icon-edit"><i class="fas fa-edit" data-toggle="modal" data-target="#ModalEditVisita"></i></span></td>
        <td><span class="icon-delete" onclick="removeVisit(this.parentNode)"><i class="fa fa-trash"></i></span></td>
    </tr>`
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