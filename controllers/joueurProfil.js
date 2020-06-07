const db = require('../model/queries')

//CREATE JOUEUR

exports.joueurCree = (data, app, wss) => {
    db.query('INSERT INTO joueur (nom, prenom) VALUES ($1,$2)', [data.nom, data.prenom], (error, results) => {
        if (error) {
            throw error
        }
    })

}