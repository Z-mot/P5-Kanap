const API_URL   = "http://localhost:3000/api/products";
//Requête GET de l'API pour récupérer tous les articles
let promise     = fetch(API_URL, {
        method: "GET",
        headers: {
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
        },
   }
);	
//correspond à ce qui doit être fait si la requête envoie une réponse correct
promise.then(async(res)=>{
    try{
        //mise en attente du reste du code tant que pas de réponse 
        const data = await res.json();
        //création d'une boucle for permettant de récupérer chaque article de l'API jusqu'à ce que l'index [i] atteigne le nombre d'article contenu dans l'API
        for (let i = 0; i < data.length; i++) {
            
            //Création des éléments comme commenté dans le code HTML
            let carte_produit        	=document.getElementById('items');
            let lien              		=document.createElement("a");
            let carte					=document.createElement("article");
            let image_produit			=document.createElement("img");
            let nom_produit				=document.createElement("h3");
            let descr_produit			=document.createElement("p");
            
            
            /*mise en place du lien des images, des images du nom du produit
            et de la description du produit correspondant à la page product.html suivi de l'ID du produit cliqué*/
            lien.href="product.html?id="+data[i]._id;
            image_produit.src       	=data[i].imageUrl; 
            image_produit.setAttribute("alt", data[i].altTxt);        
            nom_produit.textContent   	=data[i].name; 
            descr_produit.textContent 	=data[i].description; 
            
            //Hiérarchisation des éléments avec la méthode "appendChild"
            carte_produit.appendChild(lien); 
            lien.appendChild(carte);
            carte.appendChild(image_produit);
            carte.appendChild(nom_produit);
            carte.appendChild(descr_produit);
        }
    }
    //correspond à la capture de l'erreur et l'affichage adéquat pour l'utilisateur de cette dernière
    catch(e){
        let erreur=document.getElementById("items");
        erreur.textContent="Erreur: Accès au serveur impossible ! Le contenu de la page ne peut pas être affiché!";
        erreur.style.color= "red";
        erreur.style.fontSize= "1.7vw";

    };
});

    