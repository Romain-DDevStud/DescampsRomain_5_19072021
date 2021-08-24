main()

function main() {
    loadProductInCart();
}
//création des éléments du panier sous forme de tableau
function loadProductInCart() {
    let productsInStorage = localStorage.getItem("productsInStorage");
    if (productsInStorage == null) {
        console.log("Pas de produit dans le panier");
        let sectionForm = document.querySelector(".recap-data");
        sectionForm.innerHTML = "<span id='empty-cart'>Votre panier est vide !</span>";
        return false;
    } else {
        productsInStorage = JSON.parse(productsInStorage);
    }
    let cartTotalPrice = 0;
    let template = document.getElementById("recap-amount");
    let section = document.querySelector(".table-total");
    let clone = document.importNode(template.content, true);
    let totalCommande = clone.querySelector(".cart-totalprice");
    section.appendChild(clone);
    productsInStorage.forEach(item => {
        fetch(`http://localhost:3000/api/cameras/${item.id}`)
            .then(function(res){
                if (res.ok){
                    return res.json();
                }
            })
            .then(function(value){
                const article = value;
                let template = document.getElementById("recap-item");
                let section = document.querySelector(".table-content");
                let clone = document.importNode(template.content, true);
                let name = clone.querySelector(".item-name");
                name.innerHTML = article.name;
                let price = clone.querySelector(".item-price");
                price.innerHTML = item.price;
                let option = clone.querySelector(".item-option");
                option.innerHTML = item.option;
                let quantity = clone.querySelector(".item-qty");
                quantity.innerHTML = item.quantity;
                let linePrice = parseInt(item.quantity) * parseInt(article.price) / 100;
                let totalAmount = clone.querySelector(".item-totalprice");
                totalAmount.innerHTML = new Intl.NumberFormat("fr-FR",{ 
                    style: "currency",
                    currency: "EUR",
                    })
                    .format(linePrice);
                cartTotalPrice += parseInt(linePrice);
                //console.log(cartTotalPrice);
                section.appendChild(clone);
                article.price = article.price / 100;
                price.innerHTML = new Intl.NumberFormat("fr-FR",{ 
                style: "currency",
                currency: "EUR",
                })
                .format(article.price);
                totalCommande.innerHTML = new Intl.NumberFormat("fr-FR",{ 
                    style: "currency",
                    currency: "EUR",
                    })
                    .format(cartTotalPrice);
            })
            .catch(function(err){
            });           
        });       
}
// supprimer contenu du panier
const buttonEmptyCart = document.querySelector(".empty-cart");
if (buttonEmptyCart != null) {
    buttonEmptyCart.addEventListener("click", function() {
        localStorage.clear();
        alert("Panier vidé avec succès !");
        history.go(0);
    });
}

//variables pour envoi des infos clients
let firstName = document.getElementById("firstName");
let lastName = document.getElementById("lastName");
let emailAddress = document.getElementById("email");
let address = document.getElementById("address");
let city = document.getElementById("city");
let confirmButton = document.getElementById("order-confirm");

//fonction pour créer objet général infos clients
function infosClient (firstName, lastName, emailAddress, address, city) {
    (this.firstName = firstName),
    (this.lastName = lastName),
    (this.emailAddress = emailAddress),
    (this.address = address),
    (this.city = city);
}

//fonction de validation via Regex des input infos client
function validInput() {
    let regexFirstName = /^[A-Z]{1}[A-Za-zÀ-ÿ\ -]+$/ 
    let regexLastName = /^[A-Z]{1}[a-z\ ]+$/
    let regexEmail = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/
    let regexAddress = /^[0-9]{1,4}[ ,-][ A-Za-zÀ-ÿ0-9\-]+$/
    let regexCity = /^[A-Z]{1}[a-zA-Z\- ]+$/
    if (firstName.value.length === 0 || !regexFirstName.test(firstName.value)) {
        alert("Merci d'entrer un prénom valide.")
        firstName.style.borderColor = "red"
    } else if (lastName.value.length === 0 || !regexLastName.test(lastName.value)) {
        alert("Merci d'entrer un nom valide.")
        lastName.style.borderColor = "red"
    } else if (emailAddress.value.length === 0 || !regexEmail.test(emailAddress.value)) {
        alert("Merci d'entrer une adresse email valide")
        emailAddress.style.borderColor = "red"
    } else if (address.value.length === 0 || !regexAddress.test(address.value)) {
        alert("Merci d'entrer une adresse valide.")
        address.style.borderColor = "red"
    } else if (city.value.length === 0 || !regexCity.test(city.value)) {
        alert("Merci d'entrer une ville valide.")
        city.style.borderColor = "red"
    } else {
        return true
    }
}

// création d'un tableau contenant le panier de commande 
let productsInStorage = JSON.parse(localStorage.getItem("productsInStorage"));
let listCartProduct = [];
if (productsInStorage != null) {
    for (let i = 0; i < productsInStorage.length; i++) {
        listCartProduct.push(productsInStorage[i].id);
    }
}        

// fonction pour envoi données client
function sendInfos() {
    let newClient = new infosClient(
        firstName.value,
        lastName.value,
        emailAddress.value,
        address.value,
        city.value,
    );
    fetch("http://localhost:3000/api/cameras/order", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            contact: {
                firstName: newClient.firstName,
                lastName: newClient.lastName,
                address: newClient.address,
                city: newClient.city,
                email: newClient.emailAddress,
            },
            products: listCartProduct,
        }),
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
        }
    })
    .then((data) => {
        localStorage.clear();
        localStorage.setItem("orderInfos", JSON.stringify(data));
        const form = document.getElementById("form-infos");
        window.location.replace(form.action);
    })  
    .catch((error) => console.log("erreur de type : ", error));
} 

//event au clic validation commande
if (confirmButton != null) {
    confirmButton.addEventListener("click", function(event) {
        event.preventDefault();
        const valid = validInput();
        if (valid == true) {
            sendInfos()
        }
    })
}
