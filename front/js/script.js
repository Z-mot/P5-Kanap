let api="http://localhost:3000/api/products";
fetch(api)		
	.then((res)=>res.json())
	.catch((err)=>{
		let erreur=document.getElementById("items");
		erreur.textContent="Erreur: Accès au serveur impossible ! Le contenu de la page ne peut pas être affiché!";
        erreur.style.color= "red";
        erreur.style.fontSize= "1.7vw";

	})
	.then((donneesViennentDuServeur)=>{
        console.log(donneesViennentDuServeur);
        //création d'une boucle for permettant de récupérer chaque article de l'API 
        for (let index = 0; index <donneesViennentDuServeur.length; index++) {
			
            //Création des éléments comme commenté dans le code HTML
			let carte_produit        	=document.getElementById('items');
            let lien              		=document.createElement("a");
            let carte					=document.createElement("article");
            let image_produit			=document.createElement("img");
            let nom_produit				=document.createElement("h3");
            let descr_produit			=document.createElement("p");
            
			//Hiérarchisation des éléments avec la méthode "appendChild"
			carte_produit.appendChild(lien); 
			lien.href="product.html?id="+donneesViennentDuServeur[index]._id;
            lien.appendChild(carte); 
            carte.appendChild(image_produit);
            image_produit.src       	=donneesViennentDuServeur[index].imageUrl;
            carte.appendChild(nom_produit);
            nom_produit.textContent   	=donneesViennentDuServeur[index].name;
            carte.appendChild(descr_produit);
            descr_produit.textContent 	=donneesViennentDuServeur[index].description;    
		}
    });

    