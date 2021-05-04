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
app.use(express.static(path.join(__dirname, dossierEnigmes)));

module_enigmes.initialiserDossier(dossierEnigmes);
module_raspberry.initialisationGPIO();
//module_enigmes.ajouterEnigme("militaire", "Est-ce une arme ?", ["oui", "non", "je sais pas"], 2, "ceci est l'explication", "cat1/qu1/image.jpg");
//module_enigmes.ajouterEnigme("religion", "Est-ce une religion ?", ["oui", "non", "je sais pas"], 1, "ceci est l'explication", "cat1/qu2/image.jpg");


//routes
app.get('/', (req, res) => {
    console.log("----ROUTING: home----");

    let enigme = module_enigmes.recevoirPremiereEnigme();

    if(!enigme) {
        res.status(404).send('Il n\'y a aucune enigme');
    }

    res.render('pages/index', {
        id: enigme.id,
        categorie: enigme.categorie,
        question: enigme.question,
        explication: enigme.explication,
        reponses: enigme.reponses,
        cheminImage: enigme.cheminImage
    });

    //console.log(enigme);
});

app.get('/:id', (req, res) => {
    //prevent favicon as id
    if(req.params.id === "favicon.ico") { return res.sendStatus(204); }


    console.log("----ROUTING: id:" + req.params.id +"----");

    let enigme = module_enigmes.recevoirEnigme(parseInt(req.params.id));

    if(!enigme) {
        res.status(404).send('L\'enigme ' + req.params.id + ' n\'existe pas');
    }

    res.render('pages/index', {
        id: enigme.id,
        categorie: enigme.categorie,
        question: enigme.question,
        explication: enigme.explication,
        reponses: enigme.reponses,
        cheminImage: enigme.cheminImage
    });
    
    console.log(enigme);
});

app.post('/suivant', (req, res) => {
    console.log("----ROUTING: suivant----");

    let enigme = module_enigmes.recevoirProchaineEnigme();

    if(!enigme) {
        res.status(404).send('L\'enigme ' + req.params.id + ' n\'existe pas');
    }

    res.send({
        id: enigme.id,
        categorie: enigme.categorie,
        question: enigme.question,
        explication: enigme.explication,
        reponses: enigme.reponses,
        cheminImage: enigme.cheminImage
    });
});

//events module_raspberry
module_raspberry.eventManager.on(module_raspberry.eventCapteurA, function(valeur) {
    console.log("[EVENT] " + module_raspberry.eventCapteurA + " = " + valeur);

    if(valeur)
    {
        io.emit('capteur', 'A');
    }
});
module_raspberry.eventManager.on(module_raspberry.eventCapteurB, function(valeur) {
    console.log("[EVENT] " + module_raspberry.eventCapteurB + " = " + valeur);

    if(valeur)
    {
        io.emit('capteur', 'B');
    }
});
module_raspberry.eventManager.on(module_raspberry.eventCapteurC, function(valeur) {
    console.log("[EVENT] " + module_raspberry.eventCapteurC + " = " + valeur);

    if(valeur)
    {
        io.emit('capteur', 'C');
    }
});

//events socket.io
io.on('connection', (socket) => {
    console.log("----Connexion client: " + socket.id + "----");
});

//-----------------------
server.listen(port, () => console.log(`Listening on port ${port}...`));

process.on('SIGINT', _ => {
    module_raspberry.unexportGPIO();   
    
    console.log("----ARRET----");
    process.exit(0); 
});