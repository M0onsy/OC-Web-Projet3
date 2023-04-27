let authentification = sessionStorage.getItem(authToken);
const logged = document.getElementById('edit');
if (authToken !== null) {
  logged.style.display = "initial";
}


async function genererPhotos(photos){

  const reponsePhotos = await fetch ('http://localhost:5678/api/works');
  photos = await reponsePhotos.json();

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

async function getCategories(categories) {
  const reponseCategories = await fetch ('http://localhost:5678/api/categories');
  categories = await reponseCategories.json();

  let monSet = categories;
  monSet = [{name:"Tous", id:0}, ...monSet];
}
getCategories(categories);

let monSet = categories;
monSet = [{name:"Tous", id:0}, ...monSet];

//Boutons 

for (let id in monSet){
  const divFiltres = document.querySelector(".filtres");

  const filtreElement = document.createElement("button");
  filtreElement.innerText = `${id.name}`;

  divFiltres.appendChild(filtreElement);

  filtreElement.addEventListener("click", function(){
      document.querySelector(".gallery").innerHTML = "";
      let obj;
      if ( id.id === 0){
        obj=photos;
      }
      else {
        obj = photos.filter(e=>{return e.categoryId == id.id});
      }
      genererPhotos(obj);
  })
}















