//modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const module_enigmes = require('./module_enigmes');
const { stringify } = require('qs');
//constantes
const port = 3000;
const dossierEnigmes = 'enigmes';

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.static(path.join(__dirname, dossierEnigmes)));

//module questions
module_enigmes.ajouterEnigme("militaire", "Est-ce une arme ?", ["oui", "non", "je sais pas"], 2, "ceci est l'explication", "cat1/qu1/image.jpg");
module_enigmes.ajouterEnigme("religion", "Est-ce une religion ?", ["oui", "non", "je sais pas"], 1, "ceci est l'explication", "cat1/qu2/image.jpg");


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

    res.send(enigme.id.toString());
});

//main
app.listen(port, () => console.log(`Listening on port ${port}...`));