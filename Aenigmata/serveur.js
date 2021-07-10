//modules
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

const server = require('http').Server(app);
const io = require('socket.io')(server);

const module_enigmes = require('./module_enigmes');
const module_raspberry = require('./module_raspberry');

//constantes
const port = 3000;
const dossierEnigmes = 'enigmes';

//initialisation
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, "./" + dossierEnigmes)));

module_enigmes.initialiserDossier(dossierEnigmes);
module_raspberry.initialisationGPIO();

//routes
app.get('/', (req, res) => {
    console.log("----ROUTING: home----");

    let enigme = module_enigmes.recevoirDerniereEnigme();

    if(!enigme) {
        res.status(404).send('Il n\'y a aucune enigme');
    }
    
    let nombreEnigmes = module_enigmes.recevoirNombreTotal();
    let fichiersErreur = module_enigmes.fichiersErreur;
    console.log(fichiersErreur);

    res.render('pages/index', {
        id: enigme.id,
        total: nombreEnigmes,
        cheminImage: enigme.cheminImage,
        cheminVideo: enigme.cheminVideo,
        
        categorie: enigme.categorie,
        categorieDE: enigme.categorieDE,
        categorieEN: enigme.categorieEN,
        
        question: enigme.question,
        questionDE: enigme.questionDE,
        questionEN: enigme.questionEN,
        
        explication: enigme.explication,
        explicationDE: enigme.explicationDE,
        explicationEN: enigme.explicationEN,
        
        reponses: enigme.reponses,
        reponsesDE: enigme.reponsesDE,
        reponsesEN: enigme.reponsesEN,
        
        fichiersErreur: fichiersErreur,
    });

    console.log(enigme);
});

app.get('/:id', (req, res) => {
    //prevent favicon as id
    if(req.params.id === "favicon.ico") { return res.sendStatus(204); }


    console.log("----ROUTING: id:" + req.params.id +"----");

    let enigme = module_enigmes.recevoirEnigme(parseInt(req.params.id));

    if(!enigme) {
        res.status(404).send('L\'enigme ' + req.params.id + ' n\'existe pas');
    }
    
    let nombreEnigmes = module_enigmes.recevoirNombreTotal();
    let fichiersErreur = module_enigmes.fichiersErreur;
    console.log(fichiersErreur);

    res.render('pages/index', {
        id: enigme.id,
        total: nombreEnigmes,
        cheminImage: enigme.cheminImage,
        cheminVideo: enigme.cheminVideo,
        
        categorie: enigme.categorie,
        categorieDE: enigme.categorieDE,
        categorieEN: enigme.categorieEN,
        
        question: enigme.question,
        questionDE: enigme.questionDE,
        questionEN: enigme.questionEN,
        
        explication: enigme.explication,
        explicationDE: enigme.explicationDE,
        explicationEN: enigme.explicationEN,
        
        reponses: enigme.reponses,
        reponsesDE: enigme.reponsesDE,
        reponsesEN: enigme.reponsesEN,
        
        fichiersErreur : fichiersErreur,
    });
    
    console.log(enigme);
});

app.post('/suivant', (req, res) => {
    console.log("----ROUTING: suivant----");

    let enigme = module_enigmes.recevoirProchaineEnigme();

    if(!enigme) {
        res.status(404).send('L\'enigme ' + req.params.id + ' n\'existe pas');
    }
    
    let nombreEnigmes = module_enigmes.recevoirNombreTotal();
    let fichiersErreur = module_enigmes.fichiersErreur;
    console.log(fichiersErreur);

    res.send({
        id: enigme.id,
        total: nombreEnigmes,
        cheminImage: enigme.cheminImage,
        cheminVideo: enigme.cheminVideo,
        
        categorie: enigme.categorie,
        categorieDE: enigme.categorieDE,
        categorieEN: enigme.categorieEN,
        
        question: enigme.question,
        questionDE: enigme.questionDE,
        questionEN: enigme.questionEN,
        
        explication: enigme.explication,
        explicationDE: enigme.explicationDE,
        explicationEN: enigme.explicationEN,
        
        reponses: enigme.reponses,
        reponsesDE: enigme.reponsesDE,
        reponsesEN: enigme.reponsesEN,
        
        fichiersErreur : fichiersErreur,
    });
});

//events module_raspberry
module_raspberry.eventManager.on(module_raspberry.eventCapteurA, function(valeur) {
    console.log("[EVENT] " + module_raspberry.eventCapteurA + " = " + valeur);

    if(valeur)
    {
        io.emit('capteurON', 'A');
    } else {
        io.emit('capteurOFF', 'A');
    }
});
module_raspberry.eventManager.on(module_raspberry.eventCapteurB, function(valeur) {
    console.log("[EVENT] " + module_raspberry.eventCapteurB + " = " + valeur);

    if(valeur)
    {
        io.emit('capteurON', 'B');
    } else {
        io.emit('capteurOFF', 'B');
    }
});
module_raspberry.eventManager.on(module_raspberry.eventCapteurC, function(valeur) {
    console.log("[EVENT] " + module_raspberry.eventCapteurC + " = " + valeur);

    if(valeur)
    {
        io.emit('capteurON', 'C');
    } else {
        io.emit('capteurOFF', 'C');
    }
});
module_raspberry.eventManager.on(module_raspberry.eventCapteurLangue, function(valeur) {
    console.log("[EVENT] " + module_raspberry.eventCapteurLangue + " = " + valeur);

    if(valeur)
    {
        io.emit('capteurON', 'Langue');
    } else {
        io.emit('capteurOFF', 'Langue');
    }
});

//events socket.io
io.on('connection', (socket) => {
    console.log("----Connexion client: " + socket.id + "----");
});

//-----------------------
server.listen(port, () => console.log(`Listening on port ${port}...`));

process.on('SIGINT', _ => {
    console.log("----ARRET----");
    module_raspberry.unexportGPIO();   
    process.exit(0); 
});
