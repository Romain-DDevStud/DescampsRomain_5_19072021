let params = new URL(document.location).searchParams;
let id = params.get("id");

main()

function main() {
    getArticles();
}

function getArticles() {
    fetch(`http://localhost:3000/api/cameras/${id}`)
        .then(function(res){
            if (res.ok){
                return res.json();
            }
        })
        .then(function(value){
            const article = value;
            let template = document.querySelector("#product-card");
            let section = document.querySelector(".product-card__item");
            let clone = document.importNode(template.content, true);
            let image = clone.querySelector(".product-card__img");
            image.src = article.imageUrl;
            let name = clone.querySelector(".product-card__name");
            name.innerHTML = article.name;
            let price = clone.querySelector(".product-card__price");
            price.innerHTML = article.price;
            let desc = clone.querySelector(".product-card__desc");
            desc.innerHTML = article.description;
            let select = clone.querySelector(".product-card__select");
            const lenses = value.lenses;
            for (const lense of lenses){
                let option = document.createElement("option");
                option.value = lense;
                option.innerHTML = lense;
                select.appendChild(option);
            }
            section.appendChild(clone);
            article.price = article.price / 100;
            price.innerHTML = new Intl.NumberFormat("fr-FR",{
                style: "currency",
                currency: "EUR",
            })
            .format(article.price);
            // ajout du produit 
            const cartAdd = document.querySelector(".product-card__cartadd");
            cartAdd.addEventListener("click", function() {
                addToCart();
                alert("Produit ajouté au panier");
            });
        })
        .catch(function(err){
        });
}
// forcer "vider panier dans localStorage" refresh page pour remettre à zéro le tableau et relancer page (commenter/décommenter)
//localStorage.clear();
function addToCart() { //fonction ajout au panier
    const option = document.getElementById("lentilles").value; // variable pour récupérer l'option de lentilles
    const quantity = document.getElementById("cameraQty").value; //variable pour récupérer la quantité
    const productInCart = { //variable clé-valeur pour localStorage
        "id": id, "option": option, "quantity": quantity,
    };
    let productsInStorage = localStorage.getItem("productsInStorage"); // vérif de ce qu'il y a dans le localStorage, si produit absent, on l'ajoute, si présent, on modifie la quantité
    if (productsInStorage == null) {
        productsInStorage = [];
    } else {
        productsInStorage = JSON.parse(productsInStorage);
    }
    let productExist = false;
    productsInStorage.forEach(item => {
        if (item.id == productInCart.id && item.option == productInCart.option) {
            item.quantity = parseInt(item.quantity) + parseInt(productInCart.quantity);
            productExist = true;
        }
    });
    if (productExist == false) {
        productsInStorage.push(productInCart);
    }
    // ajout de notif sur page Panier quand ajout produit
    const cartNotif = productsInStorage.length;
    productsInStorage = JSON.stringify(productsInStorage);
    localStorage.setItem("productsInStorage",productsInStorage);
    let notif = document.getElementById("cart-notif");
    notif.innerHTML = " (" + cartNotif + ")";
}
/* à déplacer dans page Panier
function loadProductInCart() {
    let productsInStorage = localStorage.getItem("productsInStorage");
    if (productsInStorage == null) {
        console.log("pas de produit dans le panier");
    } else {
        productsInStorage = JSON.parse(productsInStorage);
    }
    productsInStorage.forEach(item => {
        fetch(`http://localhost:3000/api/cameras/${item.id}`)
            .then(function(res){
                if (res.ok){
                    return res.json();
                }
            })
            .then(function(value){
                const article = value;
                let template = document.querySelector("#product-card");
                let section = document.querySelector(".product-card__item");
                let clone = document.importNode(template.content, true);
                let name = clone.querySelector(".product-card__name");
                name.innerHTML = article.name;
                let price = clone.querySelector(".product-card__price");
                price.innerHTML = article.price;
                let desc = clone.querySelector(".product-card__desc");
                desc.innerHTML = article.description;
                let option = clone.querySelector(".product-card__select");
                option.innerHTML = item.option;
                let quantity = clone.querySelector(".product-card__quantity");
                quantity = item.quantity;
                section.appendChild(clone);
            })
            .catch(function(err){
            });
    });
}*/
