let dataCollected = [];
let categoryCollected = [];
const gallery = document.querySelector('.gallery');
const filter = document.querySelector('.filter');

// Fonction pour créer un élément figure avec image et légende
function createFigure(work) {
    const figure = document.createElement('figure');
    const img = document.createElement('img');
    img.src = work.imageUrl;
    img.alt = work.title;
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = work.title;
    figure.appendChild(img);
    figure.appendChild(figcaption);
    return figure;
}

function createAllButton() {
    // Créer le bouton "Tous"
    const allButton = document.createElement('button');
    allButton.textContent = 'Tous';

    // Ajouter un gestionnaire d'événements pour le clic sur le bouton "Tous"
    allButton.addEventListener('click', () => {
        gallery.innerHTML = ''; // Vider la galerie
        dataCollected.forEach(work => {
            gallery.appendChild(createFigure(work)); // Utiliser la fonction
        });
    });

    filter.appendChild(allButton); // Ajouter le bouton "Tous" au filtre
}

async function fetchCategories() {
    return (
        fetch("http://localhost:5678/api/categories")
            .then((res) => res.json())
            .then((data) => {
                return data
            })

            .catch((error) => {

                return error;

            })
    );
}

categoryCollected = await fetchCategories();

function CreateFiltersAndButtons() {
    console.log(categoryCollected);
    categoryCollected.forEach(category => {
        const button = document.createElement('button');
        button.name = category.name;
        button.textContent = category.name; // Ajouter le texte du bouton

        // Ajouter un gestionnaire d'événements pour le clic
        button.addEventListener('click', () => {
            // Filtrer les objets en fonction de la catégorie
            const filteredWorks = dataCollected.filter(work => work.category.name === category.name);
            gallery.innerHTML = ''; // Vider la galerie avant d'ajouter les objets filtrés
            filteredWorks.forEach(work => {
                gallery.appendChild(createFigure(work)); // Utiliser la fonction
            });
        });

        filter.appendChild(button);
})
}

fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {
        dataCollected = data;

        dataCollected.forEach(work => {
            gallery.appendChild(createFigure(work)); // Utiliser la fonction pour ajouter les éléments
        });

        createAllButton();
        CreateFiltersAndButtons();
    })
    .catch(error => {
        console.error('Erreur:', error);
    })

// Système de Token et vérification Login


    const token = localStorage.getItem('authToken');

    if (!token) {
        console.log('Utilisateur non connecté')
    } else {
        console.log('Utilisateur connecté');
    }
