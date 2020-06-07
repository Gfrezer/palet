const db = require('../model/queries')

function createEquipeEtJoueur(res, idEquipe, noms, prenoms, index) {
    if (index < noms.length) {
        let nom = noms[index]
        let prenom = prenoms[index]
        db.query('select * from joueur where nom = $1 and prenom = $2', [nom, prenom], (error2, results1) => {
            if (error2) {
                throw error2
            }
            if (results1.rows.length === 0) {
                db.query('INSERT INTO joueur (nom,prenom) VALUES ($1,$2) RETURNING id', [nom, prenom], (error3, results2) => {
                    if (error3) {
                        throw error3
                    }
                    db.query('INSERT INTO equipe_joueur (id_equipe, id_joueur) VALUES ($1, $2)', [idEquipe, results2.rows[0].id], (error4, results) => {
                        if (error4) {
                            throw error4
                        }
                    })
                })
            } else {
                db.query('INSERT INTO equipe_joueur (id_equipe, id_joueur) VALUES ($1, $2)', [idEquipe, results1.rows[0].id], (error4, results) => {

                    if (error4) {
                        throw error4
                    }
                })
            }

            createEquipeEtJoueur(res, idEquipe, noms, prenoms, index + 1)
        })

    }
    if (index >= 3) {
        res.redirect("afficheEquipe")

    }
}

module.exports = (req, res) => {
    let nomEquipe = req.body.nomEquipe;
    let noms = req.body.nom;
    let prenoms = req.body.prenom

    db.query('INSERT INTO equipe (equipe) VALUES ($1) RETURNING id', [nomEquipe], (error, results) => {
        if (error) {
            throw error
        }

        createEquipeEtJoueur(res, results.rows[0].id, noms, prenoms, 0)


    })
}