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
        <td><span class="icon-delete"><i class="fa fa-trash" onclick="removeTablePerson(${user.id})"></i></span></td>
    </tr>`
}