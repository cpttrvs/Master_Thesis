// en rapport avec les questions
var questions = [];
var indexActuel = 0;

function QuestionItem(categorie, question, reponses, indexCorrecte, explication, image) 
{
    this.categorie = categorie;
    this.question = question;
    this.reponses = reponses;
    this.indexCorrecte = indexCorrecte;
    this.explication = explication;
    this.image = image;

    this.reponseCorrecte = reponses[indexCorrecte];
};

function chargerQuestions(dossiers)
{

}

// en rapport avec la lecture des fichiers
function lireFichierTexte(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                alert(allText);
            }
        }
    }
    rawFile.send(null);
};

function getAllFilesFromFolder(dir) 
{
    var filesystem = require("fs");
    var results = [];

    filesystem.readdirSync(dir).forEach(function(file) {

        file = dir+'/'+file;
        var stat = filesystem.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(_getAllFilesFromFolder(file))
        } else results.push(file);

    });

    return results;

};

// en rapport avec l'affichage
let documentCategorie = document.querySelector('categorie');
let documentQuestion = document.querySelector('question');
let documentReponses = [
    document.querySelector('reponse.a'), 
    document.querySelector('reponse.b'), 
    document.querySelector('reponse.c')];
let documentExplication = document.querySelector('explication');
let documentIndex = document.querySelector('index');
let documentImage = document.getElementById('image');

function afficherQuestion(questionItem) 
{
    documentCategorie.textContent = questionItem.categorie;
    documentQuestion.textContent = questionItem.question;
    documentExplication.textContent = questionItem.explication;

    documentReponses[0].textContent = questionItem.reponses[0];
    documentReponses[1].textContent = questionItem.reponses[1];
    documentReponses[2].textContent = questionItem.reponses[2];
    documentReponses[questionItem.indexCorrecte].textContent = "*" + documentReponses[questionItem.indexCorrecte].textContent;

    documentImage.setAttribute('src', questionItem.image);

    documentIndex.textContent = questions.indexOf(questionItem);
}

function afficherQuestionSuivante()
{
    indexActuel = (indexActuel+1)%questions.length;
    this.afficherQuestion(indexActuel);
}

function afficherPremiereQuestion()
{
    indexActuel = 0;
    this.afficherQuestion(questions[indexActuel]);
}



questions.push(new QuestionItem("militaire", "Est-ce une arme ?", ["oui", "non", "je sais pas"], 2, "ceci est l'explication"));
questions.push(new QuestionItem("religion", "Est-ce une divinité ?", ["ah", "hmmm", "je pense"], 0, "ceci est l'explication"));

afficherQuestion(questions[1]);
//readTextFile('question.txt');



