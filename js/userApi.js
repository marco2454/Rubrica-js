const userApiBaseUrl = 'http://localhost:3000/api/users';
const userApiJsonHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
}

async function getUserByIdFromApi(userId){
    try {
        return await fetch(`${userApiBaseUrl}/${userId}`)
        .then(function (response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .catch(manageHttpErrorResponse)
    } catch(e) {
        console.log(e);
    }
}

async function getUsersFromApi(){
    try {
        return await fetch(userApiBaseUrl)
        .then(function (response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .catch(manageHttpErrorResponse)
    } catch(e) {
        console.log(e);
    }
}


async function searchUsersFromApi(searchString){
    try {
        return await fetch(`${userApiBaseUrl}-filter?key=surname&value=${searchString}`)
        .then(function (response) {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        })
        .catch(manageHttpErrorResponse)
    } catch(e) {
        console.log(e);
    }
}

async function createUserFromApi(newUser){
    try {
        return await fetch(userApiBaseUrl, {
            method: 'POST',
            headers: userApiJsonHeaders,
            body: JSON.stringify(newUser)
        })
            .then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .catch(manageHttpErrorResponse)
    } catch(e) {
        console.log(e);
    }
}

async function updateUserFromApi(newUser){
    try {
        return await fetch(`${userApiBaseUrl}/${newUser.id}`, {
            method: 'PUT',
            headers: userApiJsonHeaders,
            body: JSON.stringify(newUser)
        })
            .then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .catch(manageHttpErrorResponse)
    } catch(e) {
        console.log(e);
    }
}

async function deleteUserFromApi(userId){
    try {
        return await fetch(`${userApiBaseUrl}/${userId}`, {
            method: 'DELETE',
            headers: userApiJsonHeaders
        })
            .then(function (response) {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .catch(manageHttpErrorResponse)
    } catch(e) {
        console.log(e);
    }
}


/** 
 * Funzione per gestire gli errori
 */
function manageHttpErrorResponse(e){
    console.log(e);
    alert(`${e}\nGuarda in console per avere maggiori informazioni.`);
}

