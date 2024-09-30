let dataCollected = [];
let categoryCollected = [];
const gallery = document.querySelector(".gallery");
const filter = document.querySelector(".filter");
const modifier = document.createElement("span");

// Fonction pour créer un élément figure avec image et légende
function createFigure(work) {
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = work.imageUrl;
  img.alt = work.title;
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  return figure;
}

function createAllButton() {
  // Créer le bouton "Tous"
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";

  // Ajouter un gestionnaire d'événements pour le clic sur le bouton "Tous"
  allButton.addEventListener("click", () => {
    gallery.innerHTML = ""; // Vider la galerie
    dataCollected.forEach((work) => {
      gallery.appendChild(createFigure(work)); // Utiliser la fonction
    });
  });

  filter.appendChild(allButton); // Ajouter le bouton "Tous" au filtre
}

async function fetchCategories() {
  return fetch("http://localhost:5678/api/categories")
    .then((res) => res.json())
    .then((data) => {
      return data;
    })

    .catch((error) => {
      return error;
    });
}

categoryCollected = await fetchCategories();

function CreateFiltersAndButtons() {
  console.log(categoryCollected);
  categoryCollected.forEach((category) => {
    const button = document.createElement("button");
    button.name = category.name;
    button.textContent = category.name; // Ajouter le texte du bouton

    // Ajouter un gestionnaire d'événements pour le clic
    button.addEventListener("click", () => {
      // Filtrer les objets en fonction de la catégorie
      const filteredWorks = dataCollected.filter(
        (work) => work.category.name === category.name
      );
      gallery.innerHTML = ""; // Vider la galerie avant d'ajouter les objets filtrés
      filteredWorks.forEach((work) => {
        gallery.appendChild(createFigure(work)); // Utiliser la fonction
      });
    });

    filter.appendChild(button);
  });
}

// Fonction pour créer le visuel Edition quand login
function createEditHeader() {
  const header = document.createElement("div");
  const icon = document.createElement("i");
  icon.classList.add("fa-solid", "fa-pen-to-square");
  header.textContent = "Mode Edition";
  header.insertBefore(icon, header.firstChild);
  icon.style.paddingRight = "10px";
  header.style.fontWeight = "bold";
  header.style.textAlign = "center";
  header.style.padding = "15px";
  header.style.backgroundColor = "black";
  header.style.color = "white";
  document.body.prepend(header);

  const connected = document.getElementById("connected");
  connected.textContent = "logout";
  connected.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    window.location.reload();
  });

  const icon2 = document.createElement("i");
  icon2.classList.add("fa-solid", "fa-pen-to-square");
  modifier.textContent = "Modifier";
  modifier.style.color = "black";
  modifier.style.fontSize = "12px";
  modifier.style.paddingLeft = "20px";
  modifier.style.fontWeight = "bold";
  modifier.insertBefore(icon2, modifier.firstChild);
  document
    .getElementById("portfolio")
    .getElementsByTagName("h2")[0]
    .appendChild(modifier);
}

function createmodal() {
  modifier.addEventListener("click", () => {
    if (document.getElementById("modal")) return; // Sortir si la modale est déjà ouverte

    const overlay = document.createElement("div");
    overlay.id = "overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.zIndex = "999";

    const modal = document.createElement("div");
    modal.id = "modal";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "white";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    modal.style.zIndex = "1000";

    const modalTitle = document.createElement("h3");
    modalTitle.textContent = "Galerie Photo";
    modalTitle.style.margin = "20px";
    modalTitle.style.textAlign = "center";
    modalTitle.style.fontWeight = "400";
    modalTitle.style.fontSize = "26px";
    modal.appendChild(modalTitle);

    //Fichiers Galerie ajoutés dans la modale
    dataCollected.forEach(work => {
      const imgContainer = document.createElement("div");
      imgContainer.style.position = "relative";
      imgContainer.style.display = "inline-block";
      imgContainer.style.margin = "10px";
      imgContainer.style.textAlign = "center";
    

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.style.width = "100px";
      img.style.height = "auto";

      const deleteIcon = document.createElement("span");
      deleteIcon.innerHTML = "🗑️"; // Utilisez une icône ou une image pour la poubelle
      deleteIcon.style.position = "absolute";
      deleteIcon.style.top = "5px";
      deleteIcon.style.right = "5px";
      deleteIcon.style.cursor = "pointer";

      // Gestionnaire d'événements pour supprimer l'élément
      deleteIcon.addEventListener("click", async (e) => {
        e.stopPropagation(); // Empêche la fermeture de la modale

        // Supprimer l'élément de dataCollected
        const itemId = work.id; 
        dataCollected = dataCollected.filter(item => item.id !== itemId); // Met à jour le tableau

        // Appeler l'API pour supprimer l'élément du serveur
        try {
          await fetch(`http://localhost:5678/api/works/${itemId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem("authToken")}` // Si vous utilisez un token d'authentification
            }
          });
          imgContainer.remove(); // Supprime l'élément de la modale
          gallery.innerHTML = ""; // Vider la galerie
          dataCollected.forEach((work) => {
            gallery.appendChild(createFigure(work)); // Met à jour la galerie
          });
        } catch (error) {
          console.error("Erreur lors de la suppression de l'élément :", error);
        }
      });

      imgContainer.appendChild(img);
      imgContainer.appendChild(deleteIcon);
      modal.appendChild(imgContainer);
    });

    // bouton "Ajouter des photos"
    const addButton = document.createElement("button");
    addButton.textContent = "Ajouter des photos";
    addButton.style.width = '237px';
    addButton.style.height = '36px';
    addButton.style.borderRadius = '60px';
    addButton.style.backgroundColor = '#1D6154';
    addButton.style.color = 'white';
    addButton.style.border = 'none';
    addButton.style.cursor = 'pointer';
    addButton.style.fontSize = '14px';
    addButton.style.fontWeight = '700';
    addButton.style.display = "block";
    addButton.style.margin = "20px auto";
    addButton.addEventListener("click", () => {
      modal.style.display = "none"; // Cacher la première modale
      createAddPhotoModal(modal, overlay); // Passer la modale et l'overlay pour les réafficher
    });
    modal.appendChild(addButton);

    const closeButton = document.createElement("span");
    closeButton.innerHTML = "×"
    closeButton.style.position = "absolute";
    closeButton.style.top = "10px";
    closeButton.style.right = "10px";
    closeButton.style.fontSize = "30px";
    closeButton.style.cursor = "pointer";
    closeButton.addEventListener("click", () => {
      document.body.removeChild(modal);
      document.body.removeChild(overlay);
    });
    modal.appendChild(closeButton);

    overlay.addEventListener("click", () => {
      document.body.removeChild(modal);
      document.body.removeChild(overlay);
    });

    document.body.appendChild(overlay);
    document.body.appendChild(modal);
  });
}

// Nouvelle fonction pour créer la modale d'ajout de photos
function createAddPhotoModal(parentModal, parentOverlay) {
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "999";

  const modal = document.createElement("div");
  modal.id = "add-photo-modal";
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = "white";
  modal.style.padding = "20px";
  modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  modal.style.zIndex = "1000";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.alignItems = "center";

  const title = document.createElement("h3");
  title.textContent = "Ajout Photo";
  title.style.fontSize = '26px';
  title.style.fontWeight = '400';
  title.style.margin = '20px';
  modal.appendChild(title);

  // Création de l'élément contenant l'image
  const container = document.createElement('div');
  container.style.width = '420px';
  container.style.height = '169px';
  container.style.borderRadius = '3px';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.justifyContent = 'center';
  container.style.backgroundColor = '#f0f8ff';
  container.style.position = 'relative';

  // Icone de l'image
  const imageIcon = document.createElement('i');
  imageIcon.className = 'fa-regular fa-image';
  imageIcon.style.fontSize = '76px';
  imageIcon.style.color = '#B9C5CC';
  imageIcon.style.marginBottom = '10px';
  imageIcon.style.marginTop = '20px';

  // Bouton "Ajouter photo"
  const button = document.createElement('button');
  button.innerText = '+ Ajouter photo';
  button.style.padding = '10px 20px';
  button.style.borderRadius = '20px';
  button.style.backgroundColor = '#CBD6DC';
  button.style.color = '#306685'; 
  button.style.border = 'none';
  button.style.cursor = 'pointer';
  button.style.fontSize = '16px';

  // Événement pour choisir un fichier localement
  button.addEventListener('click', () => {
    imageInput.click(); // Simule le clic sur l'input de fichier
  });

  // Champ pour l'image
  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.accept = "image/*";
  imageInput.style.display = "none"; // Cacher l'input de fichier

  // Ajout d'un gestionnaire d'événements pour l'input de fichier
  imageInput.addEventListener('change', () => {
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Créer une image pour l'aperçu
        const previewImage = document.createElement('img');
        previewImage.src = e.target.result; // Utiliser le résultat du FileReader
        previewImage.style.width = '50%'; // Ajuster la taille de l'aperçu
        previewImage.style.height = '100%';

        // Remplacer l'icône par l'aperçu
        container.innerHTML = ''; // Vider le conteneur
        container.appendChild(previewImage); // Ajouter l'aperçu
      };
      reader.readAsDataURL(imageInput.files[0]); // Lire le fichier comme URL de données
    }
  });

  // Texte sous le bouton
  const text = document.createElement('p');
  text.innerText = 'jpg, png : 4mo max';
  text.style.fontSize = '12px';
  text.style.color = '#444444';
  text.style.marginTop = '10px';
  text.style.marginBottom = '20px';

  // Ajout des éléments au conteneur
  container.appendChild(imageIcon);
  container.appendChild(button);
  container.appendChild(text);

  // Ajout du conteneur à la modale
  modal.appendChild(container);
  modal.appendChild(imageInput); // Ajout de l'input caché à la modale

  // Titre pour l'image
  const imageTitle = document.createElement("h4");
  imageTitle.textContent = "Titre";
  imageTitle.style.fontSize = '14px';
  imageTitle.style.fontWeight = '500';
  imageTitle.style.marginTop = '20px';
  imageTitle.style.marginBottom = '5px';
  modal.appendChild(imageTitle);

  // Champ pour le titre
  const titleInput = document.createElement("input");
  titleInput.placeholder = "Titre";
  titleInput.style.width = '100%';
  titleInput.style.height = '30px';
  titleInput.style.borderRadius = '3px';
  titleInput.style.border = 'none';
  titleInput.style.boxShadow = '0px 4px 14px 0px #00000017';
  modal.appendChild(titleInput);

  // Titre pour la catégorie
  const categoryTitle = document.createElement("h4");
  categoryTitle.textContent = "Catégorie";
  categoryTitle.style.fontSize = '14px';
  categoryTitle.style.fontWeight = '500';
  categoryTitle.style.marginTop = '20px';
  categoryTitle.style.marginBottom = '5px';
  modal.appendChild(categoryTitle);

  // Champ pour la catégorie
  const categoryInput = document.createElement("select");
  categoryInput.style.width = '100%';
  categoryInput.style.height = '30px';
  categoryInput.style.borderRadius = '3px';
  categoryInput.style.border = 'none';
  categoryInput.style.boxShadow = '0px 4px 14px 0px #00000017';
  categoryCollected.forEach(category => {
    const option = document.createElement("option");
    option.value = category.id; // Utiliser l'ID de la catégorie
    option.text = category.name;
    categoryInput.appendChild(option);
  });
  modal.appendChild(categoryInput);

  // Trait de séparation entre l'input et le bouton
  const separator = document.createElement("hr");
  separator.style.width = '50%';
  separator.style.height = '1px';
  separator.style.borderTop = '1px solid #A7A7A7';
  separator.style.marginTop = '40px';
  separator.style.marginBottom = '40px';
  modal.appendChild(separator);

  // Bouton pour soumettre
  const submitButton = document.createElement("button");
  submitButton.textContent = "Valider";
  submitButton.style.width = '237px';
  submitButton.style.height = '36px';
  submitButton.style.borderRadius = '60px';
  submitButton.style.backgroundColor = '#A7A7A7';
  submitButton.style.color = 'white';
  submitButton.style.border = 'none';
  submitButton.style.cursor = 'pointer';
  submitButton.style.fontSize = '14px';
  submitButton.style.fontWeight = '700';

  // Ajoutez un gestionnaire d'événements pour vérifier les champs à chaque changement
  imageInput.addEventListener('change', updateSubmitButton);
  titleInput.addEventListener('input', updateSubmitButton);
  categoryInput.addEventListener('change', updateSubmitButton);

  function updateSubmitButton() {
    if (imageInput.files.length > 0 && titleInput.value && categoryInput.value) {
      submitButton.style.backgroundColor = '#1D6154';
    } else {
      submitButton.style.backgroundColor = '#A7A7A7';
    }
  }

  submitButton.addEventListener("click", async () => {
    // Vérification des champs
    if (!imageInput.files || imageInput.files.length === 0) {
      alert("Veuillez sélectionner une image.");
      return;
    }
    if (!titleInput.value) {
      alert("Veuillez entrer un titre.");
      return;
    }
    if (!categoryInput.value) {
      alert("Veuillez choisir une catégorie.");
      return;
    }

    // Création d'un objet FormData pour envoyer les données
    const formData = new FormData();
    formData.append('image', imageInput.files[0]); // Ajoutez l'image
    formData.append('title', titleInput.value); // Ajoutez le titre
    formData.append('category', categoryInput.value); // Ajoutez l'ID de la catégorie

    // Appeler l'API pour ajouter la photo
    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("authToken")}` // Token d'authentification
        },
        body: formData // Envoyer les données au serveur via FormData
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la photo");
      }

      const newWork = await response.json(); // Récupérer le nouvel élément ajouté
      dataCollected.push(newWork); // Ajouter à dataCollected
      gallery.appendChild(createFigure(newWork)); // Met à jour la galerie
      modal.remove(); // Fermer la modale d'ajout
      overlay.remove(); // Fermer l'overlay
    } catch (error) {
      console.error("Erreur lors de l'ajout de la photo :", error);
    }
  });
  modal.appendChild(submitButton);

  // Bouton de fermeture
  const closeButton = document.createElement("span");
  closeButton.innerHTML = "×";
  closeButton.style.position = "absolute";
  closeButton.style.top = "10px";
  closeButton.style.right = "10px";
  closeButton.style.fontSize = "30px";
  closeButton.style.cursor = "pointer";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
    parentModal.style.display = "block";
  });
  modal.appendChild(closeButton);

  document.addEventListener("click", (e) => {
    if (e.target === overlay) {
      document.body.removeChild(modal);
      document.body.removeChild(overlay);
      parentModal.style.display = "block";
    }
  });

  document.body.appendChild(overlay);
  document.body.appendChild(modal);
}



fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    dataCollected = data;

    dataCollected.forEach((work) => {
      gallery.appendChild(createFigure(work)); // Utiliser la fonction pour ajouter les éléments
    });

    createAllButton();
    CreateFiltersAndButtons();
  })
  .catch((error) => {
    console.error("Erreur:", error);
  });

// Système de Token et vérification Login

const token = localStorage.getItem("authToken");

if (!token) {
  console.log("Utilisateur non connecté");
} 

else {
  console.log("Utilisateur connecté");

  createEditHeader();
  createmodal();
}