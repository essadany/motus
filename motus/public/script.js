document.addEventListener("DOMContentLoaded", (event) => {
  const form = document.getElementById("wordForm");
  const resultDiv = document.getElementById("result");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const inputWord = document.getElementById("wordInput").value.toLowerCase();

    // Send the word to the server for checking
    fetch("/checkword", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        word: inputWord,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("displaying score data");
        console.log(data);

        resultDiv.innerHTML = ""; // Clear previous results

        // Display results
        data.result.forEach((item) => {
          const span = document.createElement("span");
          span.textContent = item.letter;
          span.classList.add(item.class);
          resultDiv.appendChild(span);
        });
      })
      .catch((error) => console.error("Error:", error));
  });

  document
    .getElementById("logoutButton")
    .addEventListener("click", function () {
      fetch("/logout", {
        method: "POST",
      })
        .then((response) => {
          if (response.redirected) {
            window.location.href = response.url;
          }
        })
        .catch((error) =>
          console.error("Erreur lors de la déconnexion:", error)
        );
    });
});
