//modules
const express = require('express');
const path = require('path');
const app = express();
const module_questions = require('./module_questions');
//constantes
const port = 3000;
const questionsFolder = 'questions';

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, questionsFolder)));

//module questions
module_questions.addQuestion("militaire", "Est-ce une arme ?", ["oui", "non", "je sais pas"], 2, "ceci est l'explication", "cat1/qu1/image.jpg");
module_questions.addQuestion("religion", "Est-ce une religion ?", ["oui", "non", "je sais pas"], 1, "ceci est l'explication", "cat1/qu2/image.jpg");


//get
app.get('/', (req, res) => {
    let question = module_questions.getFirstQuestion();

    if(!question) {
        res.status(404).send('Il n\'y a aucune question');
    }

    res.render('pages/index', {
        id: question.id,
        categorie: question.categorie,
        question: question.question,
        explication: question.explication,
        reponses: question.reponses,
        cheminImage: question.cheminImage
    });
    console.log(question);
});

app.get('/:id', (req, res) => {
    let question = module_questions.getQuestion(parseInt(req.params.id));

    if(!question) {
        res.status(404).send('La question ' + req.params.id + ' n\'existe pas');
    }

    res.render('pages/index', {
        id: question.id,
        categorie: question.categorie,
        question: question.question,
        explication: question.explication,
        reponses: question.reponses,
        cheminImage: question.cheminImage
    });
    console.log(question);
});

//post


//main
app.listen(port, () => console.log(`Listening on port ${port}...`));