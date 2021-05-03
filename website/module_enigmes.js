// modules
const path = require('path');
const yaml = require('yaml');
const fs = require('fs');
const recursive = require('recursive-readdir');

// definitions
class Enigme
{
    constructor(id, categorie, question, reponses, indexCorrecte, explication, cheminImage) 
    {
        this.id = id;
        this.categorie = categorie;
        this.question = question;

        this.reponses = [
            {name: reponses[0], value: indexCorrecte=="A"},
            {name: reponses[1], value: indexCorrecte=="B"},
            {name: reponses[2], value: indexCorrecte=="C"},
        ]

        this.explication = explication;
        this.cheminImage = cheminImage;

        this.reponseCorrecte = reponses[indexCorrecte];
    };
};

var indexCourant = 0;
var enigmes = [];
exports.enigmes = enigmes;

// fonctions
var ajouterEnigme = function(categorie, question, reponses, indexCorrecte, explication, cheminImage)
{
    let nouvelleEnigme = new Enigme(enigmes.length+1, categorie, question, reponses, indexCorrecte, explication, cheminImage);
    enigmes.push(nouvelleEnigme);
    console.log("module_enigmes: ajouterEnigme " + nouvelleEnigme.id); //JSON.stringify(nouvelleEnigme));
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

//gestion de fichier
var initialisation = false;
var extensionFichierEnigme = [".txt"];
var extensionFichierImage = [".jpg", ".png", ".jpeg", ".gif"];

exports.initialiserDossier = function(dossier)
{
    if(initialisation) return;
    initialisation = true;

    var fichiersEnigme = [];
    var fichiersImage = [];
    
    recursive(dossier, function(err, fichiers) 
    {
        //console.log(fichiers);
        fichiers.forEach(function(fichier) 
        {
            if(extensionFichierEnigme.includes(path.extname(fichier).toLowerCase()))
            {
                //console.log("\t" + fichier + " path: " + cheminFichier + " " + path.extname(fichier));

                fichiersEnigme.push(fichier);           
            }

            if(extensionFichierImage.includes(path.extname(fichier).toLowerCase()))
            {
                fichiersImage.push(fichier);    
            }
        })

        console.log("module_enigme: initialiserDossier, fichiersEnigme");
        console.log(fichiersEnigme);
        console.log("module_enigme: initialiserDossier, fichiersImage");
        console.log(fichiersImage);

        fichiersEnigme.forEach(function(fichier) 
        {
            let existe = false;
            let pathFichier = path.dirname(fichier);
            fichiersImage.forEach(function(image)
            {
                if(pathFichier == path.dirname(image))
                {                
                    if(!existe)
                    {
                        //yaml
                        let contenu = yaml.parse(fs.readFileSync(fichier, 'utf8'));
        
                        ajouterEnigme(
                            contenu.categorie, 
                            contenu.question, 
                            [contenu.A, contenu.B, contenu.C], 
                            contenu.juste, 
                            contenu.explication, 
                            image.replace(dossier, ''));
                        
                        existe = true;
                    } else {
                        console.log("module_enigme: initialiserDossier, plusieurs images trouvées pour une énigme: " + fichier);
                    }
                } 
            });
        });

    });
};