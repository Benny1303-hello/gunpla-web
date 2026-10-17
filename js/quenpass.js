let form = document.querySelector(".login-form");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    let email = document.getElementById("email").value.trim();

    if (!email) {
        alert("Please enter your email");
        return;
    }

    auth.sendPasswordResetEmail(email)
        .then(() => {
            alert("Đã gửi email đặt lại mật khẩu, vui lòng kiểm tra hộp thư!");
            location.href = "dkdn.html";
        })
        .catch((error) => {
            if (error.code === "auth/user-not-found") {
                alert("Email does not exist");
            } else if (error.code === "auth/invalid-email") {
                alert("Invalid email address");
            } else {
                alert(error.message);
            }
        });
});
