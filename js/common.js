/**
 * Costruisce un oggetto dalla lista dei campi che ha:
 *  CHIAVI: i valori degli attributi "name" dei campi
 *  VALORI: i valori degli attributi "value"
 */
function createObjectFromForm(form, useMultiple) {
    // trovo tutti i figli di form che sono dei campi (field)
    // NB: querySelectorAll restituisce una lista di nodi che non è esattamente un array!
    const fieldList = form.querySelectorAll('input,select,textarea');

    // trasformo la lista dei campi del form in un array
    const array = Array.from(fieldList);

    // utilizzo la funzione reduce degli array per creare l'oggetto ciclando sugli elementi

    return array.reduce(function (obj, el) {
        if(el.name) {
            if(el.name.indexOf('.') !== -1) {
                // sto leggendo un campo multiplo
                if(useMultiple) {
                    obj[el.name.split('.')[1]] = el.value;    
                }
            }
            else {
                // sto leggendo un campo singolo
                obj[el.name] = el.value;
            }
        }
        return obj;
    }, {});
}

/**
 * Compila un form partendo da un oggetto javascript
 */
function fillFormFromObject(formElement,obj) {
    // trovo tutti i figli di form che sono dei campi (field)
    // NB: querySelectorAll restituisce una lista di nodi che non è esattamente un array!
    const fieldList = formElement.querySelectorAll('input,select,textarea');

    // trasformo la lista dei campi del form in un array
    const array = Array.from(fieldList);

    // imposto il valore di ogni singolo elemento primitivo
    array.forEach(field => {
        field.value = obj[field.name] ? obj[field.name] : null;
    })
}

/**
 * Sovrascrive i contenuti dei tag HTML che hanno un id del tipo "value-{name}"" partendo da un oggetto javascript
 */
// function updateUiFromObject(element, obj){
//     Object.keys(obj).forEach( (key) => {
//         const value = obj[key];

//         const el = element.querySelector(`#value-${key}`);
//         if(el) {
//             el.innerHTML = value ? `${value.replace('\n','<br/>')}` : null;
//         }
//     });
// }

/**
 * Legge i query parameters e li estrae in un oggetto
 */
function parseQueryString() {

    var str = window.location.search;
    var objURL = {};

    str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
    );
    return objURL;
};

/**
* Legge il valore di un parametro
*/
function getParamByKey(key) {
    const params = parseQueryString();
    return params[key];
}