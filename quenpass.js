let form = document.querySelector(".login-form");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let email = document.getElementById("email").value.trim();
    let newPassword = document.getElementById("newPassword").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    let user = users.find(u => u.email === email);

    if (!user) {
        alert("Email does not exist");
        return;
    }

    user.password = newPassword;

    localStorage.setItem("users", JSON.stringify(users));

    alert("Password changed successfully");

    window.location.href = "./dkdn.html";
});