// GET USERS
async function getTablePersons() {
    const tableTbody = document.querySelector('#table tbody');
    const users = await getUsersFromApi();
    
    if (!users || users.length === 0) {
        tableTbody.innerHTML = '<tr><td colspan="4">nessuna persona</td></tr>';
        return;
    }
    tableTbody.innerHTML = '';
    users.forEach(function (user) {
        tableTbody.innerHTML += printTableRowTemplate(user);
        // console.log(user);
    });
}


// DELETE USER
async function removeTablePerson(userId) {
    // const hasConfirmed = confirm(`Sei sicuro di voler eliminare la persona con ID = ${userId}?`);
    // if(!hasConfirmed) {
    //     return;
    // }

    let bootbox = document.getElementsByTagName("script")[0];
    console.log(bootbox);
    bootbox.confirm("This is the default confirm!", function(result){ 
        console.log('This was logged in the callback: ' + result); 
    });
    
    const tableRow = document.querySelector(`#table #row${userId}`);
    
    const user = await deleteUserFromApi(userId);

    if (!user) {
        return;
    }

    tableRow.parentNode.removeChild(tableRow);
    
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
        tableTbody.innerHTML = '<tr><td colspan="4">nessuna persona</td></tr>';
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
        <td>${user.codiceFiscale}</td>
        <td><span class="icon-delete"><i class="fas fa-edit"></i> <i class="fa fa-trash" onclick="removeTablePerson(${user.id})"></i></span></td>
    </tr>`
}