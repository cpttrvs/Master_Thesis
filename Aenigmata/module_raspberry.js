//modules
const gpio = require('onoff').Gpio;
const events = require('events');

//defintions
const pinCapteurA = 17;
const pinCapteurB = 27;
const pinCapteurC = 22;

const capteurA = new gpio(pinCapteurA, 'in', 'both');
const capteurB = new gpio(pinCapteurB, 'in', 'both');
const capteurC = new gpio(pinCapteurC, 'in', 'both');

var statusCapteurA = false;
var statusCapteurB = false;
var statusCapteurC = false;

const eventManager = new events.EventEmitter();
const eventCapteurA = "capteurA";
const eventCapteurB = "capteurB";
const eventCapteurC = "capteurC";

module.exports = 
{
    eventManager: eventManager,
    eventCapteurA: eventCapteurA,
    eventCapteurB: eventCapteurB,
    eventCapteurC: eventCapteurC,
    initialisationGPIO,
    unexportGPIO
};

var initilisation = false;

//fonctions
function initialisationGPIO() 
{
    if(initilisation) return;
    initilisation = true;

    capteurA.watch((err, value) => {
        if(err){throw err;}

        console.log("module_rapsberry: --capteurA: " + value);

        //emettre uniquement si il y'a une variation de signal (de 0 à 1 ou inversement)
        if(value == 0 && statusCapteurA == false) 
        { 
            statusCapteurA = true; 
            eventManager.emit('capteurA', statusCapteurA);
        } 

        if(value == 1 && statusCapteurA == true) 
        { 
            statusCapteurA = false; 
            eventManager.emit('capteurA', statusCapteurA);
        }
    });

    capteurB.watch((err, value) => {
        if(err){throw err;}

        console.log("module_rapsberry: --capteurB: " + value);

        //emettre uniquement si il y'a une variation de signal (de 0 à 1 ou inversement)
        if(value == 0 && statusCapteurB == false) 
        { 
            statusCapteurB = true; 
            eventManager.emit('capteurB', statusCapteurB);
        } 

        if(value == 1 && statusCapteurB == true) 
        { 
            statusCapteurB = false; 
            eventManager.emit('capteurB', statusCapteurB);
        }
    });

    capteurC.watch((err, value) => {
        if(err){throw err;}

        console.log("module_rapsberry: --capteurC: " + value);

        //emettre uniquement si il y'a une variation de signal (de 0 à 1 ou inversement)
        if(value == 0 && statusCapteurC == false) 
        { 
            statusCapteurC = true; 
            eventManager.emit('capteurC', statusCapteurC);
        } 

        if(value == 1 && statusCapteurC == true) 
        { 
            statusCapteurC = false; 
            eventManager.emit('capteurC', statusCapteurC);
        }
    });

    console.log("module_rapsberry: initialisé");
};

//-------------------------
function unexportGPIO() 
{
    capteurA.unexport();
    capteurB.unexport();
    capteurC.unexport();
    
    console.log("module_rapsberry: unexportGPIO");
};