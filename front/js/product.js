let str = window.location.href;
let url = new URL(str);
let id = url.searchParams.get("id");

let api="http://localhost:3000/api/products/" + id;
fetch(api)		
	.then((res)=>res.json())
	.catch((err)=>{
		let erreurs=document.getElementsByClassName("item")
		//La méthode getElementsByClassName() renvoi un objet HTMLCollection, soit traitement comme un tableau et donc interrogation du tableau via une boucle for
		for(valeur of erreurs) {
			valeur.innerHTML = "Erreur: Accès au serveur impossible ! Le contenu de la page ne peut pas être affiché!";
			valeur.style.color = "red";
			valeur.style.fontSize = "2vw";
		}
	})
	.then((data)=>{
        
        console.log(data);
        let name = data.name;
        document.getElementById("title").innerHTML = name;
		//Création d'un input type hidden afin de pouvoir récupérer les informations nécessaire pour le panier sans que cela soit visible pour le user
		let identifiantProduit = document.createElement("input");
		identifiantProduit.setAttribute("type", "hidden");
		identifiantProduit.setAttribute("id", "item__id");
		identifiantProduit.value = data._id;
		let id = document.getElementsByClassName("item__content");
		//La méthode getElementsByClassName() renvoi un objet HTMLCollection, soit traitement comme un tableau et donc interrogation du tableau via une boucle for
		for(valeur of id) {
			valeur.appendChild(identifiantProduit);
		}

		let imageKanap = document.createElement("img");
		let images = document.getElementsByClassName("item__img");
		//La méthode getElementsByClassName() renvoi un objet HTMLCollection, soit traitement comme un tableau et donc interrogation du tableau via une boucle for
		for(valeur of images) {
			valeur.appendChild(imageKanap);
		}
		imageKanap.src = data.imageUrl;
		imageKanap.alt = data.altTxt;
		let price = data.price;
        document.getElementById("price").innerHTML = price;
		
		let description = data.description;
        document.getElementById("description").innerHTML = description;
		let colors = data.colors;
		let selectColors = document.getElementById("colors");
		//Pour que chaque option soit disponible selon l'ID du produit, nous utilisons une boucle for
		for (let color of colors)
		{
			let optionColor = document.createElement("option");
			optionColor.value = color;
			optionColor.text = color;
			selectColors.appendChild(optionColor);
		}
    });
	let btnAdd = document.getElementById("addToCart");


	//ajouter un produit dans le panier
	
	//j'écoute l'évenement click
	btnAdd.addEventListener("click",function(){
		
		//je récupère le panier dans le local storage
		let monPanier = JSON.parse(localStorage.getItem("monPanier"));
	
		//je definis les caractéristiques du nouveau panier
		let _id 		= document.getElementById("item__id").value;
		let color 		= document.getElementById("colors").value;
		let quantity 	= document.getElementById("quantity").value;
		
		
		//ici, je créé mon panier
		let panier = {
			color:color,
			quantity:parseInt(quantity),
			id:_id
		}
		
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
				//si un objet panier ayant la clé keyProduit est déjà dans mon panier, j'ajoute la quantité
				if(monPanier[keyProduit]){
					let monAncienPanier 	= monPanier[keyProduit];
					monAncienPanier.quantity += parseInt(panier.quantity);
					monPanier[keyProduit] 	= monAncienPanier;
				}else{
					//sinon j'ajoute le panier 
					monPanier[keyProduit] 	= panier;
				}
				// j'ajoute le panier dans mon localStorage
				localStorage.setItem("monPanier", JSON.stringify(monPanier));
			}
		}
		console.log(JSON.parse(localStorage.getItem("monPanier")))
	
	});
	
	function encode(str) {
		return str.replace(/./g, function(c) {
			return ('00' + c.charCodeAt(0)).slice(-3);
		});
	}
	
	function decode(str) {
		return str.replace(/.{3}/g, function(c) {
			return String.fromCharCode(c);
		});
	}

