//CREATION D'UNE NOUVELLE PARTIE
const createEquipe = function () {
    let equipe = document.getElementById("equipe").value
    //
    document.getElementById("equipe").value = ""
    const nomEquipe = document.querySelector("h4.nomDeLequipe")
    nomEquipe.innerHTML = "nom de l'équipe: " + equipe

    const inputNomEquipe = document.querySelector("input[name='nomEquipe']")
    inputNomEquipe.value = equipe
    location.href = '#open-modal-joueur-equipe'

}


//SUPPRIMER UNE PARTIE 
const supprimePartie = function (element) {
    //Recuperation l'id de la partie et l'envoyer dans la requete websocket
    const idPartie = element.closest("tr").getAttribute("data-id");
    //Envoie sur le serveur pour les websockets
    let str = JSON.stringify({
        id: idPartie,
        type: PARTIE_SUPPRIMEE
    })
    ws.send(str)
}


//Validez les scores en cours + ajout des manches + terminer la partie avec "boutton validez"

const valideButton = function (button) {
    const trButton = button.closest("tr")
    const idButton = trButton.getAttribute("data-id");
    let score1 = trButton.querySelector(".inputJ1").value
    let score2 = trButton.querySelector(".inputJ2").value
    //Equipe 1 Manche
    let eqp1MancheGagne = trButton.querySelector(".eqp1").value
    //Equipe 2 Manche
    let eqp2MancheGagne = trButton.querySelector(".eqp2").value
    score1 = parseInt(score1)
    score2 = parseInt(score2)
    //if ajout de scores
    if ((score1 < 13) && (score2 < 13)) {
        let str = JSON.stringify({
            id: idButton,
            score1: score1,
            score2: score2,
            type: MODIF_SCORES,
            pointEqp1: eqp1MancheGagne,
            pointEqp2: eqp2MancheGagne
        })
        ws.send(str)
    }

    //if ajout de scores et ajout d'une manche à l'équipe gagnante

    if (score1 >= 13) {
        ++eqp1MancheGagne;
        let str = JSON.stringify({
            id: idButton,
            id_parties: idButton,
            score1: score1,
            score2: score2,
            type: MODIF_SCORES,
            pointEqp1: eqp1MancheGagne,
            pointEqp2: eqp2MancheGagne
        })
        ws.send(str)

    }
    if (score2 >= 13) {
        ++eqp2MancheGagne;
        let str = JSON.stringify({
            id: idButton,
            id_parties: idButton,
            score1: score1,
            score2: score2,
            type: MODIF_SCORES,
            pointEqp1: eqp1MancheGagne,
            pointEqp2: eqp2MancheGagne
        })
        ws.send(str)
    }

}











//RECUP LES EVENEMENTS ET APPEL DES FONCTIONS

//CREATION D'UNE NOUVELLE PARTIE
button = document.querySelectorAll('.boutonCreateEquipe');
//Boucle pour recuperer le bouton clické
button.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        createEquipe(button)
    });
})

//SUPPRIMER UNE PARTIE
//recuperation des boutons de chaque ligne partie
let elements = document.querySelectorAll('.elt-supprimer');
//Boucle pour recuperer le bouton clické
elements.forEach(element => {
    element.addEventListener('click', (event) => {
        event.preventDefault();
        supprimePartie(element)
    });
})

//VALIDE SCORE D'UNE PARTIE
//recuperation des boutons de chaque ligne partie
let buttons = document.querySelectorAll('.btn-validez');
//Boucle pour recuperer le bouton clické
buttons.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        valideButton(button)
    });

})




//FORMULAIRE JOUEUR
//CREATION D'UN NOUVEAU JOUEUR
button = document.querySelectorAll('.boutonCreatjoueur');
//Boucle pour recuperer le bouton clické
button.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        createJoueur(button)
    });
})


//CREATION D'UN nouveau joueur
const createJoueur = function () {
    let nom = document.getElementById("nom").value
    let prenom = document.getElementById("prenom").value


    //Envoie sur le serveur par les websockets
    let str = JSON.stringify({
        nom: nom,
        prenom: prenom,
        type: JOUEUR_CREE,
    })
    //vider les champs formulaire
    document.getElementById("nom").value = ""
    document.getElementById("prenom").value = ""

    ws.send(str)
    location.href = '#modal-close'
}