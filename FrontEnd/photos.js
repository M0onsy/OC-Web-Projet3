async function main() {
  let authToken = sessionStorage.getItem('authToken');
  const filtersContainer = document.querySelector(".filtres");
  const galleryContainer = document.querySelector(".gallery");

  const logged1 = document.getElementById('edit1');
  const logged2 = document.getElementById('edit2');
  const logged3 = document.getElementById('edit3');
  const hideFilters = document.getElementById('filtres')
  if (authToken !== null) {
    logged1.style.display = "flex";
    logged2.style.display = "flex";
    logged3.style.display = "flex";
    hideFilters.style.display = "none;"
  }


  async function genererPhotos(photos, categoryId){
    const reponsePhotos = await fetch ('http://localhost:5678/api/works');
    const articles = await reponsePhotos.json();
  
    // Supprimer toutes les photos existantes dans la galerie
    galleryContainer.innerHTML = '';
  
    for (const article of articles) {
      // Ajouter la photo à la galerie uniquement si elle appartient à la catégorie sélectionnée
      if (categoryId === 0 || article.categoryId === categoryId) {
        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;
        const textElement = document.createElement("figcaption");
        textElement.innerText = `${article.title}`;
    
        const photoElement = document.createElement("figure");
        photoElement.appendChild(imageElement);
        photoElement.appendChild(textElement);
    
        galleryContainer.appendChild(photoElement);
    
        // Ajouter chaque photo au tableau "photos"
        photos.push({
          url: article.imageUrl,
          categoryId: article.categoryId
        });
      }
    }
  }
  
  let photos = [];
  await genererPhotos(photos, 0);

  async function getCategories() {
    const reponseCategories = await fetch ('http://localhost:5678/api/categories');
    const categories = await reponseCategories.json();
    return categories;
  }

  let categories = await getCategories();
  const monSet = [{name:"Tous", id:0}, ...categories];
  console.log(monSet)

  // Boutons de filtre
  for (const category of monSet) {
    const filterButton = document.createElement("button");
    filterButton.innerText = category.name;
  
    filtersContainer.appendChild(filterButton);
  
    filterButton.addEventListener("click", function () {
      // Récupérer les photos filtrées
      const filteredPhotos = photos.filter(photo => category.id === 0 || photo.categoryId === category.id);
  
      // Générer la galerie avec les photos filtrées
      genererPhotos(filteredPhotos, category.id);
    });
  }
}

main();
