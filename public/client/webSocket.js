const PARTIE_SUPPRIMEE = "partieclientSupprime"
const PARTIE_CREE = "partieCréée"
const MANCHE_TERMINE = "uneMancheTermine"
const MODIF_SCORES = "modifDesScores"
const JOUEUR_CREE = "joueurCréé"
const EQUIPE_CREE = "equipeCréé"
const HOST = location.origin.replace(/^http/, 'ws')
const ws = new WebSocket(HOST);

//Message du serveur WebSocket
ws.onmessage = function (event) {
    var data = JSON.parse(event.data)

    //MODIFICATIONS DU DOM PARTIE_CREE
    if (data.type === PARTIE_CREE) {
        let ajoutTable = document.querySelector("table tbody")
        ajoutTable.insertAdjacentHTML('afterbegin', data.ajoutDeLigne)
        let input = document.querySelector(".elt-supprimer")
        input.addEventListener('click', event => {
            supprimePartie(input)
        })
        let button = document.querySelector(".btn-validez")
        button.addEventListener('click', event => {
            valideButton(button)
        })
        mettreAJourCompteur(1)
    }

    //MODIFICATIONS DU DOM PARTIE_SUPPRIMEE
    if (data.type === PARTIE_SUPPRIMEE) {
        supprimerPartie(data.id)

    }

    if (data.type === MODIF_SCORES) {
        let button = document.getElementById(data.id)
        let trButton = button.closest("tr")
        let input1 = trButton.querySelector("td .inputJ1")
        let input2 = trButton.querySelector("td .inputJ2")
        let score1 = parseInt(data.score1)
        let score2 = parseInt(data.score2)
        input1.value = score1
        input2.value = score2
        //resete score à 13
        if ((score1 >= 13) || (score2 >= 13)) {
            setTimeout(function () {
                input1.value = 0
                input2.value = 0
            }, 5000)
        }
        if ((data.pointEqp1 >= 1) || (data.pointEqp2 >= 1)) {
            //Affichage resultat de la manche Equipe 1
            let mancheEqp1 = parseInt(data.pointEqp1)
            let inputManche1 = trButton.querySelector("td .eqp1")
            inputManche1.value = mancheEqp1

            //Affichage resultat de la manche Equipe 2
            let mancheEqp2 = parseInt(data.pointEqp2)
            let inputManche2 = trButton.querySelector("td .eqp2")
            inputManche2.value = mancheEqp2
        }
        //Boutton hors fonction
        if ((data.pointEqp1 >= 5) || (data.pointEqp2 >= 5)) {
            //ajout score dans input   
            input1.insertAdjacentHTML('beforebegin', score1)
            input2.insertAdjacentHTML('beforebegin', score2)
            let inputJ1 = trButton.querySelector(".inputJ1")
            let inputJ2 = trButton.querySelector(".inputJ2")
            button.disabled = true;
            inputJ1.remove()
            inputJ2.remove()
            //Recuperation du td "joueur 1" pour modifier le css backgroundcolor 
            if (score1 > score2) {
                trButton.querySelector(".j1").classList.add("vert")
                trButton.querySelector(".j2").classList.add("gray")
                trButton.querySelector(".vs").classList.add("gray")
            } else if (score1 < score2) {
                trButton.querySelector(".j1").classList.add("gray")
                trButton.querySelector(".j2").classList.add("vert")
                trButton.querySelector(".vs").classList.add("gray")
            }
            //Recuperation du tr "ligne" pour modifier le css color equipe1 et 2
            trButton.classList.add("lesjoueurs")
            mettreAJourCompteur(-1)

        }
    }
};