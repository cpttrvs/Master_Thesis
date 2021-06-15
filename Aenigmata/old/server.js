let http = require('http');
let fs = require('fs');
let mq = require('./module_questions');

let handleRequest = (request, response) => {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    fs.readFile('./index.html', null, function (error, data) {
        if (error) {
            response.writeHead(404);
            respone.write('Erreur: Le fichier index.html n\'a pas été trouvé !');
        } else {
            response.write(data);
        }
        response.end();
    });
};

http.createServer(handleRequest).listen(8000);

console.log('-------------------\n---Serveur lancé---\n-------------------');


let recursive = require("recursive-readdir");
recursive("./questions", function (err, files) {
    console.log(files);
});
