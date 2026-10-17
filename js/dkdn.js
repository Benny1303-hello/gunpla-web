let form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
  } else {
    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        alert("Login successfully");
        location.href = "../index.html";
      })
      .catch((error) => {
        alert("Email or password is incorrect");
      });
  }
});
