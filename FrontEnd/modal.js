//Gestion modal
// Déclaration des variables
let authToken = sessionStorage.getItem('authToken');
const focusableSelector = 'i';
const modalElements = document.querySelectorAll('.js-modal');
let focusables = [];
let previouslyFocusedElement;
let modalElement;
let isAddingFile = false;
const affichageInitial = document.querySelector('.modal-content');
const addPhotoModal = document.querySelector('.addPhotoModal');

const fileInput = document.querySelector('.js-file-input');
const titleInput = document.querySelector('.js-title-input');
const categorySelect = document.querySelector('.js-category-select');
const addButton = document.querySelector('.js-add-button');

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

//Fonction d'ajout 
async function addPhoto(data) {
  let fileInput = document.querySelector('.js-file-input');
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
  formData.append('photo', file);
  formData.append('title', title);
  formData.append('category', category);

  try {
    let response = await fetch('http://localhost:5678/api/works', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    console.log('Le fichier a été téléchargé avec succès.');
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
const btnInterface = document.querySelector('.btnInterface');
modalElement = document.createElement('div');
modalElement.classList.add('js-add');
 
const changeButton = document.createElement('button');
changeButton.classList.add('js-add-interface');
changeButton.textContent = 'Ajouter une photo';

modalElement.appendChild(changeButton);
btnInterface.appendChild(modalElement);

changeButton.addEventListener('click', function() {
  affichageInitial.style.display = 'none';
  addPhotoModal.style.display = 'flex';
});

const ajoutBtn = document.querySelector('.js-add-button');
ajoutBtn.addEventListener('click', addPhoto);

console.log(ajoutBtn);