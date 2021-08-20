main()

function main() {
    loadProductInCart();
}
function loadProductInCart() {
    let productsInStorage = localStorage.getItem("productsInStorage");
    if (productsInStorage == null) {
        console.log("Pas de produit dans le panier");
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
buttonEmptyCart.addEventListener("click", function() {
    localStorage.clear();
    alert("Panier vidé avec succès !");
    history.go(0);
});




