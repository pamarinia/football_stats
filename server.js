const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const iconv = require('iconv-lite');

const app = express();
const PORT = 3000;

// Servir des fichiers statiques (pour votre index.html)
app.use(express.static('public'));

// API pour charger et traiter le fichier CSV
app.get('/public/data', (req, res) => {
    const results = [];
    fs.createReadStream('public/data/football_stat.csv') 
      .pipe(csv({
        separator: ';'}))
      .on('data', (data) => results.push(data))
      .on('end', () => {
        res.json(results); // Envoyer les données au client
      });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
