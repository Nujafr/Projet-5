fetch("http://localhost:5678/api/works")
    .then(response => response.json())
    .then(data => {
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

        data.forEach(work => {
            gallery.appendChild(createFigure(work)); // Utiliser la fonction pour ajouter les éléments
        });

        // Créer le bouton "Tous"
        const allButton = document.createElement('button');
        allButton.textContent = 'Tous';
        
        // Ajouter un gestionnaire d'événements pour le clic sur le bouton "Tous"
        allButton.addEventListener('click', () => {
            gallery.innerHTML = ''; // Vider la galerie
            data.forEach(work => {
                gallery.appendChild(createFigure(work)); // Utiliser la fonction
            });
        });

        filter.appendChild(allButton); // Ajouter le bouton "Tous" au filtre

        const categories = new Set(); // Créer un ensemble pour les catégories uniques

        data.forEach(work => {
            categories.add(work.category.name); // Ajouter chaque catégorie à l'ensemble
        });

        categories.forEach(category => {
            const button = document.createElement('button');
            button.name = category;
            button.textContent = category; // Ajouter le texte du bouton

            // Ajouter un gestionnaire d'événements pour le clic
            button.addEventListener('click', () => {
                // Filtrer les objets en fonction de la catégorie
                const filteredWorks = data.filter(work => work.category.name === category);
                gallery.innerHTML = ''; // Vider la galerie avant d'ajouter les objets filtrés
                filteredWorks.forEach(work => {
                    gallery.appendChild(createFigure(work)); // Utiliser la fonction
                });
            });

            filter.appendChild(button);
        });
    })
    .catch(error => {
        console.error('Erreur:', error);
    })

    // Système de Token et vérification Login

    document.addEventListener('DOMContentLoaded', function() {
        const token = localStorage.getItem('authToken');
    
        if (!token) {
            console.log('Utilisateur non connecté')
        } else {
            console.log('Utilisateur connecté');
        }
    });
    