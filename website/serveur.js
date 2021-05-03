//modules
const express = require('express');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');

const module_enigmes = require('./module_enigmes');

//constantes
const port = 3000;
const dossierEnigmes = 'enigmes';

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, dossierEnigmes)));

//module questions
module_enigmes.initialiserDossier(dossierEnigmes);
//module_enigmes.ajouterEnigme("militaire", "Est-ce une arme ?", ["oui", "non", "je sais pas"], 2, "ceci est l'explication", "cat1/qu1/image.jpg");
//module_enigmes.ajouterEnigme("religion", "Est-ce une religion ?", ["oui", "non", "je sais pas"], 1, "ceci est l'explication", "cat1/qu2/image.jpg");


//get
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

//main
app.listen(port, () => console.log(`Listening on port ${port}...`));