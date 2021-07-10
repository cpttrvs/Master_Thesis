#!/bin/bash

cd /home/pi/Aenigmata
killall node ; node /home/pi/Aenigmata/serveur.js | firefox localhost:3000
