/*$.get('/setscore').then((data) => {
    $('#score').html(data.scoreData);
});*/
fetch('/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    },
})
.then(response => response.json())
.then(data => {
    // Display results
    console.log(data);
    document.getElementById('score').innerHTML = data.score;
    document.getElementById('tries').innerHTML = data.tries;
})
.catch(error => console.error('Error:', error));
