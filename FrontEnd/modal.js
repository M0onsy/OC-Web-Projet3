//Gestion modal
// Déclaration des variables
const focusableSelector = 'i';
const modalElements = document.querySelectorAll('.js-modal');
let focusables = [];
let previouslyFocusedElement;
let modalElement;

// Fonction pour ouvrir la modal
const openModal = (e) => {
  e.preventDefault();
  modalElement = document.querySelector(e.target.getAttribute('href'));
  focusables = [...modalElement.querySelectorAll(focusableSelector)];
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
  e.preventDefault();
  modalElement.style.display = 'none';
  modalElement.setAttribute('aria-hidden', 'true');
  modalElement.removeAttribute('aria-modal');
  modalElement.removeEventListener('click', closeModal);
  modalElement.querySelector('.js-close-modal').removeEventListener('click', closeModal);
  modalElement.querySelector('.js-stop-modal').removeEventListener('click', stopPropagation);
  modalElement = null;
};

// Fonction pour empêcher la propagation de l'événement
const stopPropagation = (e) => {
  e.stopPropagation();
};

// Fonction pour changer le focus dans la modal
const focusInModal = (e) => {
  e.preventDefault();
  let index = focusables.findIndex(modalElement.querySelector(':focus'));
  if (e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusable.length - 1
    }
    focusables[index].focus()
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

let photos = window.localStorage.getItem("photos");
let categories = window.localStorage.getItem("categories");

if (photos === null) {
  fetch('http://localhost:5678/api/works')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      photos = data;
      const valeurPhotos = JSON.stringify(photos);
      window.localStorage.setItem("photos", valeurPhotos);
      genererPhotosModal(photos);
    })
    .catch(error => {
      console.error('Error fetching photos:', error);
    });
} else {
  photos = JSON.parse(photos);
  genererPhotosModal(photos);
}

function genererPhotosModal(photos) {
  const divGallery = document.querySelector(".galleryModal");
  divGallery.innerHTML = ''; 
  for (let i = 0; i < photos.length; i++) {

    const article = photos[i];

    const photoElement = document.createElement("figure");

    let photoDelete = document.createElement("i");
    photoDelete.className = "fa-solid fa-trash-can js-delete";
    photoDelete.addEventListener('click', function() {
      const id = article.id; 
      deletePhoto(id); 
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
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    const photoElement = document.querySelector(`[data-id="${id}"]`); 
    if (photoElement) {
      photoElement.remove(); 
    }
  })
  .catch(error => {
    console.error('Error deleting photo:', error);
  });
}

// Récupérer le bouton "Supprimer"
const deleteButton = modalElement.querySelector('.js-delete');

// Vérifier que l'élément existe
if (deleteButton) {
  // Ajouter un gestionnaire d'événements pour le bouton "Supprimer"
  deleteButton.addEventListener('click', () => {
    const fileId = modalElement.getAttribute('data-file-id');
    if (confirm(`Êtes-vous sûr de vouloir supprimer le fichier ${fileId} ?`)) {
      supprimerPhoto(fileId);
      closeModal();
    }
  });
}

// Fonction pour ajouter un fichier
const addFile = (data) => {
  fetch('http://localhost:5678/api/files', {
    method: 'POST',
    body: data
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Afficher un message de confirmation d'ajout
      console.log(`Le fichier ${data.id} a été ajouté`);
    })
    .catch(error => {
      console.error('Error adding file:', error);
    });
};

// Ajouter un gestionnaire d'événements pour le bouton "Ajouter"
modalElement.querySelector('.js-add-file').addEventListener('click', () => {
  const fileInput = modalElement.querySelector('.js-file-input');
  const file = fileInput.files[0];
  if (file) {
    const formData = new FormData();
    formData.append('file', file);
    addFile(formData);
    closeModal();
  }
});

// Ajouter le bouton "Ajouter" à votre modal
const addButton = document.createElement('button');
addButton.classList.add('js-add-file');
addButton.textContent = 'Ajouter';
modalElement.appendChild(addButton);

// Ajouter un champ d'entrée de fichier à votre modal
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.classList.add('js-file-input');
modalElement.appendChild(fileInput);
