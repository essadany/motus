/*$.get('/setscore').then((data) => {
    $('#score').html(data.score);
    console.log('data : ', data)
});*/

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
