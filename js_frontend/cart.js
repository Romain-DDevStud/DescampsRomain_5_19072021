function recupLS () {
    let productsInStorage = JSON.parse(localStorage.getItem("productsInStorage"));
    let prixTotal = JSON.parse(localStorage.getItem("prixTotal"));
    let prixPanier = document.getElementById("affichageTotal");
    let tableauPanier = document.getElementById("product-recap__item");

    if (prixTotal != null) {
        let div = document.createElement("div");
        product-recap__item.appendChild(div)
        prixPanier.textContent = 'Le montant total de votre commande est de : ' + prixTotal + ' €';
        prixPanier.id = 'prixTotal';
    } else {
        prixPanier.textContent = 'Le montant de votre commande est de : 0 €';
    }

    if (productsInStorage == null) {
        let div = document.createElement("div")
        tableauPanier.appendChild(div)
        console.log("Le panier est vide")
    } else {
        tableauPanier.innerHTML = '';
        Object.values(productsInStorage).map((camera) => {
            let tr = document.createElement("tr");
            tr.classList.add("table__grid");
            let name = document.createElement("td");
            let lenses = document.createElement("td");
            let quantite = document.createElement("td");
            let prix = document.createElement("td");
            let prixTotalCam = document.createElement("td");

            tableauPanier.appendChild(tr);
            tr.appendChild(name);
            tr.appendChild(lenses);
            tr.appendChild(quantite);
            tr.appendChild(prix);
            tr.appendChild(prixTotalCam);

            name.textContent = camera.id; //problème ici : reprendre name dans productsInStorage, mais la donnée n'y est pas
            lenses.textContent = camera.option;
            quantite.textContent = camera.quantity;
            prix.textContent = camera.price / 100 + " €"; // ici
            prixTotalCam.textContent = camera.price / 100 * camera.quantity + " €"; // et ici 
        });    
    }

}
recupLS();


