//Gestion modal
// Déclaration des variables
let authToken = sessionStorage.getItem('authToken');
const focusableSelector = 'i';
const modalElements = document.querySelectorAll('.js-modal');
let focusables = [];
let previouslyFocusedElement;
let modalElement;
let isAddingFile = false;

let titleInput;
let fileInput;
let addButton;

// Fonction pour ouvrir la modal
const openModal = (e) => {
  e.preventDefault();
  modalElement = document.querySelector(e.target.getAttribute('href'));
  focusables = Array.from(modalElement.querySelectorAll(focusableSelector));
  previouslyFocusedElement = document.querySelector(':focus');

  if (modalElement.classList.contains('js-add')) {
    showAddPhotoInterface();
  } else {
    modalElement.style.display = null;
    focusables[0].focus();
    modalElement.removeAttribute('aria-hidden');
    modalElement.setAttribute('aria-modal', 'true');
    modalElement.addEventListener('click', closeModal);
    modalElement.querySelector('.js-close-modal').addEventListener('click', closeModal);
    modalElement.querySelector('.js-stop-modal').addEventListener('click', stopPropagation);
  }
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
  const divGallery = document.querySelector(".galleryModal");
  divGallery.innerHTML = '';

  for (const photo of photos) {
    const article = photo;

    const photoElement = document.createElement("figure");

    let photoDelete = document.createElement("i");
    photoDelete.className = "fa-solid fa-trash-can js-delete";
    photoDelete.addEventListener('click', function () {
      const id = article.id;
      if (confirm(`Êtes-vous sûr de vouloir supprimer le fichier ${id} ?`)) {
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

//Fonction pour changer l'affichage de la modal
const showAddPhotoInterface = () => {
  const galleryModal = document.querySelector('.galleryModal');
  const addPhotoModal = document.querySelector('.addPhotoModal');
  const modalTitle = document.querySelector('.js-modal-title');
  const closeButton = document.querySelector('.js-close-modal');
  const backButton = document.querySelector('.js-stop-modal');
  fileInput = document.querySelector('.js-file-input');
  titleInput = document.querySelector('.js-title-input');
  const categorySelect = document.querySelector('.js-category-select');
  addButton = document.querySelector('.js-add-button');

  galleryModal.style.display = 'none';
  addPhotoModal.style.display = 'flex';
  modalTitle.textContent = 'Ajout photo';
  fileInput.value = '';
  titleInput.value = '';
  categorySelect.value = '';
  addButton.disabled = true;

  closeButton.addEventListener('click', closeModal);
  backButton.addEventListener('click', showGalleryInterface);
  fileInput.addEventListener('change', handleFileInputChange);
  titleInput.addEventListener('input', handleInputValidation);
  categorySelect.addEventListener('change', handleInputValidation);
  addButton.addEventListener('click', handleAddButtonClick);
};

const showGalleryInterface = () => {
  const galleryModal = document.querySelector('.galleryModal');
  const addPhotoModal = document.querySelector('.addPhotoModal');

  galleryModal.style.display = 'block';
  addPhotoModal.style.display = 'none';
};

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
    const photoElement = document.querySelector(`[data-id="${id}"]`); 
    if (photoElement) {
      photoElement.remove(); 
    }
  })
  .catch(error => {
    console.log('Error deleting photo:', error);
  });
}


document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal);
});

window.addEventListener('keydown', function(e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e)
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e)
  }
});

let photos = [];
let categories = window.localStorage.getItem("categories");

fetch('http://localhost:5678/api/works')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    photos = data;
    genererPhotosModal(photos);
  })
  .catch(error => {
    console.error('Error fetching photos:', error);
  });

// Ajouter le bouton "Ajouter une photo" à votre modal
const btnAjout = document.querySelector('.btnAjout');
modalElement = document.createElement('div');
modalElement.classList.add('js-add');
 
const changeButton = document.createElement('button');
changeButton.classList.add('js-modal');
changeButton.textContent = 'Ajouter une photo';

modalElement.appendChild(changeButton);
btnAjout.appendChild(modalElement);

const handleFileInputChange = () => {
  const fileInput = document.querySelector('.js-file-input');
  addButton = document.querySelector('.js-add-button');
  addButton.disabled = fileInput.files.length === 0;
};

const handleInputValidation = () => {
  const titleInput = document.querySelector('.js-title-input');
  const categorySelect = document.querySelector('.js-category-select');
  addButton = document.querySelector('.js-add-button');
  addButton.disabled = titleInput.value.trim() === '' || categorySelect.value === '';
};

const handleAddButtonClick = async () => {
  const fileInput = document.querySelector('.js-file-input');
  const titleInput = document.querySelector('.js-title-input');
  const categorySelect = document.querySelector('.js-category-select');

  const file = fileInput.files[0];
  const title = titleInput.value;
  const category = categorySelect.value;

  if (file && title !== '' && category !== '') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', title);
    formData.append('category', category);

    
    const response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      // Traitez la réponse de l'API ici
      console.log(data);
      // Réinitialisez les valeurs des champs après la réussite de la requête
      fileInput.value = '';
      titleInput.value = '';
      categorySelect.value = '';
      addButton.disabled = true;
      // Affichez un message de réussite ou effectuez d'autres actions nécessaires
      alert('Photo ajoutée avec succès!');
    })
    .catch(error => {
      // Gérez les erreurs de la requête
      console.error('Erreur lors de l\'ajout de la photo:', error);
      // Affichez un message d'erreur ou effectuez d'autres actions nécessaires
      alert('Une erreur est survenue lors de l\'ajout de la photo.');
    });
  };
}
// Gestionnaire d'événements
/*
fileInput.addEventListener('change', handleFileInputChange);
titleInput.addEventListener('input', handleInputValidation);
categorySelect.addEventListener('change', handleInputValidation);
*/
addButton.addEventListener('click', handleAddButtonClick);
