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

// Fonction pour créer le bouton de filtre "Tous"
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

// Fonction pour récupérer les catégories
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

// Fonction pour créer les boutons de filtre
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
  icon.style.cssText =
    "padding-right: 10px; font-weight: bold; text-align: center; padding: 15px; background-color: black; color: white;";
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
  modifier.style.cssText =
    "color: black; font-size: 12px; padding-left: 20px; font-weight: bold;";
  modifier.insertBefore(icon2, modifier.firstChild);
  document
    .getElementById("portfolio")
    .getElementsByTagName("h2")[0]
    .appendChild(modifier);
}

function createHTMLModal() {
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.style.cssText =
    "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 999;";

  const modal = document.createElement("div");
  modal.id = "modal";
  modal.style.cssText =
    "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); z-index: 1000;";

  const modalTitle = document.createElement("h3");
  modalTitle.id = "titleModal";
  modalTitle.textContent = "Galerie Photo";
  modalTitle.style.cssText =
    "margin: 20px; text-align: center; font-weight: 400; font-size: 26px;";
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  modal.appendChild(modalTitle);
}

// bouton "Ajouter des photos"
function AddPhotoButton() {
  const addButton = document.createElement("button");
  const modal = document.getElementById("modal");
  addButton.textContent = "Ajouter des photos";
  addButton.style.cssText =
    "width: 237px; height: 36px; border-radius: 60px; background-color: #1D6154; color: white; border: none; cursor: pointer; font-size: 14px; font-weight: 700; display: block; margin: 20px auto;";
  addButton.addEventListener("click", () => {
    modal.style.display = "none"; // Cacher la première modale
    createAddPhotoModal(modal, overlay); // Passer la modale et l'overlay pour les réafficher
  });
  modal.appendChild(addButton);
}

// Fonction pour fermer la modale
function CloseModal() {
  const closeButton = document.createElement("span");
  closeButton.innerHTML = "×";
  closeButton.style.cssText =
    "position: absolute; top: 10px; right: 10px; font-size: 30px; cursor: pointer;";
  closeButton.addEventListener("click", () => {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
  });
  modal.appendChild(closeButton);

  overlay.addEventListener("click", () => {
    document.body.removeChild(modal);
    document.body.removeChild(overlay);
  });
}
// Fonction pour créer la modale
function createmodal() {
  modifier.addEventListener("click", () => {
    if (document.getElementById("modal")) return; // Sortir si la modale est déjà ouverte

    createHTMLModal();

    //Fichiers Galerie ajoutés dans la modale
    dataCollected.forEach((work) => {

      const modal = document.getElementById("modal");
      const imgContainer = document.createElement("div");
      imgContainer.style.cssText =
        "position: relative; display: inline-block; margin: 10px; text-align: center;";

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.style.cssText = "width: 100px; height: auto;";

      const deleteIcon = document.createElement("span");
      deleteIcon.innerHTML = "🗑️"; // Utilisez une icône ou une image pour la poubelle
      deleteIcon.style.cssText =
        "position: absolute; top: 5px; right: 5px; cursor: pointer;";

      imgContainer.appendChild(img);
      imgContainer.appendChild(deleteIcon);
      modal.appendChild(imgContainer);

      // Gestionnaire d'événements pour supprimer l'élément
      deleteIcon.addEventListener("click", async (e) => {
        e.stopPropagation(); // Empêche la fermeture de la modale

        // Supprimer l'élément de dataCollected
        const itemId = work.id;
        dataCollected = dataCollected.filter((item) => item.id !== itemId); // Met à jour le tableau

        // Appeler l'API pour supprimer l'élément du serveur
        try {
          await fetch(`http://localhost:5678/api/works/${itemId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Si vous utilisez un token d'authentification
            },
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
    });
    
    AddPhotoButton();
    CloseModal();
  });
}

// Nouvelle fonction pour créer la modale d'ajout de photos
function createAddPhotoModal(parentModal, parentOverlay) {
  const overlay = document.createElement("div");
  overlay.id = "overlay";
  overlay.style.cssText =
    "position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.5); z-index: 999;";

  const modal = document.createElement("div");
  modal.id = "add-photo-modal";
  modal.style.cssText =
    "position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); z-index: 1000; display: flex; flex-direction: column; align-items: center;";

  const title = document.createElement("h3");
  title.textContent = "Ajout Photo";
  title.style.cssText = "font-size: 26px; font-weight: 400; margin: 20px;";
  modal.appendChild(title);

  // Création de l'élément contenant l'image
  const container = document.createElement("div");
  container.style.cssText =
    "width: 420px; height: 169px; border-radius: 3px; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #f0f8ff; position: relative;";

  // Icone de l'image
  const imageIcon = document.createElement("i");
  imageIcon.className = "fa-regular fa-image";
  imageIcon.style.cssText =
    "font-size: 76px; color: #B9C5CC; margin-bottom: 10px; margin-top: 20px;";

  // Bouton "Ajouter photo"
  const button = document.createElement("button");
  button.innerText = "+ Ajouter photo";
  button.style.cssText =
    "padding: 10px 20px; border-radius: 20px; background-color: #CBD6DC; color: #306685; border: none; cursor: pointer; font-size: 16px;";

  // Événement pour choisir un fichier localement
  button.addEventListener("click", () => {
    imageInput.click(); // Simule le clic sur l'input de fichier
  });

  // Champ pour l'image
  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.accept = "image/*";
  imageInput.style.cssText = "display: none;"; // Cacher l'input de fichier

  // Ajout d'un gestionnaire d'événements pour l'input de fichier
  imageInput.addEventListener("change", () => {
    if (imageInput.files && imageInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Créer une image pour l'aperçu
        const previewImage = document.createElement("img");
        previewImage.src = e.target.result; // Utiliser le résultat du FileReader
        previewImage.style.cssText = "width: 50%; height: 100%;"; // Ajuster la taille de l'aperçu

        // Remplacer l'icône par l'aperçu
        container.innerHTML = ""; // Vider le conteneur
        container.appendChild(previewImage); // Ajouter l'aperçu
      };
      reader.readAsDataURL(imageInput.files[0]); // Lire le fichier comme URL de données
    }
  });

  // Texte sous le bouton
  const text = document.createElement("p");
  text.innerText = "jpg, png : 4mo max";
  text.style.cssText =
    "font-size: 12px; color: #444444; margin-top: 10px; margin-bottom: 20px;";

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
  imageTitle.style.cssText =
    "font-size: 14px; font-weight: 500; margin-top: 20px; margin-bottom: 5px;";
  modal.appendChild(imageTitle);

  // Champ pour le titre
  const titleInput = document.createElement("input");
  titleInput.placeholder = "Titre";
  titleInput.style.cssText =
    "width: 100%; height: 30px; border-radius: 3px; border: none; box-shadow: 0px 4px 14px 0px #00000017;";
  modal.appendChild(titleInput);

  // Titre pour la catégorie
  const categoryTitle = document.createElement("h4");
  categoryTitle.textContent = "Catégorie";
  categoryTitle.style.cssText =
    "font-size: 14px; font-weight: 500; margin-top: 20px; margin-bottom: 5px;";
  modal.appendChild(categoryTitle);

  // Champ pour la catégorie
  const categoryInput = document.createElement("select");
  categoryInput.style.cssText =
    "width: 100%; height: 30px; border-radius: 3px; border: none; box-shadow: 0px 4px 14px 0px #00000017;";
  categoryCollected.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id; // Utiliser l'ID de la catégorie
    option.text = category.name;
    categoryInput.appendChild(option);
  });
  modal.appendChild(categoryInput);

  // Trait de séparation entre l'input et le bouton
  const separator = document.createElement("hr");
  separator.style.cssText =
    "width: 50%; height: 1px; border-top: 1px solid #A7A7A7; margin-top: 40px; margin-bottom: 40px;";
  modal.appendChild(separator);

  // Bouton pour soumettre
  const submitButton = document.createElement("button");
  submitButton.textContent = "Valider";
  submitButton.style.cssText =
    "width: 237px; height: 36px; border-radius: 60px; background-color: #A7A7A7; color: white; border: none; cursor: pointer; font-size: 14px; font-weight: 700;";

  // Ajoutez un gestionnaire d'événements pour vérifier les champs à chaque changement
  imageInput.addEventListener("change", updateSubmitButton);
  titleInput.addEventListener("input", updateSubmitButton);
  categoryInput.addEventListener("change", updateSubmitButton);

  function updateSubmitButton() {
    if (
      imageInput.files.length > 0 &&
      titleInput.value &&
      categoryInput.value
    ) {
      submitButton.style.backgroundColor = "#1D6154";
    } else {
      submitButton.style.backgroundColor = "#A7A7A7";
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
    formData.append("image", imageInput.files[0]); // Ajoutez l'image
    formData.append("title", titleInput.value); // Ajoutez le titre
    formData.append("category", categoryInput.value); // Ajoutez l'ID de la catégorie

    // Appeler l'API pour ajouter la photo
    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Token d'authentification
        },
        body: formData, // Envoyer les données au serveur via FormData
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
  closeButton.style.cssText =
    "position: absolute; top: 10px; right: 10px; font-size: 30px; cursor: pointer;";
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
} else {
  console.log("Utilisateur connecté");

  createEditHeader();
  createmodal();
}
