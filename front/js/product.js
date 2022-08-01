//déclaration de la variable pour créer un nouvel objet URL partir de l'URL de la page affiché
let url = new URL(window.location.href);

//déclaration de la variable pour capturer (retourner) le parametre "id" contenu dans l'URL
let id = url.searchParams.get("id");

//transformation d'une chaine de caractère en entier
let encode = string => {
	return string.replace(/./g, function(c) {
		return ('00' + c.charCodeAt(0)).slice(-3);
	});
}
//transformation d'un entier en chaine de caractère
let decode = string => {
	return string.replace(/.{3}/g, function(c) {
		return String.fromCharCode(c);
	});
}
const API_URL = "http://localhost:3000/api/products/";
/*Requête GET de l'API pour récupérer l'article sur lequel nous avons cliqué
nous rajoutons à la fin de l'URL de l'API l'id du produit (provenant de la variable ci-dessus) afin de ne charger que ce dernier*/
let promise = fetch( API_URL + id, {
	method: "GET",
        headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
        },
   }
); 
//correspond à ce qui doit être fait si la requête envoie une réponse correct	
promise.then(async(res)=> {
	try {
		//mise en attente du reste du code tant que pas de réponse 
		const data = await res.json();
		document.getElementById("title").innerHTML 		= data.name;
		let imageKanap 									= document.createElement("img");
		let images 										= document.getElementsByClassName("item__img");
		//La méthode getElementsByClassName() renvoi un objet HTMLCollection, soit traitement comme un tableau et donc interrogation du tableau via une boucle for
		for(valeur of images) {
			valeur.appendChild(imageKanap);
		}
		imageKanap.src 									= data.imageUrl;
		imageKanap.alt 									= data.altTxt;
		document.getElementById("price").innerHTML	 	= data.price;
		document.getElementById("description").innerHTML = data.description;
		let colors 										= data.colors;
		let selectColors 								= document.getElementById("colors");
		//Pour que chaque option soit disponible selon l'Id du produit, nous utilisons une boucle for
		for (let color of colors) {
			//création de l'élément option
			let optionColor 							= document.createElement("option");
			optionColor.value 							= color;
			optionColor.text 							= color;
			selectColors.appendChild(optionColor);
		}
	}
	//correspond à la capture de l'erreur et l'affichage adéquat pour l'utilisateur de cette dernière
	catch(e){
		let erreurs=document.getElementsByClassName("item")
		//La méthode getElementsByClassName() renvoi un objet HTMLCollection, soit traitement comme un tableau et donc interrogation du tableau via une boucle for
		for(valeur of erreurs) {
			valeur.innerHTML = "Erreur: Accès au serveur impossible ! Le contenu de la page ne peut pas être affiché!";
			valeur.style.color = "red";
			valeur.style.fontSize = "2vw";
		}
	}
});

let btnAdd = document.getElementById("addToCart");

//j'écoute l'évenement click
btnAdd.addEventListener("click",function(){
	
	/*je récupère le panier dans le local storage
	JSON.parse permet de transformer une chaine de caractère en objet*/
	let monPanier = JSON.parse(localStorage.getItem("monPanier"));

	//je definis les caractéristiques du nouveau panier
	let _id 		= id;
	let color 		= document.getElementById("colors").value;
	let quantity 	= document.getElementById("quantity").value;
	
	
	//ici, je créé mon objet panier
	let panier = {
		color	:color,
		//parseInt permet de transformer une chaine de caractère en nombre entier
		quantity:parseInt(quantity),
		id		:_id
	}
	
	//si le nouveau panier n'a pas de couleur et quantité, je dis à l'utilisateur de les mentionner 
	if(panier.color == "" || panier.quantity == 0) {
		alert("Choissiez une couleur et/ou une quantité");
		return false;
	}else{
		
		//si mon panier ne contient pas quelque chose, c'est à dire vide
		if(!monPanier) {
			//je crée un clé du produit, composé de l'id et la couleur que j'encode
			let keyProduit 			= encode(panier.id + "-" +panier.color) ;
			monPanier 				= {};
			monPanier[keyProduit] 	= panier;
			/*je pousse dans le localStorage le panier en question
			JSON.stringify permet de transformer un objet en chaine de caractère 
			car le localStorage ne peut contenir qu'une chaine de caractère*/
			localStorage.setItem("monPanier", JSON.stringify(monPanier));
		}else{
			
			/*si mon panier  contient quelque chose
			je crée un clé du produit, composé de l'id et la couleur que j'encode*/
			let keyProduit 				= encode(panier.id + "-" +panier.color) ;
			//si un objet panier ayant la clé keyProduit est déjà dans mon panier, j'ajoute la quantité
			if(monPanier[keyProduit]){
				let monNouveauPanier 	= monPanier[keyProduit];
				monNouveauPanier.quantity += parseInt(panier.quantity);
				monPanier[keyProduit] 	= monNouveauPanier;
			}else{
				//sinon j'ajoute le panier 
				monPanier[keyProduit] 	= panier;
			}
			// j'ajoute le panier dans mon localStorage
			localStorage.setItem("monPanier", JSON.stringify(monPanier));
		}
	}
});

