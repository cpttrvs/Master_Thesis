class Enigme
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

var indexCourant = 0;
var enigmes = [];
exports.enigmes = enigmes;

exports.ajouterEnigme = function(categorie, question, reponses, indexCorrecte, explication, cheminImage)
{
    let nouvelleEnigme = new Enigme(enigmes.length+1, categorie, question, reponses, indexCorrecte, explication, cheminImage);
    enigmes.push(nouvelleEnigme);
}

exports.recevoirPremiereEnigme = function()
{
    console.log("module_enigmes: recevoirPremiereEnigme");

    let premiereEnigme = enigmes[0];

    if(premiereEnigme === null) return null;

    for(var i = 0; i < enigmes.length; i++){
        if(enigmes[i].id < premiereEnigme) {
            premiereEnigme = enigmes[i];
        }
    }
    
    indexCourant = premiereEnigme.id;

    return premiereEnigme;
};

exports.recevoirEnigme = function(index)
{
    console.log("module_enigmes: recevoirEnigme " + index);

    if(index < 0 || index > (enigmes.length+1))
    {
        throw new Error("recevoirEnigme(" + index + "): hors des limites. Nombre d'enigmes: " + questions.length);
    }
    
    let enigme = enigmes.find(q => q.id === parseInt(index));

    if(enigme != null)
    {
        indexCourant = enigme.id;

        return enigme;
    }
}

exports.recevoirProchaineEnigme = function(index = indexCourant)
{
    console.log("module_enigmes: recevoirProchaineEnigme " + index + "+1");

    let nouvelIndex = index + 1;
    let enigme = null;
    
    if(index >= enigmes.length)
    {
        enigme = this.recevoirPremiereEnigme();
    } else 
    {
        enigme = this.recevoirEnigme(nouvelIndex);
    }

    return enigme;
}

exports.recevoirIndexCourant = function() {
    return indexCourant;
}