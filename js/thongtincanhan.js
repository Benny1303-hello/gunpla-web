auth.onAuthStateChanged((user) => {
    if (!user) {
        location.href = "dkdn.html";
        return;
    }

    document.getElementById("email").value = user.email || "";
    document.getElementById("email").readOnly = true;

    db.collection("users").doc(user.uid).get().then((doc) => {
        let data = {};

        if (doc.exists) {
            data = doc.data();
        }

        // Có họ tên thì dùng họ tên, chưa có thì tạm dùng username lúc đăng ký
        let hoTen = "";
        if (data.fullName) {
            hoTen = data.fullName;
        } else if (data.username) {
            hoTen = data.username;
        }

        document.getElementById("fullName").value = hoTen;
        document.getElementById("phone").value = data.phone || "";
        document.getElementById("address").value = data.address || "";

        // role_id = 1 là admin, role_id = 2 là khách hàng
        if (data.role_id === 1) {
            document.getElementById("role-label").textContent = "Quyền: Quản trị viên (Admin)";
            document.getElementById("admin-area").style.display = "block";
            loadAllUsers();
        } else {
            document.getElementById("role-label").textContent = "Quyền: Khách hàng";
        }
    });

    document.getElementById("saveBtn").onclick = function () {
        let fullName = document.getElementById("fullName").value;
        let phone = document.getElementById("phone").value;
        let address = document.getElementById("address").value;

        let thongTinMoi = {
            fullName: fullName,
            phone: phone,
            address: address,
            email: user.email,
        };

        db.collection("users").doc(user.uid).set(thongTinMoi, { merge: true }).then(() => {
            alert("Cập nhật thành công!");
        });
    };
});

function loadAllUsers() {
    db.collection("users")
        .get()
        .then((snapshot) => {
            const tableBody = document.getElementById("user-table-body");
            tableBody.innerHTML = "";

            snapshot.forEach((doc) => {
                let u = doc.data();

                let roleName = "Khách hàng";
                if (u.role_id === 1) {
                    roleName = "Admin";
                }

                const row = `
                    <tr>
                        <td>${u.email || ""}</td>
                        <td>${u.fullName || ""}</td>
                        <td>${u.phone || ""}</td>
                        <td>${u.address || ""}</td>
                        <td>${roleName}</td>
                    </tr>
                `;

                tableBody.innerHTML += row;
            });
        })
        .catch((error) => {
            alert("không tải đc người danh sách người dùng " + error.message);
        });
}
