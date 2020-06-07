const express = require('express');
const hbs = require("hbs");
const app = express();
const bodyParser = require('body-parser');
const WebSocket = require('ws');
//controllers
const partieCrud = require("./controllers/partiesCrud")
const joueurProfil = require("./controllers/joueurProfil")
const afficheEquipeTableau = require("./controllers/afficheEquipeTableau")
//lien messages
const MODIF_SCORES = "modifDesScores"
const PARTIE_SUPPRIMEE = "partieclientSupprime"
const PARTIE_CREE = "partieCréée"
const JOUEUR_CREE = "joueurCréé"
const EQUIPE_CREE = "equipeCréé"
//require
const controllerCreateEquipe = require("./controllers/controllerCreateEquipe")

app.set("view engine", "hbs")
hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static(__dirname + '/public'));


app.use(bodyParser.urlencoded({
    extended: true,
}))
app.use(bodyParser.json())
//ROUTE READ A L'APPEL DU SERVEUR
app.get("/", partieCrud.read);
const port = 4800
app.get("/createEquipe", function (req, res) {
    res.render("createEquipe")
})

app.get("/formEquipeJoueur")
app.post("/formEquipeJoueur", controllerCreateEquipe)
//WEBSOCKET
const wss = new WebSocket.Server({
    server: app.listen(port)
});
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('onclose', () => console.log('Client disconnected'));
    ws.on('message', (message) => {
        let data = JSON.parse(message)

        switch (data.type) {
            case PARTIE_CREE:
                partieCrud.create(data, app, wss)
                break;
            case PARTIE_SUPPRIMEE:
                partieCrud.delete(data, wss)
                break;
            case MODIF_SCORES:
                partieCrud.ajoutScores(data, wss)
                break;
            case JOUEUR_CREE:
                joueurProfil.joueurCree(data, wss)
                break;
            case EQUIPE_CREE:
                controllerCreateEquipe.equipe(data, wss)
                break;
        }
    })
});
console.log("L'application est disponible à l'adresse: http:// localhost:" + port)
//helper handlebars pour valider la condition score plus grand
hbs.registerHelper('estPlusGrand', function (score1, score2) {
    return score1 > score2;
});