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
  // Ajouter un gestionnaire d'événements pour ouvrir la fenêtre modale
  modifier.addEventListener("click", () => {
    // Vérifier si la modale existe déjà
    if (document.getElementById("modal")) return; // Sortir si la modale est déjà ouverte

    // Créer l'overlay
    const overlay = document.createElement("div");
    overlay.id = "overlay"; // Ajouter un ID pour identifier l'overlay
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Couleur noire avec opacité
    overlay.style.zIndex = "999"; // Doit être en dessous de la modale

    // Créer la fenêtre modale
    const modal = document.createElement("div");
    modal.id = "modal"; // Ajouter un ID pour identifier la modale
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.backgroundColor = "white";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
    modal.style.zIndex = "1000"; // Doit être au-dessus de l'overlay

    // Ajouter un contenu à la modale
    const modalContent = document.createElement("h3");
    modalContent.textContent = "Galerie Photo";
    modal.appendChild(modalContent);

    // Ajouter un bouton pour fermer la modale
    const closeButton = document.createElement("button");
    closeButton.textContent = "Fermer";
    closeButton.addEventListener("click", () => {
      document.body.removeChild(modal); // Fermer la modale
      document.body.removeChild(overlay); // Retirer l'overlay
    });
    modal.appendChild(closeButton);

    document.body.appendChild(overlay); // Ajouter l'overlay au corps
    document.body.appendChild(modal); // Ajouter la modale au corps
  });
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
