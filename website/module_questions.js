class QuestionItem
{
    constructor(id, categorie, question, reponses, indexCorrecte, explication, cheminImage) 
    {
        this.id = id;
        this.categorie = categorie;
        this.question = question;

        this.reponses = [
            {name: reponses[0], value: indexCorrecte==1},
            {name: reponses[1], value: indexCorrecte==2},
            {name: reponses[2], value: indexCorrecte==3},
        ]

        this.explication = explication;
        this.cheminImage = cheminImage;

        this.reponseCorrecte = reponses[indexCorrecte];
    };
};

var currentIndex = 0;
var questions = [];
exports.questions = questions;

exports.addQuestion = function(categorie, question, reponses, indexCorrecte, explication, cheminImage)
{
    let newQuestion = new QuestionItem(questions.length+1, categorie, question, reponses, indexCorrecte, explication, cheminImage);
    questions.push(newQuestion);
}

exports.getFirstQuestion = function()
{
    let firstQuestion = questions[0];

    if(firstQuestion === null) return null;

    for(var i = 0; i < questions.length; i++){
        if(questions[i].id < firstQuestion) {
            firstQuestion = questions[i];
        }
    }
    
    return firstQuestion;
};

exports.getQuestion = function(index)
{
    if(index < 0 || index > (questions.length+1))
    {
        throw new Error("getQuestion(" + index + "): hors des limites. Nombre de questions: " + questions.length);
    }

    return questions.find(q => q.id === parseInt(index));
}

exports.getCurrentIndex = function() {
    return currentIndex;
}