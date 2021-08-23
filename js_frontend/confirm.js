//récupération des données
let affichageID = document.querySelector(".commande-ID span");
orderInfo = JSON.parse(localStorage.orderInfos);
let orderId = orderInfo.orderId;
let affichageNom = document.querySelector(".commande-name span")
let nameGet = localStorage.getItem("orderInfos")
nameGet = JSON.parse(nameGet)

//affichage des données
affichageID.textContent = orderId;
affichageNom.textContent = `${nameGet.contact.lastName}`;

//clear lS + refresh page sur bouton Home
const homeButton = document.querySelector(".home-button");
homeButton.addEventListener("click", function() {
    localStorage.clear();
})