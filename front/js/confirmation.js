//j'efface le local Storage après la validation de commande
localStorage.clear();

//déclaration de la variable pour créer un nouvel objet URL partir de l'URL de la page affiché
let url = new URL(window.location.href);

//déclaration de la variable pour capturer (retourner) le parametre "orderId" contenu dans l'URL
let orderId = url.searchParams.get("orderId");

//afficher dans l'élément #orderId la variable orderId
document.getElementById("orderId").innerHTML = orderId;