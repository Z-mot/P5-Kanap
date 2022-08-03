const API_URL = "http://localhost:3000/api/products/";

let btn = document.getElementById("order");

//déclaration de variables permettant de valider chaque champs du formulaire, en booléen
let isFirstNameIsTrue = Boolean;
let isLastNameIsTrue = Boolean;
let isAddressIsTrue = Boolean;
let isCityIsTrue = Boolean;
let isEmailIsTrue = Boolean;

//déclaration de la fonction permettant de griser le bouton "valider" si le panier est vide ou les champs du formulaire non remplis
function disabled (__displayBtn) {
    if(__displayBtn == false) {
        btn.style.cursor            = "default",
        btn.style.color             = "grey",
        btn.style.backgroundColor   = "darkgrey",
        btn.style.boxShadow         = "none"
    }else{
        btn.style.removeProperty("cursor"),
        btn.style.removeProperty("color"),
        btn.style.removeProperty("background-color"),
        btn.style.removeProperty("box-shadow")
    }
};
disabled(false);

//transformation d'une chaine de caractère en entier (encodage)
let encode  = string => {
	return string.replace(/./g, function(c) {
		return ('00' + c.charCodeAt(0)).slice(-3);
	});
}
//transformation d'un entier en chaine de caractère (décodage)
let decode = string => {
	return string.replace(/.{3}/g, function(c) {
		return String.fromCharCode(c);
	});
}

//déclaration de fonction permettant de mettre à jour le localStorage
function updateLocalStorage(__monPanier) {
    localStorage.setItem("monPanier", JSON.stringify(__monPanier));
    let items                               = document.getElementById("cart__items");
    items.textContent                       = "";
    displayPanier();
}
/*déclaration de fonction pour la création du panier utilisé dans les méthodes addEventListener
pour modification et suppression d'article dans le panier (factorisation du code)*/
function createPanier(__evt) {
    let color                               = __evt.target.closest(".cart__item").getAttribute("data-color");
        let idProduct                       = __evt.target.closest(".cart__item").getAttribute("data-id");
        let cartItemContentSettingsQuantity = __evt.target.closest(".cart__item__content__settings__quantity");
        let quantity                        = cartItemContentSettingsQuantity.querySelector("input").value;
    let panier = {
        color   : color,
        // parseInt permet de transformer une chaine de caractère en nombre entier
        quantity: parseInt(quantity),
        id      : idProduct
    }
    return panier;
}

//déclaration de fonction pour récupérer la quantité total du panier servant de condition dans la fonction displayBtn
function getTotalQuantity(__monPanier) {
    if(__monPanier == null){
        return 0;
    }else{
    let tabPanier       = Object.entries(JSON.parse(__monPanier));
    let totalQuantity   = 0;
    for(let i=0; i<tabPanier.length; i++){
        totalQuantity   = totalQuantity + parseInt([tabPanier[i][1].quantity]);
    }
    return totalQuantity;
}
}

/*déclaration de fonction permettant de vérifier si tous les champs sont remplis correctement
et si la quantité du panier n'est pas égale à zéro*/
function displayBtn(__isFirstNameIsTrue, __isLastNameIsTrue, __isAddressIsTrue, __isCityIsTrue, __isEmailIsTrue){
    let monPanier               = localStorage.getItem("monPanier");
    let totalQuantity           = getTotalQuantity(monPanier);
    //si toutes les conditions sont vrais alors le bouton "valider" est actif
    if( __isFirstNameIsTrue     == true
        && __isLastNameIsTrue   == true 
        && __isAddressIsTrue    == true 
        && __isCityIsTrue       == true 
        && __isEmailIsTrue      == true 
        && totalQuantity        !=  0) {
        disabled(true);
        return true;
    }else{
        //sinon le bouton "valider" est inactif
        disabled (false);
        document.getElementById("order").addEventListener("click", function(event){
            event.preventDefault();
        })
        return false;
    };
};

/*je récupère le panier dans le local storage
JSON.parse permet de transformer une chaine de caractère en objet*/
let monPanier = JSON.parse(localStorage.getItem("monPanier"));

//déclaration de la fonction permettant d'ajouter ou de soustraire des quantités d'article dans la page panier (MAJ)
function updatePanier(__panier, __monPanier) {           
    //je crée un clé du produit, composé de l'id et la couleur
    let keyProduit 				        = encode(__panier.id + "-" +__panier.color) ;
    //je vérifie si un objet panier ayant la clé keyProduit est déjà dans mon panier
    if(__monPanier[keyProduit]){
        let monAncienPanier 	        = __monPanier[keyProduit];
        let difference                  = 0;
        //ensuite, si mon ancien panier est inférieur à celui actuel alors je lui ajoute la différence entre mon panier actuel et mon ancien panier
        if(monAncienPanier.quantity < __panier.quantity) {
            difference                  = __panier.quantity - monAncienPanier.quantity;
            monAncienPanier.quantity    = monAncienPanier.quantity + difference;
            //sinon je lui soustrait la différence entre mon ancien panier et mon panier actuel
        }else{
            difference                  = monAncienPanier.quantity - __panier.quantity;
            monAncienPanier.quantity    = monAncienPanier.quantity - difference;
        }

        __monPanier[keyProduit] 	    = monAncienPanier; 
    }
    updateLocalStorage(__monPanier);
}

//déclaration de la fonction permettant de supprimer un article dans le panier
function removePanier (__panier, __monPanier) {
    //je crée un clé du produit, composé de l'id et la couleur
    let keyProduit 				          = encode(__panier.id + "-" +__panier.color) ;
    //si un objet panier ayant la clé keyProduit veut être supprimer je met sa quantité à zéro
    if(__monPanier[keyProduit]){
        __monPanier[keyProduit].quantity  = 0;
    }
    updateLocalStorage(__monPanier);
} 

// déclaration de la fonction permettant de lister (afficher) la liste des paniers
function displayPanier() {
    let monPanier   = JSON.parse(localStorage.getItem("monPanier"));
    let totalPanier = 0;
    for(let panier in monPanier) {
        totalPanier = totalPanier + 1;
    }
    if(monPanier != null) {
        //Object.entries permet de transformer un objet en array
        const objectArray   = Object.entries(monPanier);
        let totalArticle    = 0;
        let totalPrice      = 0;

        //Ici nous utilisons la boucle forEach pour boucler sur chaque objet composant l'array
        objectArray.forEach(([key, panierDansLocalStorage]) => {
        //initialisation de la valeur de totalArticle avec la quantité du panier issu du local storage
            totalArticle    = totalArticle + panierDansLocalStorage.quantity;

            let promise     = fetch(API_URL + panierDansLocalStorage.id, {
                method: "GET",
                    headers: {
                    'Accept': 'application/json', 
                    'Content-Type': 'application/json'
                    },
               }
            );		
            promise.then(async(res)=> {
                try{
                    const data = await res.json();
                    if(panierDansLocalStorage.quantity > 0 ) {
                        //création des éléments comme commenté dans le code HTML
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

                        //assignation de valeurs et d'attributs aux éléments créés
                        cart__item.dataset.id                       = data._id;
                        cart__item.dataset.color                    = panierDansLocalStorage.color;
                        img.src                                     = data.imageUrl;
                        nameProduct.innerHTML                       = data.name;               
                        colorProduct.innerHTML                      = panierDansLocalStorage.color;               
                        price.innerHTML                             = data.price + " €";
                        quantity.innerHTML                          = "Qté : ";
                        suppr.innerHTML                             = "Supprimer";
                        totalPrice                                  = totalPrice + panierDansLocalStorage.quantity * data.price;
                        cart__item.setAttribute("class", "cart__item");
                        cart__item__img.setAttribute("class", "cart__item__img");
                        img.setAttribute("alt", data.altTxt);                            
                        cart__item__content.setAttribute("class", "cart__item__content");                
                        cart__item__content__description.setAttribute("class", "cart__item__content__description");                                              
                        cart__item__content__settings.setAttribute("class", "cart__item__content__settings");                
                        cart__item__content__settings__quantity.setAttribute("class", "cart__item__content__settings__quantity");                        
                        quantitySelected.setAttribute("type", "number");
                        quantitySelected.setAttribute("class", "itemQuantity");
                        quantitySelected.setAttribute("min", "1");
                        quantitySelected.setAttribute("max", "100");
                        quantitySelected.setAttribute("value", panierDansLocalStorage.quantity);                
                        cart__item__content__settings__delete.setAttribute("class", "cart__item__content__settings__delete");                
                        suppr.setAttribute("class", "deleteItem");

                        //hiérarchisation des éléments avec la méthode "appendChild"
                        cart__items.appendChild(cart__item);
                        cart__item.appendChild(cart__item__img);
                        cart__item__img.appendChild(img);
                        cart__item.appendChild(cart__item__content);
                        cart__item__content.appendChild(cart__item__content__description);
                        cart__item__content__description.appendChild(nameProduct);
                        cart__item__content__description.appendChild(colorProduct);
                        cart__item__content__description.appendChild(price);
                        cart__item__content.appendChild(cart__item__content__settings);
                        cart__item__content__settings.appendChild(cart__item__content__settings__quantity);
                        cart__item__content__settings__quantity.appendChild(quantity);
                        cart__item__content__settings__quantity.appendChild(quantitySelected);
                        cart__item__content__settings__quantity.appendChild(cart__item__content__settings__delete);
                        cart__item__content__settings__delete.appendChild(suppr);
                    }
                    //affichage du nombre total d'article du panier
                    let totalQuantity               = document.getElementById("totalQuantity");
                    totalQuantity.innerHTML         = totalArticle;
                    //affichage du montant total du panier
                    let totalAmount                 = document.getElementById("totalPrice");
                    totalAmount.innerHTML           = totalPrice;
                }
                catch(e){
                    //correspond à la capture de l'erreur et l'affichage adéquat pour l'utilisateur de cette dernière
                    let erreur                      =document.getElementById("cart__items");
                    erreur.textContent              ="Erreur: Accès au serveur impossible ! Le contenu de la page ne peut pas être affiché!";
                    erreur.style.color              = "red";
                    erreur.style.fontSize           = "1.7vw";
                };
            });   
        });
    }
}
displayPanier();

document.body.addEventListener('change', function (evt) {
    if (evt.target.className === 'itemQuantity') {
        //je récupère le panier dans le local storage
        let monPanier   = JSON.parse(localStorage.getItem("monPanier"));
        //ici, je créé mon panier
        let panier      = createPanier(evt);
        //et là j'ajoute ou je soustrait la quantité de l'article sélectionné
        updatePanier(panier, monPanier);
    }
});

document.body.addEventListener('click', function (evt) {
    if (evt.target.className === 'deleteItem') {
        //je récupère le panier dans le local storage
        let monPanier   = JSON.parse(localStorage.getItem("monPanier"));
        //ici, je créé mon panier
        let panier      = createPanier(evt);
        //et là je supprime l'article sélectionné de mon panier
        removePanier(panier, monPanier);
        //je met à jour l'état du bouton "valider" au cas ou tous les articles auraient été supprimés
        displayBtn(isFirstNameIsTrue, isLastNameIsTrue, isAddressIsTrue, isCityIsTrue, isEmailIsTrue);
    }
});



//validation de données sur le champs "Prénom"
let firstName                                               = document.getElementById("firstName");
firstName.addEventListener("focusout", function(e) {
    let value                                               = e.target.value;
    //la méthode .trimStart() permet de supprimer les blancs au début de la chaine de caractère
    value                                                   = value.trimStart();
    //la méthode .trimEnd() permet de supprimer les blancs à la fin de la chaine de caractère
    value                                                   = value.trimEnd();
    //si la valeur du champs correspond aux critère de la REGEX alors on vide l'élément contenant l'erreur
    if(value.match(/^[a-z ,.'-]+$/i)) {
        document.getElementById("firstNameErrorMsg").innerHTML = "";
        //on passe la première variable de vérification en "true"
        isFirstNameIsTrue                                   = true;
        //on exécute la fonction permettant de tester si tous le champs sont valide afin d'activer ou non le bouton "valider"
        displayBtn(isFirstNameIsTrue, isLastNameIsTrue, isAddressIsTrue, isCityIsTrue, isEmailIsTrue);
        firstName.value                                     = value;
        //on retourne la valeur du champs
        return value;
    }else{
        //on passe la première variable de vérification en "false"
        isFirstNameIsTrue                                   = false;
         //on exécute la fonction permettant de tester si tous le champs sont valide afin d'activer ou non le bouton "valider"
        displayBtn(isFirstNameIsTrue, isLastNameIsTrue, isAddressIsTrue, isCityIsTrue, isEmailIsTrue);
        //on affiche une erreur à l'utilisateur dans le champs erreur prévu à cette effet
        document.getElementById("firstNameErrorMsg").innerHTML ="Entrez un prénom valide! (pas de nombre ou de caractères spéciaux)";
    }
});

//validation de données sur le champ "Nom"
let lastName                                                = document.getElementById("lastName");
lastName.addEventListener("focusout", function(e) {
    let value                                               = e.target.value;
    value                                                   = value.trimStart();
    value                                                   = value.trimEnd();
    if(value.match(/^^\D+[^@]+$/g)) {
        document.getElementById("lastNameErrorMsg").innerHTML = "";
        isLastNameIsTrue                                    = true;
        displayBtn(isFirstNameIsTrue, isLastNameIsTrue, isAddressIsTrue, isCityIsTrue, isEmailIsTrue);
        lastName.value                                      = value;
        return value;
    }else{
        isLastNameIsTrue                                    = false;
        displayBtn(isFirstNameIsTrue, isLastNameIsTrue, isAddressIsTrue, isCityIsTrue, isEmailIsTrue);
        document.getElementById("lastNameErrorMsg").innerHTML ="Entrez un nom valide! (pas de nombre ou de caractères spéciaux)";
    }
});

//validation de données sur le champ "Adresse"
let address                                                 = document.getElementById("address");
address.addEventListener("focusout", function(e) {
    let value                                               = e.target.value;
    value                                                   = value.trimStart();
    value                                                   = value.trimEnd();
    if(value.match(/^\w+[^@]+$/g)) {
        document.getElementById("addressErrorMsg").innerHTML = "";
        isAddressIsTrue                                     = true;
        displayBtn(isFirstNameIsTrue, isLastNameIsTrue, isAddressIsTrue, isCityIsTrue, isEmailIsTrue);
        address.value                                       = value;
        return value;
    }else{
        isAddressIsTrue                                     = false;
        displayBtn(isFirstNameIsTrue, isLastNameIsTrue, isAddressIsTrue, isCityIsTrue, isEmailIsTrue);
        document.getElementById("addressErrorMsg").innerHTML ="Entrez une addresse valide! (pas de caractères spéciaux)";
    }
});

//validation de données sur le champ "Ville"
let city                                                    = document.getElementById("city");
city.addEventListener("focusout", function(e) {
    let value                                               = e.target.value;
    value                                                   = value.trimStart();
    value                                                   = value.trimEnd();
    if(value.match(/^^\D+[^@]+$/g)) {
        document.getElementById("cityErrorMsg").innerHTML   = "";
        isCityIsTrue                                        = true;
        displayBtn(isFirstNameIsTrue, isLastNameIsTrue, isAddressIsTrue, isCityIsTrue, isEmailIsTrue);
        city.value                                          = value;
        return value;
    }else{
        isCityIsTrue                                        = false;
        displayBtn(isFirstNameIsTrue, isLastNameIsTrue, isAddressIsTrue, isCityIsTrue, isEmailIsTrue);
        document.getElementById("cityErrorMsg").innerHTML   ="Entrez un nom de ville valide! (pas de nombre ou de caractères spéciaux)";
    }
});

//validation de données sur le champ "Email"
let email                                                   = document.getElementById("email");
email.addEventListener("focusout", function(e) {
    let value                                               = e.target.value;
    value                                                   = value.trimStart();
    value                                                   = value.trimEnd();
    if(value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))+$/)){
        document.getElementById("emailErrorMsg").innerHTML  = "";
        isEmailIsTrue                                       = true;
        displayBtn(isFirstNameIsTrue, isLastNameIsTrue, isAddressIsTrue, isCityIsTrue, isEmailIsTrue);
        email.value                                         = value;
        return value;
    }else{
        isEmailIsTrue                                       = false;
        displayBtn(isFirstNameIsTrue, isLastNameIsTrue, isAddressIsTrue, isCityIsTrue, isEmailIsTrue);
        document.getElementById("emailErrorMsg").innerHTML  ="Entrez un email valide!";
    }
    
});

document.getElementById("order").addEventListener("click", function(){
    //je déclare la variable contenant le local Storage
    let newPanierLocalStorage   = JSON.parse(localStorage.getItem("monPanier"));
    //je crée un tableau vide
    let products                = [];
    //si le local Storage n'est pas vide
    if(newPanierLocalStorage    != null) {
        //je déclare une constante stockant monPanier (issu du Local Storage) transformé en tableau
        const paniers           = Object.entries(newPanierLocalStorage);
        //je boucle sur tous les articles de paniers
        paniers.forEach(([key, panierDansLocalStorage]) => {
            //je teste si la quantité du panierDansLeLocalStorage est positive
            if(panierDansLocalStorage.quantity > 0) {
            //si c'est le cas je l'ajoute à la fin du tableau products
            products.push(panierDansLocalStorage.id);  
            }
        });
        //je test si products.length est strictement positive et que tous les champs du formulaire sont bien remplis
        if(products.length > 0 && displayBtn(isFirstNameIsTrue, isLastNameIsTrue, isAddressIsTrue, isCityIsTrue, isEmailIsTrue) == true) {
        //je lance ma commande et je crée le paramètre de l'envoi
            let order = {
                "contact": {
                    "firstName": document.getElementById("firstName").value,
                    "lastName": document.getElementById("lastName").value,
                    "address":document.getElementById("address").value,
                    "city":document.getElementById("city").value,
                    "email":document.getElementById("email").value,
                },
    
                "products": products
            };
            //je crée ma requête POST pour envoyer au back le paramètre de l'envoi
            let promise = fetch(API_URL + "order", {
                method: "POST",
                headers: {
                'Accept': 'application/json', 
                'Content-Type': 'application/json'
                },
                //je transforme le paramètre de l'envoi en JSON (chaine de caractère)
                body: JSON.stringify(order)
            });
            /*j'attends le retour de la requête (si la requête est valide) avant de continuer l'éxécution du code car
            j'ai besoin du numéro de commande "order.Id" pour l'intégrer dans l'URL de la page de confirmation*/
            promise.then(async(res)=>{
                try{
                    const retourServeur     = await res.json();
                    document.location.href  = "confirmation.html?orderId="+ retourServeur.orderId;
                }
                //correspond à la capture de l'erreur et l'affichage adéquat pour l'utilisateur de cette dernière
                catch(e){
                    let erreur=document.getElementById("cart__items");
                    erreur.textContent      = "Erreur: Accès au serveur impossible ! La commande n'a pas abouti !";
                    erreur.style.color      = "red";
                    erreur.style.fontSize   = "1.7vw";
                }
            });
        }  
    };
});