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
    // Bước 1: tạo tài khoản đăng nhập trên Firebase Authentication
    auth.createUserWithEmailAndPassword(email, password)
      .then((credential) => {
        let user = credential.user;

        // Bước 2: lưu thông tin người dùng vào Firestore (role_id = 2 là khách hàng)
        let thongTin = {
          username: username,
          email: email,
          fullName: "",
          phone: "",
          address: "",
          role_id: 2,
        };

        db.collection("users").doc(user.uid).set(thongTin)
          .then(() => {
            alert("User created successfully, please login");
            location.href = "dkdn.html";
          })
          .catch((error) => {
            alert("Lưu thông tin thất bại: " + error.message);
          });
      })
      .catch((error) => {
        if (error.code === "auth/email-already-in-use") {
          alert("This email is already registered!");
        } else if (error.code === "auth/invalid-email") {
          alert("Invalid email address");
        } else if (error.code === "auth/weak-password") {
          alert("Password is too weak");
        } else {
          alert(error.message);
        }
      });
  }
});
