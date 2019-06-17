const fs  = require('fs');

/** Il JSON salvato all'interno del file è una lista di oggetti 
 * e deve avere le seguenti caratteristiche:
 * 1. Deve essere un array
 * 2. Ogni oggetto deve avere un ID univoco
 * 3. "fileUrl" è l'url del file su disco
 * es:
 * [
 *  { id: 1, key: value, key2: value, ... },
 *  { id: 2, key: value, key2: value, ... }
 * ]
 */

function Entity(fileUrl){
    this.DB_FILE_URL = fileUrl;
    
    /** Funzione che riceve come parametro un URL di uno specifico 
     * file di testo JSON e restituisce il contenuto json del
     * file come un object JavaScript
     */
    this.read = function readDb(){
        const userFile = fs.readFileSync(this.DB_FILE_URL);
        // return JSON.parse(userFile);
        try {
            entities = JSON.parse(userFile);
            return entities;
        }
        catch(e){
            this.write([]);
            return [];
        }
    }
    
    /** Funzione che riceve come parametro un object javascript e 
     * lo salva (sovrascrivendolo) all'interno di uno specifico 
     * file di testo in formato JSON
     */
    this.write = function writeDb(users){
        fs.writeFileSync(this.DB_FILE_URL,JSON.stringify(users));
    }

    /** Restituisce un elemento che ha come valore della proprietà ID
     *  il valore passato come parametro "id"  */
    this.getById = function getEntityById(id){
        const users = this.read();
        if(!users) {
            return null;
        }
        return users.find(u => u.id === parseInt(id))
    }
    
    /** Aggiunge un nuovo elemento all'array creado automaticamente un ID */
    this.create = function createEntity(newEntity){
        const entities = this.read();
        if(entities && entities.length > 0) {
            entities.sort( (a,b) => a.id < b.id ? -1 : 1 );
            newEntity = { id: (entities[entities.length - 1].id + 1), ...newEntity};
        }
        else {
            newEntity = { id: 1, ...newEntity};
        }
        entities.push(newEntity);
        this.write(entities);
        return newEntity;
    }
    
    /** Modifica un elemento esistente dell'array (tramite ID) 
     * e ordina la lista per ID crescente*/
    this.update = function updateEntity(newEntity){
        const entities = this.read();
        entityIndex = entities.findIndex(e => e.id === parseInt(newEntity.id));
        if(entityIndex === -1) {
            throw new Error('Entity not found');
        }
        entities[entityIndex] = newEntity;
        this.write(entities);
        return newEntity;
    }

    /** Elimina un elemento esistente dell'array (tramite ID) 
     * e lo restituisce una volta eliminato*/
    this.delete = function deleteEntity(id){
        const idToDelete = parseInt(id);
        const entities = this.read();
        const deletedEntity = entities.find(e => e.id === idToDelete);
        if(!deletedEntity) {
            throw new Error('Entity not found');
        }
        const newEntities = entities.filter(e => e.id !== idToDelete);
        this.write(newEntities);
        return deletedEntity;
    }
    
    /** Filtra l'array basandosi che ha come 
     * valore della chiave "key" e che ha "value" all'interno del valore di quella chiave (case insensitive)
     * ES: key = 'name', value = 'dani' --> { .... name: 'Daniel  .... }
     * */
    this.filterByKeyAndValue = function filterEntityByKeyAndValue(key,value){
        if(!key || !value) {
            return [];
        }
        const entities = this.read();
        let regex = new RegExp(value, 'i');
        const filteredEntities = entities.filter(e => {
            return e[key] ? e[key].search(regex) != -1 ? true : false : false; 
        });
        return filteredEntities;
    }

}

module.exports = Entity;