let photos = window.localStorage.getItem("photos");
let categories = window.localStorage.getItem("categories");
if (photos === null ) {

const reponsePhotos = await fetch ('http://localhost:5678/api/works');
photos = await reponsePhotos.json();

const valeurPhotos = JSON.stringify(photos);

window.localStorage.setItem("photos", valeurPhotos);
}else{
  photos = JSON.parse(photos);
}

function genererPhotos(photos){
  for (let i = 0; i < photos.length; i++) {

    const article = photos[i];

    const divGallery = document.querySelector(".gallery");

    const photoElement = document.createElement("figure");

    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    const textElement = document.createElement("figcaption");
    textElement.innerText = `${article.title}`;

    divGallery.appendChild(photoElement);
    photoElement.appendChild(imageElement);
    photoElement.appendChild(textElement);
  }
}

genererPhotos(photos);


const reponseCategories = await fetch ('http://localhost:5678/api/categories');
categories = await reponseCategories.json();

const monSet = new Set(categories);
monSet.add(null);
console.log(monSet);

//Boutons 
const boutonTous = document.querySelector(".btn-tous");
boutonTous.addEventListener("click", function() {
    document.querySelector(".gallery").innerHTML = "";
    genererPhotos(photos);
});

for (let [id] of monSet.entries()){
  const divFiltres = document.querySelector(".filtres");

  const filtreElement = document.createElement("button");
  filtreElement.innerText = `${id.name}`;

  divFiltres.appendChild(filtreElement);

}

const btnObj = document.querySelector("button");
  btnObj.addEventListener("click", function(){
      document.querySelector(".gallery").innerHTML = "";
  })




