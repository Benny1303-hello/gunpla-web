let form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let username = document.getElementById("username").value.trim();
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  let confirmPassword = document.getElementById("confirmPassword").value.trim();

  let lowerCaseLetter = /[a-z]/g;
  let upperCaseLetter = /[A-Z]/g;
  let numbers = /[0-9]/g;

  if (username.length < 6) {
    alert("Username must be at least 6 characters");
  } else if (password.length < 8) {
    alert("Password must be at least 8 characters");
  } else if (!password.match(lowerCaseLetter)) {
    alert("Password must contain a lowercase letter");
  } else if (!password.match(upperCaseLetter)) {
    alert("Password must contain an uppercase letter");
  } else if (!password.match(numbers)) {
    alert("Password must contain a number");
  } else if (password !== confirmPassword) {
    alert("Passwords do not match!");
  } else {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    let isExist = users.some(user => user.email === email);
    if (isExist) {
        alert("This email is already registered!");
        return; 
    }

    let newAccount = {
      email,
      password,
      username,
    };

    users.push(newAccount);
    localStorage.setItem("users", JSON.stringify(users));

    alert("User created successfully, please login");
    location.href = "./dkdn.html";
  }
});