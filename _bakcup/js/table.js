// GET USERS
async function getTablePersons() {
    const sectionTableTbody = document.querySelector('#section-table tbody');
    const users = await getUsersFromApi();
    
    if (!users || users.length === 0) {
        sectionTableTbody.innerHTML = '<tr><td colspan="4">nessuna persona</td></tr>';
        return;
    }
    sectionTableTbody.innerHTML = '';
    users.forEach(function (user) {
        sectionTableTbody.innerHTML += printTableRowTemplate(user);
    });
}

// CREATE USER
async function addTablePerson(form,event) {
    event.preventDefault();
    const sectionTableTbody = document.querySelector('#section-table tbody');
    
    let newPerson = createObjectFromForm(form);

    // Gestione degli errori
    Array.from(form.querySelectorAll('input')).forEach(field => {
        field.classList.remove('has-error');
    })
    if(!newPerson.surname || newPerson.surname === '') {
        form.querySelector('[name="surname"]').classList.add('has-error');
        alert('Il cognome è obbligatorio!');
        return;
    }

    const user = await createUserFromApi(newPerson);

    Array.from(form.querySelectorAll('input')).forEach(field => {
        field.value = '';
    });


    if (!user) {
        return;
    }

    sectionTableTbody.innerHTML += printTableRowTemplate(user);
}

// DELETE USER
async function removeTablePerson(userId) {
    const hasConfirmed = confirm(`Sei sicuro di voler eliminare la persona con ID = ${userId}?`);
    if(!hasConfirmed) {
        return;
    }
    
    const sectionTableRow = document.querySelector(`#section-table #row${userId}`);
    
    const user = await deleteUserFromApi(userId);

    if (!user) {
        return;
    }

    sectionTableRow.parentNode.removeChild(sectionTableRow);
    
}

// SEARCH USER
function resetSearchTablePerson(){
    document.querySelector('#section-search-person input').value = null;
    getTablePersons();
}
async function searchTablePerson(event) {
    event.preventDefault();
    
    const searchString = document.querySelector('#section-search-person input').value;

    if(!searchString || searchString === '') {
        return resetSearchTablePerson();
    }

    const sectionTableTbody = document.querySelector('#section-table tbody');
    const users = await searchUsersFromApi(searchString);
    
    if (!users || users.length === 0) {
        sectionTableTbody.innerHTML = '<tr><td colspan="4">nessuna persona</td></tr>';
        return;
    }
    sectionTableTbody.innerHTML = '';
    users.forEach(function (user) {
        sectionTableTbody.innerHTML += printTableRowTemplate(user);
    });
    
}


function printTableRowTemplate(user){
    return `<tr id="row${user.id}">
        <td class="person-id" title="Apri la pagina di dettaglio"><a href="/views/detail.html?id=${user.id}">${user.id}</a></td>
        <td>${user.name}</td>
        <td>${user.surname}</td>
        <td><span class="icon-delete"><i class="fa fa-trash" onclick="removeTablePerson(${user.id})"></i></span></td>
    </tr>`

}