//Gestion modal
let modal = null
/* const focusableSelector = 'i'
let focusables = [] 
let previouslyFocusedElement = null*/

const openModal = function (e) {
  e.preventDefault()
  modal = document.querySelector(e.target.getAttribute('href'))
  //focusables = Array.from(modal.querySelectorAll(focusableSelector))
  //previouslyFocusedElement = document.querySelector(':focus')
  modal.style.display = null
  //focusables[0].focus() 
  modal.removeAttribute('aria-hidden')
  modal.setAttribute('aria-modal', 'true')
  modal.addEventListener('click', closeModal)
  modal.querySelector('.js-close-modal').addEventListener('click', closeModal)
  modal.querySelector('.js-stop-modal').addEventListener('click', stopPropagation)
}

const closeModal = function (e) {
  if(modal === null) return
  //if (previouslyFocusedElement !== null) previouslyFocusedElement.focus()
  e.preventDefault()
  modal.style.display = "none"
  modal.setAttribute('aria-hidden', 'true')
  modal.removeAttribute('aria-modal')
  modal.removeEventListener('click', closeModal)
  modal.querySelector('.js-close-modal').removeEventListener('click', closeModal)
  modal.querySelector('.js-stop-modal').removeEventListener('click', stopPropagation)
  modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

/* const focusInModal = function(e) {
    e.preventDefault()
    let index = focusables.findIndex(modal.querySelector(':focus'))
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
} */

document.querySelectorAll('.js-modal').forEach(a => {
  a.addEventListener('click', openModal);
})

window.addEventListener('keydown', function(e) {
    if(e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    /* if (e.key === "Tab" && modal !== null) {
        focusInModal(e)
    } */
})

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

function genererPhotosModal(photos){
    for (let i = 0; i < photos.length; i++) {
  
      const article = photos[i];
  
      const divGallery = document.querySelector(".galleryModal");
  
      const photoElement = document.createElement("figure");

      let photoDelete = document.createElement("i");
      photoDelete.className = "fa-solid fa-trash-can";
      
      const imageElement = document.createElement("img");
      imageElement.src = article.imageUrl;

      const textElement = document.createElement("figcaption");
      textElement.innerText = `éditer`;
  
      divGallery.appendChild(photoElement);
      
      photoElement.appendChild(photoDelete);
      photoElement.appendChild(imageElement);
      photoElement.appendChild(textElement);
    }
  }
  
  genererPhotosModal(photos);