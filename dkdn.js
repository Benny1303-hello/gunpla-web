let form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value.trim();
  console.log(email,password)

  if(!email || !password){
    alert("Please enter email and password");
  }else{
    let users = JSON.parse(localStorage.getItem("users"));
    let user = users.find((account) => {
      return account.email === email && account.password === password;
    });

    console.log(user)

    if(user){
        localStorage.setItem("userSession", JSON.stringify(user));
        alert("Login successfully");
        location.href = "./index.html";
    }else{
        alert("Email or password is incorrect");
    }
  }
});