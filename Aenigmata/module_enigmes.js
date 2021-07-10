// modules
const path = require('path');
const yaml = require('yaml');
const fs = require('fs');
const recursive = require('recursive-readdir');

// definitions
class Enigme
{
    constructor(id, cheminImage, cheminVideo, indexCorrecte,
                categorie, question, reponses, explication,
                categorieDE, questionDE, reponsesDE, explicationDE,
                categorieEN, questionEN, reponsesEN, explicationEN) 
    {
        this.id = id;
        this.cheminImage = cheminImage;
        this.cheminVideo = cheminVideo;
        this.reponseCorrecte = reponses[indexCorrecte];
        
        //FR
        this.categorie = categorie;
        this.question = question;

        this.reponses = [
            {name: reponses[0], value: indexCorrecte=="A"},
            {name: reponses[1], value: indexCorrecte=="B"},
            {name: reponses[2], value: indexCorrecte=="C"},
        ]

        this.explication = explication;

        //DE
        this.categorieDE = categorieDE;
        this.questionDE = questionDE;
        
        this.reponsesDE = [
            {name: reponsesDE[0], value: indexCorrecte=="A"},
            {name: reponsesDE[1], value: indexCorrecte=="B"},
            {name: reponsesDE[2], value: indexCorrecte=="C"},
        ]

        this.explicationDE = explicationDE;
        
        //EN
        this.categorieEN = categorieEN;
        this.questionEN = questionEN;
        
        this.reponsesEN = [
            {name: reponsesEN[0], value: indexCorrecte=="A"},
            {name: reponsesEN[1], value: indexCorrecte=="B"},
            {name: reponsesEN[2], value: indexCorrecte=="C"},
        ]

        this.explicationEN = explicationEN;
    };
};

var indexCourant = 0;
var enigmes = [];
exports.enigmes = enigmes;
var fichiersErreur = [];
exports.fichiersErreur = fichiersErreur;

// fonctions
var ajouterEnigme = function(cheminImage, cheminVideo, indexCorrecte,
                categorie, question, reponses, explication,
                categorieDE, questionDE, reponsesDE, explicationDE,
                categorieEN, questionEN, reponsesEN, explicationEN) 
{
    let nouvelleEnigme = new Enigme(enigmes.length+1, cheminImage, cheminVideo, indexCorrecte,
                categorie, question, reponses, explication,
                categorieDE, questionDE, reponsesDE, explicationDE,
                categorieEN, questionEN, reponsesEN, explicationEN);
                
    enigmes.push(nouvelleEnigme);
    console.log("module_enigmes: ajouterEnigme " + nouvelleEnigme.id);
};

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

exports.recevoirDerniereEnigme = function()
{
    console.log("module_enigmes: recevoirDerniereEnigme");

    let derniereEnigme = enigmes[enigmes.length - 1];

    if(derniereEnigme === null) return null;

    for(var i = 0; i < enigmes.length; i++){
        if(enigmes[i].id > derniereEnigme) {
            derniereEnigme = enigmes[i];
        }
    }
    
    indexCourant = derniereEnigme.id;

    console.log("derniere: " + indexCourant);
    return derniereEnigme;
}

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
};

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
};

exports.recevoirIndexCourant = function() {
    return indexCourant;
};

exports.recevoirNombreTotal = function () {
    return enigmes.length + 1;
};

//gestion de fichier
var initialisation = false;
var extensionFichierEnigme = [".txt"];
var extensionFichierImage = [".jpg", ".png", ".jpeg", ".gif"];
var extensionFichierVideo = [".mp4", ".ogv", ".ogg", ".webm"];
var nomFichierEnigmeFR = "enigme.txt";
var nomFichierEnigmeDE = "frage.txt";
var nomFichierEnigmeEN = "question.txt";

exports.initialiserDossier = function(dossier)
{
    if(initialisation) return;
    initialisation = true;

    var fichiersEnigmeFR = [];
    var fichiersEnigmeDE = [];
    var fichiersEnigmeEN = [];
    var fichiersImage = [];
    var fichiersVideo = [];
    
    recursive(dossier, function(err, fichiers) 
    {
        console.log(fichiers);
        fichiers.forEach(function(fichier) 
        {
            if(path.parse(fichier).base.lastIndexOf(".", 0) === 0)
            {
                console.log(fichier + " ignoré");
            } else {
                if(path.parse(fichier).base.toLowerCase() == nomFichierEnigmeFR)
                {
                    fichiersEnigmeFR.push(fichier);
                }
                
                if(path.parse(fichier).base.toLowerCase() == nomFichierEnigmeDE)
                {
                    fichiersEnigmeDE.push(fichier);
                }
                
                if(path.parse(fichier).base.toLowerCase() == nomFichierEnigmeEN)
                {
                    fichiersEnigmeEN.push(fichier);
                }
                
                /*
                if(extensionFichierEnigme.includes(path.extname(fichier).toLowerCase()))
                {
                    console.log("\t" + fichier);

                    fichiersEnigme.push(fichier);           
                }
                */

                if(extensionFichierImage.includes(path.extname(fichier).toLowerCase()))
                {
                    fichiersImage.push(fichier);    
                }
                
                if(extensionFichierVideo.includes(path.extname(fichier).toLowerCase()))
                {
                    fichiersVideo.push(fichier);
                }
            }
        })

        console.log("module_enigme: initialiserDossier, fichiersEnigmeFR");
        console.log(fichiersEnigmeFR);
        console.log("module_enigme: initialiserDossier, fichiersEnigmeDE");
        console.log(fichiersEnigmeDE);
        console.log("module_enigme: initialiserDossier, fichiersEnigmeEN");
        console.log(fichiersEnigmeEN);
        console.log("module_enigme: initialiserDossier, fichiersImage");
        console.log(fichiersImage);
        console.log("module_enigme: initialiserDossier, fichiersVideo");
        console.log(fichiersVideo);

        fichiersEnigmeFR.forEach(function(fichier) 
        {
            let pathFichier = path.dirname(fichier);
            
            let enigmeFR;
            let formatCorrecte = true;
            try{
                enigmeFR = yaml.parse(fs.readFileSync(fichier, 'utf8'));
            } catch (e) {
                console.log("!!!! ERREUR FICHIER: " + fichier);
                console.log(e);
                formatCorrecte = false;
                fichiersErreur.push(fichier);
            }
            
            if(formatCorrecte)
            {
                let imageExiste = false;
                let imageEnigme = "";
                
                fichiersImage.forEach(function(image)
                {
                    if(!imageExiste)
                    {                    
                        if(pathFichier == path.dirname(image))
                        {
                            imageEnigme = image.replace(dossier, '');
                            imageExiste = true;
                        }
                    }
                });
                
                let videoExiste = false;
                let videoEnigme = "";
                fichiersVideo.forEach(function(video)
                {
                    if(!videoExiste)
                    {
                        if(pathFichier == path.dirname(video))
                        {
                            videoEnigme = video.replace(dossier, '');
                            videoExiste = true;
                        }
                    }
                });
                
                let enigmeDEExiste = false;
                let enigmeDE = "";
                
                fichiersEnigmeDE.forEach(function(fichierDE)
                {
                    if(!enigmeDEExiste)
                    {
                        if(pathFichier == path.dirname(fichierDE))
                        {
                            enigmeDE = yaml.parse(fs.readFileSync(fichierDE, 'utf8'));
                            enigmeDEExiste = true;
                        }
                    }
                });
                
                let enigmeENExiste = false;
                let enigmeEN = "";
                
                fichiersEnigmeEN.forEach(function(fichierEN)
                {
                    if(!enigmeENExiste)
                    {
                        if(pathFichier == path.dirname(fichierEN))
                        {
                            enigmeEN = yaml.parse(fs.readFileSync(fichierEN, 'utf8'));
                            enigmeENExiste = true;
                        }
                    }
                });
                
                //YAML
                ajouterEnigme(imageEnigme, videoEnigme, enigmeFR.juste,
                    enigmeFR.categorie, enigmeFR.question, [enigmeFR.A, enigmeFR.B, enigmeFR.C], enigmeFR.explication,
                    enigmeDE.categorie, enigmeDE.question, [enigmeDE.A, enigmeDE.B, enigmeDE.C], enigmeDE.explication,
                    enigmeEN.categorie, enigmeEN.question, [enigmeEN.A, enigmeEN.B, enigmeEN.C], enigmeEN.explication); 
            }
        });

    });
};
