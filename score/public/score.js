$.get('/setscore').then((data) => {
    $('#score').html(data.score);
    console.log('data : ', data)
});

