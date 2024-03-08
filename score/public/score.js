document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/getscore', {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data received from server:', data);
        $('#score').html(data.score);
        $('#tries').html(data.tries);
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById('logoutButton').addEventListener('click', function() {
        fetch('/logout', {
            method: 'POST',
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
            }
        })
        .catch(error => console.error('Erreur lors de la déconnexion:', error));
    });
}
);