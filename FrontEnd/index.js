async function main() {
    // Déclaration des variables
    let authToken = sessionStorage.getItem('authToken');
    const filtersContainer = document.querySelector(".filtres");
    const galleryContainer = document.querySelector(".gallery");
    const focusableSelector = 'i';
    const modalElements = document.querySelectorAll('.js-modal');
    let focusables = [];
    let previouslyFocusedElement;
    let modalElement;
    let isAddingFile = false;
    const affichageInitial = document.querySelector('.modal-content');
    const addPhotoModal = document.querySelector('.addPhotoModal');
    const backButton = document.querySelector('.js-back-modal');
    let fileInput = document.querySelector('.js-file-input');
    const titleInput = document.querySelector('.js-title-input');
    const categorySelect = document.querySelector('.js-category-select');
    const addButton = document.querySelector('.js-add-button');
    const modalEntete = document.querySelector('.o2page');
    const preview = document.querySelector('.preview');
    let divGallery = document.querySelector(".galleryModal");
    let logoutButton = document.querySelector(".logout");

    fileInput.style.opacity = 0;

    //Gestion modifications après connexion
    const logged0 = document.getElementById('edit0');
    const logged1 = document.getElementById('edit1');
    const logged2 = document.getElementById('edit2');
    const hideFilters = document.getElementById('filtres');
    const logout = document.getElementById('logout');
    const login = document.getElementById('login');
    if (authToken !== null) {
      logged0.style.paddingTop = "0";
      logged1.style.display = "flex";
      logged2.style.display = "flex";
      hideFilters.style.display = "none";
      logout.style.display = "initial";
      login.style.display = "none";
  
    }
  
    //Déclaration des fonctions 
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
          photoElement.setAttribute('data-id', article.id);
          photoElement.appendChild(imageElement);
          photoElement.appendChild(textElement);
      
          galleryContainer.appendChild(photoElement);
      
          // Ajouter chaque photo au tableau "photos"
          let index = photos.findIndex(e => e.categoryId === article.categoryId);
          if (index == -1){
            photos.push({
              url: article.imageUrl,
              categoryId: article.categoryId
            });
          } 
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

    // Fonction pour ouvrir la modal
    const openModal = (e) => {
        e.preventDefault();
        modalElement = document.querySelector(e.target.getAttribute('href'));
        focusables = Array.from(modalElement.querySelectorAll(focusableSelector));
        previouslyFocusedElement = document.querySelector(':focus');
  
        modalElement.style.display = null;
        focusables[0].focus();
        modalElement.removeAttribute('aria-hidden');
        modalElement.setAttribute('aria-modal', 'true');
        modalElement.addEventListener('click', closeModal);
        modalElement.querySelector('.js-close-modal').addEventListener('click', closeModal);
        modalElement.querySelector('.js-stop-modal').addEventListener('click', stopPropagation);
    };

    // Fonction pour fermer la modal
    const closeModal = (e) => {
        if (modalElement === null) return;
        if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
        if (e && e.preventDefault) {
            e.preventDefault();
    }
        modalElement.style.display = 'none';
        modalElement.setAttribute('aria-hidden', 'true');
        modalElement.removeAttribute('aria-modal');
        modalElement.removeEventListener('click', closeModal);
        modalElement.querySelector('.js-close-modal').removeEventListener('click', closeModal);
        modalElement.querySelector('.js-stop-modal').removeEventListener('click', stopPropagation);

        //Rétablir l'affichage initial de la modal
        affichageInitial.style.display = 'block';
        addPhotoModal.style.display = 'none';
        backButton.style.display = 'none';

        modalElement = null;
        modalElement = document.getElementById('modal1');
        modalElement.style.display = 'none';
    };
 
    // Fonction pour empêcher la propagation de l'événement
    const stopPropagation = (e) => {
        e.stopPropagation();
    };

    // Fonction pour changer le focus dans la modal
    const focusInModal = (e) => {
        e.preventDefault();
        let index = focusables.findIndex(element => element === modalElement.querySelector(':focus'));
        if (e.shiftKey === true) {
            index--;
        } else {
            index++;
        }
        if (index >= focusables.length) {
            index = 0;
        }
        if (index < 0) {
            index = focusables.length - 1;
        }
            focusables[index].focus();
    };

    //Fonction pour afficher les photos dans la modal
    async function genererPhotosModal(photos) {
      const reponsePhotos = await fetch ('http://localhost:5678/api/works');
      const articles = await reponsePhotos.json();

      let divGallery = document.querySelector(".galleryModal");
      divGallery.innerHTML = '';
  
      for (const article of articles) {

  
            const photoElement = document.createElement("figure");
  
            let photoDelete = document.createElement("i");
            photoDelete.className = "fa-solid fa-trash-can js-delete";
            photoDelete.addEventListener('click', function () {
                const id = article.id;
                if (confirm(`Êtes-vous sûr de vouloir supprimer le fichier ?`)) {
                    deletePhoto(id);
                }
            });
  
            const imageElement = document.createElement("img");
            imageElement.src = article.imageUrl;
  
            const textElement = document.createElement("figcaption");
            textElement.innerText = `éditer`;
  
            photoElement.setAttribute('data-id', article.id);
  
            divGallery.appendChild(photoElement);
  
            photoElement.appendChild(photoDelete);
            photoElement.appendChild(imageElement);
            photoElement.appendChild(textElement);
        }
    }

    //Fonction de suppresion
    function deletePhoto(id) {
        fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        }
        })
        .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return true;
        })
        .then(data => {
        photos = photos.filter(photo => photo.id !== id);
        const photoElement = document.querySelectorAll(`[data-id="${id}"]`); 
        
          
        if (photoElement) {
            photoElement.forEach(element => {
              element.remove();
            })
            
        }
        })
        .catch(error => {
        console.log('Error deleting photo:', error);
        });
        
    }

    //Fonction d'ajout 
    async function addPhoto() {
        let titleInput = document.querySelector('.js-title-input');
        let categorySelect = document.querySelector('.js-category-select');
    
         
        let file = fileInput.files[0];
        let title = titleInput.value;
        let category = categorySelect.value;
    
        if (!file || !title || !category) {
        console.error('Veuillez remplir tous les champs.');
        return;
        }
    
        let formData = new FormData();
        formData.append('title', title);
        formData.append('image', file);
        formData.append('category', category);
    
        console.log(formData);
        
        try {
        let response = await fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
            'Accept' : 'multipart/form-data',
            'Authorization': `Bearer ${authToken}`
            },
            body: formData
        });
        
    
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
    
        console.log('Le fichier a été téléchargé avec succès.');
        genererPhotos(photos, 0);
        genererPhotosModal(photos);
        return true;
        } catch (error) {
        console.error('Une erreur est survenue lors du téléchargement du fichier:', error);
        return false;
        }
    }

    //Fonction de vérification des champs du formData
    function checkFields() {
        if (fileInput.value && titleInput.value && categorySelect.value) {
        addButton.removeAttribute('disabled');
        } else {
        addButton.setAttribute('disabled', 'true');
        }
    }

    //Gestionnaire d'évènements sur les champs du formData
    fileInput.addEventListener('change', updateImageDisplay);
    fileInput.addEventListener('input', checkFields);
    titleInput.addEventListener('input', checkFields);
    categorySelect.addEventListener('input', checkFields);

    document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal);
    });

    window.addEventListener('keydown', function(e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    });

    let photosGallery = [];
    let categoriesGallery = window.localStorage.getItem("categories");
    

    fetch('http://localhost:5678/api/works')
    .then(response => {
        if (!response.ok) {
        throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        photosGallery = data;
        genererPhotosModal(photosGallery);
    })
    .catch(error => {
        console.error('Error fetching photos:', error);
    });

    // Ajouter le bouton "Ajouter une photo" à votre modal
    const btnInterface = document.querySelector('.btnInterface');
    modalElement = document.createElement('div');
    modalElement.classList.add('js-switch');
    
    const changeButton = document.createElement('button');
    changeButton.classList.add('js-add-interface');
    changeButton.textContent = 'Ajouter une photo';

    modalElement.appendChild(changeButton);
    btnInterface.appendChild(modalElement);
    
    changeButton.addEventListener('click', function() {
    affichageInitial.style.display = 'none';
    addPhotoModal.style.display = 'flex';
    backButton.style.display = 'initial';
    modalEntete.style.display = 'flex';
    });

    const ajoutBtn = document.querySelector('.js-add-button');
    ajoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      addPhoto();
      closeModal();
    });

    //Gérez le click sur la flèche de retour 
    backButton.addEventListener('click', function() {
        affichageInitial.style.display = 'initial';
        addPhotoModal.style.display = 'none';
        backButton.style.display = 'none';
        document.querySelector('.filePreview img').src = '';
    })

    //Fonction pour se déconnecter
    logoutButton.addEventListener('click', function() {
      sessionStorage.clear();
      logged0.style.paddingTop = "60px";
      logged1.style.display = "none";
      logged2.style.display = "none";
      hideFilters.style.display = "flex";
      logout.style.display = "none";
      login.style.display = "initial";
    })

    //Fonction pour prévisualiser l'image avant de l'upload
    function updateImageDisplay() {
        while(preview.firstChild) {
          preview.removeChild(preview.firstChild);
        }
      
        const curFiles = fileInput.files;
        if (curFiles.length === 0) {
          const para = document.createElement('p');
          para.textContent = 'No files currently selected for upload';
          preview.appendChild(para);
        } else {
          const list = document.createElement('ol');
          preview.appendChild(list);
      
          for (const file of curFiles) {
            const listItem = document.createElement('li');
            listItem.classList.add('filePreview');
            const para = document.createElement('p');
            if (validFileType(file)) {
              const image = document.createElement('img');
              image.src = URL.createObjectURL(file);
      
              listItem.appendChild(image);
              listItem.appendChild(para);
            } else {
              para.textContent = `File name ${file.name}: Not a valid file type. Update your selection.`;
              listItem.appendChild(para);
            }
      
            list.appendChild(listItem);
          }
        }
      }

      const fileTypes = [
        "image/jpeg",
        "image/pjpeg",
        "image/png",
      ];

      function validFileType(file) {
        return fileTypes.includes(file.type);
      }
  }
  
  main();
  







  















