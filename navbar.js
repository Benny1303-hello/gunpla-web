const loginLink = document.getElementById("login-link");

if (loginLink && localStorage.getItem("userSession")) {
    loginLink.style.display = "none";
}