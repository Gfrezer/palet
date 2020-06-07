const db = require('../model/queries')

//READ A l'apppel du serveur
exports.read = (req, res) => {
    db.query('SELECT * FROM equipe order by id desc', (error, results) => {
        //Compteur de parties
        let count = 0;
        results.rows.forEach(ligne => {
            if (ligne.partietermine === false) {
                count++;
            }
        })
        if (error) {
            throw error
        }
        db.query('SELECT eqp1, eqp2, id_parties FROM manches', (error, resultas) => {
            let model = [];
            results.rows.forEach(partie => {
                let mancheAtrouve = null;
                resultas.rows.forEach(manche => {
                    let idManche = manche.id_parties
                    if (idManche === partie.id) {
                        mancheAtrouve = manche
                    }
                })

                model.push({
                    id: partie.id,
                    equipe1: partie.equipe1,
                    equipeAdverse: partie.equipe2,
                    score1: partie.score1,
                    score2: partie.score2,
                    // manche1: mancheAtrouve.eqp1,
                    //manche2: mancheAtrouve.eqp2,
                    partietermine: partie.partietermine,
                })
            })
            if (error) {
                throw error
            }
            res.render("partieDePalet", {
                model: model,
                count: count
            })
        })
    })
}


//CREATE LIGNE EQUIPES
exports.create = (data, app, wss) => {
    //INSERTION DANS LA BDD
    db.query('INSERT INTO equipe (equipe) VALUES ($1) RETURNING id', [data.equipe], (error, results) => {
        if (error) {
            throw error
        }
        let id = results.rows[0].id
        db.query('select * from equipe order by random() limit 1', (error1, results1) => {

            if (error1) {
                throw error1
            }
            equipeAdverse = results1.rows[0].equipe

            //initilaise les manches à zero à la creation de la partie
            let partietermine = false
            let eqp1 = 0
            let eqp2 = 0

            //id = results2.rows[0].max
            db.query('INSERT INTO manches (id_parties,eqp1,eqp2) VALUES ($1,$2,$3) ', [id, eqp1, eqp2], (error3, results3) => {
                if (error3) {
                    throw error3
                }

                db.query('INSERT INTO parties (equipe1, equipe2, partietermine) VALUES ($1,$2,$3)', [data.equipe, equipeAdverse, partietermine], (error4, result4) => {
                    if (error4) {
                        throw error4
                    }
                })
                //CALLBACK HTML
                app.render("ligne", {
                    layout: false,
                    id: id,
                    equipe1: data.equipe,
                    equipeAdverse: equipeAdverse,
                    manche1: eqp1,
                    manche2: eqp2
                }, function (err, html) {
                    if (err) {
                        console.log(err)
                    }
                    let str = JSON.stringify({
                        ajoutDeLigne: html,
                        type: data.type,
                    })
                    wss.clients.forEach(client => client.send(str));
                })
            })

        })
    });
}

//DELETE
exports.delete = (data, wss) => {
    const id = parseInt(data.id)
    db.query('DELETE FROM parties WHERE id = $1', [data.id], (error) => {
        if (error) {
            throw error
        }
        const str = JSON.stringify({
            id: id,
            type: data.type
        })
        wss.clients.forEach(client => client.send(str));
    })
};



// AJOUT des SCORES AJOUT des MANCHES et TERMINER LA PARTIE
exports.ajoutScores = (data, wss) => {
    let dataNb_id = parseInt(data.id)
    db.query('UPDATE parties SET  partietermine = $1,score1 = $2 , score2 = $3 where id = $4 ',
        [data.partietermine, data.score1, data.score2, dataNb_id],
        (error) => {
            if (error) {
                throw error
            }

            if ((data.score1 >= 13) || (data.score2 >= 13)) {
                db.query('UPDATE manches  SET eqp1 = $1, eqp2 = $2, partie_termine = $3 where id_parties = $4',
                    [data.pointEqp1, data.pointEqp2, data.partietermine, dataNb_id],
                    (error) => {
                        if (error) {
                            throw error
                        }
                    })
            }
            const str = JSON.stringify({
                id: "btn-" + data.id,
                type: data.type,
                score1: data.score1,
                score2: data.score2,
                pointEqp1: data.pointEqp1,
                pointEqp2: data.pointEqp2,
                partietermine: data.partietermine
            })
            wss.clients.forEach(client => client.send(str));

        })
}