// Import librerie di terze parti
const express = require("express");
const app = express();
const bodyParser = require('body-parser');

// Import moduli interni
const userController = require('./controller/user');

// Variabili
const PORT = 3000;

// Gestisco i JSON
app.use(bodyParser.json());

// Abilito le richieste CORS (Cross origin)
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*"); //GET,POST,PATCH, PUT, DELETE, OPTIONS
    
    if ('OPTIONS' === req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
    
  });

// User Web API endpoints
app.get('/api/users', userController.getAll);
app.get('/api/users/:id', userController.getById);
app.post('/api/users', userController.create);
app.put('/api/users/:id', userController.update);
app.delete('/api/users/:id', userController.delete);
app.get('/api/users-filter', userController.filter);

// Home page
app.get('/', function(request, response){
    response.sendFile(__dirname +'/index.html');
});

app.all('*',function(){
    throw new Error('endpoint not found');
});

// Gestisco gli errori del server trasformandoli in JSON da restituire alle api
app.use(function (error, req, res, next) {
    res.statusMessage = error.message;
    res.status(500).json({ message: error.message });
});

// Rimango in ascolto sulla porta PORT di localhost
app.listen(PORT, () => {
    console.log('Express server listening on http://localhost:' + PORT);
})

