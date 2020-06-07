function mettreAJourCompteur(nb) {
    let span = document.querySelector("#compteur")
    let compteur = parseInt(span.innerText)
    span.innerText = compteur + nb
}


function supprimerPartie(ligneId) {
    let tr = document.querySelector(".ligne[data-id='" + ligneId + "']")
    tr.remove()
}



//Partie Terminé donné une vérité
function mancheTermine(pointEqp1, pointEqp2) {
    if ((pointEqp1 <= 5) || (pointEqp2 <= 5)) {
        return false
    } else {
        return true
    }
}