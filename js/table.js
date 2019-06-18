// GET USERS
async function getTablePersons() {
    const tableTbody = document.querySelector('#table tbody');
    const users = await getUsersFromApi();
    
    if (!users || users.length === 0) {
        tableTbody.innerHTML = '<tr><td colspan="5">nessuna persona</td></tr>';
        return;
    }
    tableTbody.innerHTML = '';
    users.forEach(function (user) {
        tableTbody.innerHTML += printTableRowTemplate(user);
        // console.log(user);
    });
}


// CREATE USER
async function addTablePerson(form,event) {
    event.preventDefault();
    const tableTbody = document.querySelector('#table tbody');
    
    let newPerson = createObjectFromForm(form);

    // Gestione degli errori
    Array.from(form.querySelectorAll('input')).forEach(field => {
        field.classList.remove('has-error');
    })
    if(!newPerson.surname || newPerson.surname === '') {
        form.querySelector('[name="surname"]').classList.add('has-error');
        bootbox.alert('Il cognome è obbligatorio!');
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
//    const hasConfirmed = confirm(`Sei sicuro di voler eliminare la persona con ID = ${userId}?`);
    
    // const hasConfirmed = bootbox.confirm(`Sei sicuro di voler eliminare la persona con ID = ${userId}?`, function(result){ 
    //     console.log('This was logged in the callback: ' + result); 
    // });
    
    let hasConfirmed = false;

    bootbox.confirm({
        title: `Eliminazione`,
        message: `Sei sicuro di voler eliminare la persona con ID = ${userId}?`,
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Cancel',
                className: 'btn-danger'
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Confirm',
                className: 'btn-success'
            }
        },
        
        callback: async function (result) {
            console.log('This was logged in the callback: ' + result);
            hasConfirmed = result;
            console.log(hasConfirmed);

            if(!hasConfirmed) {
                return;
            }
            const tableRow = document.querySelector(`#table #row${userId}`);
            
            const user = await deleteUserFromApi(userId);

            if (!user) {
                return;
            }

            tableRow.parentNode.removeChild(tableRow);
        }
    });

    
    
}


// SEARCH USER  
function resetSearchTablePerson(){
    document.querySelector('#form-search input').value = null;
    getTablePersons();
}
async function searchTablePerson(event) {
    event.preventDefault();
    
    const searchString = document.querySelector('#form-search input').value;
    console.log(searchString);

    if(!searchString || searchString === '') {
        return resetSearchTablePerson();
    }

    const tableTbody = document.querySelector('#table tbody');
    const users = await searchUsersFromApi(searchString);
    
    if (!users || users.length === 0) {
        tableTbody.innerHTML = '<tr><td colspan="5">nessuna persona</td></tr>';
        return;
    }
    tableTbody.innerHTML = '';
    users.forEach(function (user) {
        tableTbody.innerHTML += printTableRowTemplate(user);
    });
    
}

//PRINT TABLE
function printTableRowTemplate(user){
    return `<tr id="row${user.id}">
        <td class="person-id" title="Apri la pagina di dettaglio"><a href="/views/detail.html?id=${user.id}">${user.id}</a></td>
        <td>${user.name}</td>
        <td>${user.surname}</td>
        <td>${user.codice_fiscale}</td>
        <td><span class="icon-delete"><i class="fas fa-edit"></i> <i class="fa fa-trash" onclick="removeTablePerson(${user.id})"></i></span></td>
    </tr>`
}