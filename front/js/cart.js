function viderLocalStorage() {
    localStorage.clear();
}
function removePanier(panier, monPanier) {

    //si le nouveau panier n'a pas de couleur et quantité, je dis à l'utilisateur de les mentionner 
    if(panier.color == "" || panier.quantity == 0) {
        alert("Choissiez une couleur et/ou une quantité");
        return false;
    }else{
        
        //si mon panier ne contient pas quelque chose, c'est à dire vide
        if(!monPanier) {
            console.log("mon Panier est Vide");
            //je crée un clé du produit, composé de l'id et la couleur
            let keyProduit 			= encode(panier.id + "-" +panier.color) ;
            monPanier 				= {};
            monPanier[keyProduit] 	= panier;
            //je pousse dans le localStorage le panier en question
            localStorage.setItem("monPanier", JSON.stringify(monPanier));
            console.log(monPanier);
        }else{
            
            //si mon panier  contient quelque chose
            
            //je crée un clé du produit, composé de l'id et la couleur
            let keyProduit 				= encode(panier.id + "-" +panier.color) ;
            //si un objet panier ayant la clé keyProduit est déjà dans mon panier, je soustrais la quantité
            if(monPanier[keyProduit]){
                let monAncienPanier 	= monPanier[keyProduit];
                monAncienPanier.quantity -= parseInt(panier.quantity);
                monPanier[keyProduit] 	= monAncienPanier;
            }else{
                //sinon j'ajoute le panier 
                monPanier[keyProduit] 	= panier;
            }
            // j'ajoute le panier dans mon localStorage
            localStorage.setItem("monPanier", JSON.stringify(monPanier));
            let items=document.getElementById("cart__items");
            items.textContent = "";
            displayPanier();
            
        }
    }
    console.log(JSON.parse(localStorage.getItem("monPanier")))

}

function displayPanier() {
    let monPanier = JSON.parse(localStorage.getItem("monPanier"));
    let api="http://localhost:3000/api/products";
    //console.log(monPanier);
    let totalPanier = 0;
    for(let panier in monPanier) {
        totalPanier = totalPanier + 1;
    }
    const objectArray = Object.entries(monPanier)
    ;
    let totalArticle = 0;

    objectArray.forEach(([key, panierDansLocalStorage]) => {
    //console.log(key);
    // 'one'
    totalArticle = totalArticle +panierDansLocalStorage.quantity;
    // console.log(panierDansLocalStorage); // 1
    let apiProduit = api +"/"+ panierDansLocalStorage.id;
    //console.log(apiProduit);
    fetch(apiProduit)		
        .then((res)=>res.json())
        .catch((err)=>{
            let erreur=document.getElementById("cart__items");
            erreur.textContent="Erreur: Accès au serveur impossible ! Le contenu de la page ne peut pas être affiché!";
            erreur.style.color= "red";
            erreur.style.fontSize= "1.7vw";

        })
        .then((donneesViennentDuServeur)=>{
        //  console.log(donneesViennentDuServeur);
            if(panierDansLocalStorage.quantity > 0 ) {
            let cart__items                             = document.getElementById("cart__items");
                let cart__item                              = document.createElement("article");
                let cart__item__img                         = document.createElement("div");
                let img                                     = document.createElement("img");
                let cart__item__content                     = document.createElement("div");
                let cart__item__content__description        = document.createElement("div");
                let nameProduct                             = document.createElement("h2");
                let colorProduct                            = document.createElement("p");
                let price                                   = document.createElement("p");
                let cart__item__content__settings           = document.createElement("div");
                let cart__item__content__settings__quantity = document.createElement("div");
                let quantity                                = document.createElement("p");
                let quantitySelected                        = document.createElement("input");
                let cart__item__content__settings__delete   = document.createElement("div");
                let suppr                                   = document.createElement("p");

                cart__items.appendChild(cart__item);
                cart__item.setAttribute("class", "cart__item");
                cart__item.dataset.id       = donneesViennentDuServeur._id;
                cart__item.dataset.color    = panierDansLocalStorage.color;
                cart__item.appendChild(cart__item__img);
                cart__item__img.setAttribute("class", "cart__item__img");
                cart__item__img.appendChild(img);
                img.src                     = donneesViennentDuServeur.imageUrl;
                cart__item.appendChild(cart__item__content);
                cart__item__content.setAttribute("class", "cart__item__content");
                cart__item__content.appendChild(cart__item__content__description);
                cart__item__content__description.setAttribute("class", "cart__item__content__description");
                cart__item__content__description.appendChild(nameProduct);
                nameProduct.innerHTML       = donneesViennentDuServeur.name;
                cart__item__content__description.appendChild(colorProduct);
                colorProduct.innerHTML      = panierDansLocalStorage.color;
                cart__item__content__description.appendChild(price);
                price.innerHTML             = donneesViennentDuServeur.price;
                cart__item__content.appendChild(cart__item__content__settings);
                cart__item__content__settings.setAttribute("class", "cart__item__content__settings");
                cart__item__content__settings.appendChild(cart__item__content__settings__quantity);
                cart__item__content__settings__quantity.setAttribute("class", "cart__item__content__settings__quantity");
                cart__item__content__settings__quantity.appendChild(quantity);
                quantity.innerHTML          = "Qté : ";
                cart__item__content__settings__quantity.appendChild(quantitySelected);
                quantitySelected.setAttribute("type", "number");
                quantitySelected.setAttribute("class", "itemQuantity");
                quantitySelected.setAttribute("min", "1");
                quantitySelected.setAttribute("max", panierDansLocalStorage.quantity);
                quantitySelected.setAttribute("value", panierDansLocalStorage.quantity);
                cart__item__content__settings__quantity.appendChild(cart__item__content__settings__delete);
                cart__item__content__settings__delete.setAttribute("class", "cart__item__content__settings__delete");
                cart__item__content__settings__delete.appendChild(suppr);
                suppr.setAttribute("class", "deleteItem");
                suppr.innerHTML             = "Supprimer";
            }
            let totalQuantity = document.getElementById("totalQuantity");
            totalQuantity.innerHTML = totalArticle;
                
        });
    });
}
displayPanier();
//viderLocalStorage();
document.body.addEventListener('click', function (evt) {
if (evt.target.className === 'deleteItem') {
    let color = evt.target.closest(".cart__item").getAttribute("data-color");
    console.log(color);
    let idProduct = evt.target.closest(".cart__item").getAttribute("data-id");
    console.log(idProduct);
    let cartItemContentSettingsQuantity = evt.target.closest(".cart__item__content__settings__quantity");
    let quantity = cartItemContentSettingsQuantity.querySelector("input").value;
    console.log(quantity);

    //je récupère le panier dans le local storage
    let monPanier = JSON.parse(localStorage.getItem("monPanier"));


    //ici, je créé mon panier
    let panier = {
        color:color,
        quantity:parseInt(quantity),
        id:idProduct
    }
    removePanier(panier, monPanier);
}
}, false);
let email = document.getElementById("email");
document.getElementById("order").addEventListener("click", function(event) {
    event.preventDefault();
    console.log("hello there");
    
});
if(email=="") {
    document.getElementById("order").setAttribute("disabled", "true");
}
   
