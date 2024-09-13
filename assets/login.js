document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
  
    fetch("http://localhost:5678/api/users/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: document.getElementById('email').value,
          password: document.getElementById('password').value
        })
      })
      .then(response => {
        console.log('Statut HTTP:', response.status); // Affiche le statut HTTP (par ex: 200, 401)
        return response.json();
      })
      .then(data => {
        console.log('Réponse API:', data);  // Affiche la réponse complète de l'API
  
        if (data.token) {  // Si un token est présent, c'est que la connexion est réussie
          console.log('Connexion réussie !');
          localStorage.setItem('authToken', data.token);
          window.location.href = 'index.html';

        } else {
          // Si pas de token, afficher le message d'erreur
          document.getElementById('error-message').style.display = 'block';
        }
      })
      .catch(error => {
        console.error('Erreur:', error);
        document.getElementById('error-message').style.display = 'block';
      });
  });
  