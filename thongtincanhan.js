let userSession = JSON.parse(localStorage.getItem("userSession"));

if (!userSession) {
    location.href = "./dkdn.html";
}

document.getElementById("fullName").value = userSession.fullName || "";
document.getElementById("email").value = userSession.email || "";
document.getElementById("phone").value = userSession.phone || "";
document.getElementById("address").value = userSession.address || "";

document.getElementById("saveBtn").onclick = function () {

    userSession.fullName = document.getElementById("fullName").value;
    userSession.email = document.getElementById("email").value;
    userSession.phone = document.getElementById("phone").value;
    userSession.address = document.getElementById("address").value;

    localStorage.setItem("userSession", JSON.stringify(userSession));

    let users = JSON.parse(localStorage.getItem("users")) || [];

    for (let i = 0; i < users.length; i++) {

        if (users[i].username == userSession.username) {

            users[i].fullName = userSession.fullName;
            users[i].email = userSession.email;
            users[i].phone = userSession.phone;
            users[i].address = userSession.address;

        }

    }

    localStorage.setItem("users", JSON.stringify(users));

    alert("Cập nhật thành công!");

}