main()

function main() {
    getArticles();
}
// Fonction pour récupérer la liste des articles
function getArticles() {
    fetch("http://localhost:3000/api/cameras")
        .then(function(res){
            if (res.ok){
                return res.json();
            }
        })
        .then(function(value){
            const articles = value;
            let template = document.querySelector("#article");
            let section = document.querySelector(".product__list");
            for (const article of articles){ // Récupération des informations produits
                let clone = document.importNode(template.content, true);
                let url = clone.querySelector(".product__URL");
                url.href = "../DescampsRomain_5_19072021/product.html?id=" + article._id;
                let image = clone.querySelector(".product__img");
                image.src = article.imageUrl;
                let name = clone.querySelector(".product__name");
                name.innerHTML = article.name;
                let price = clone.querySelector(".product__price");
                price.innerHTML = article.price;
                section.appendChild(clone);
                article.price = article.price / 100; // Modification du format d'affichage du prix
                price.innerHTML = new Intl.NumberFormat("fr-FR",{ 
                    style: "currency",
                    currency: "EUR",
                })
                .format(article.price);
            }
        })
        .catch(function(err){
        });
}
