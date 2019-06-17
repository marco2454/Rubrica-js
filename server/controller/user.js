let Entity = require('../lib/entity');

DB_FILE_URL = './db/users.json';

entity = new Entity(DB_FILE_URL);

// GET ALL
exports.getAll = (req, res, next) => {
    // const users = readDb();
    const users = entity.read();
    res.json(users);
};

// GET BY ID
exports.getById = (req, res, next) => {
    const idToFind = req.params.id;
    const user = entity.getById(idToFind);
    res.json(user ? user : null);
};

// CREATE
exports.create = (req, res, next) => {
    const newUser = req.body;
    const createdUser = entity.create(newUser);
    res.json(createdUser);
};

// UPDATE
exports.update = (req, res, next) => {
    let newUser = req.body;
    const idToUpdate = req.params.id;
    newUser = { ...newUser, id: parseInt(idToUpdate)}
    const updatedUser = entity.update(newUser);
    res.json(updatedUser);
};

// DELETE
exports.delete = (req, res, next) => {
    const idToDelete = req.params.id;
    const deletedUser = entity.delete(idToDelete);
    if(!deletedUser) {
        res.json(null);
        // throw new Error("User not found!");
        return;
    }
    res.json(deletedUser);
};

// SEARCH --> ES: ?key=name&value=daniel
exports.filter = (req, res, next) => {
    const { key, value} = req.query;
    const filteredUsers = entity.filterByKeyAndValue(key,value);
    res.json(filteredUsers);
};