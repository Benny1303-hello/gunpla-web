// null = chưa chọn tài khoản nào, có giá trị = đang sửa tài khoản có id đó
let editingId = null;
let myId = null;

auth.onAuthStateChanged((user) => {
    if (!user) {
        alert("Bạn phải đăng nhập");
        location.href = "dkdn.html";
        return;
    }

    myId = user.uid;

    // Chỉ admin (role_id = 1) mới được vào trang này
    db.collection("users").doc(user.uid).get().then((doc) => {
        let data = {};
        if (doc.exists) {
            data = doc.data();
        }

        if (data.role_id !== 1) {
            alert("Bạn không có quyền truy cập trang này!");
            location.href = "thongtincanhan.html";
            return;
        }

        loadUsers();
    });
});

function loadUsers() {
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
                        <td>${u.username || ""}</td>
                        <td>${u.fullName || ""}</td>
                        <td>${u.phone || ""}</td>
                        <td>${u.address || ""}</td>
                        <td>${roleName}</td>
                        <td>
                            <button class="btn-edit" onclick="editUser('${doc.id}')">Sửa</button>
                        </td>
                    </tr>
                `;

                tableBody.innerHTML += row;
            });
        })
        .catch((error) => {
            alert("Không tải được danh sách tài khoản: " + error.message);
        });
}

function editUser(id) {
    db.collection("users")
        .doc(id)
        .get()
        .then((doc) => {
            let u = doc.data();

            document.getElementById("email").value = u.email || "";
            document.getElementById("username").value = u.username || "";
            document.getElementById("fullName").value = u.fullName || "";
            document.getElementById("phone").value = u.phone || "";
            document.getElementById("address").value = u.address || "";

            if (u.role_id === 1) {
                document.getElementById("role").value = "1";
            } else {
                document.getElementById("role").value = "2";
            }

            editingId = id;
            document.getElementById("hint").textContent = "Đang sửa tài khoản: " + (u.email || id);

            window.scrollTo(0, 0);
        });
}

function saveUser() {
    if (editingId === null) {
        alert("Hãy bấm nút Sửa ở bảng để chọn 1 tài khoản trước");
        return;
    }

    let newRole = Number(document.getElementById("role").value);

    // Không cho admin tự hạ quyền của chính mình (tránh mất quyền admin)
    if (editingId === myId && newRole !== 1) {
        alert("Bạn không thể tự bỏ quyền Admin của chính mình");
        return;
    }

    let thongTinMoi = {
        username: document.getElementById("username").value.trim(),
        fullName: document.getElementById("fullName").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        address: document.getElementById("address").value.trim(),
        role_id: newRole,
    };

    db.collection("users")
        .doc(editingId)
        .update(thongTinMoi)
        .then(() => {
            alert("Cập nhật tài khoản thành công!");
            clearForm();
            loadUsers();
        })
        .catch((error) => {
            alert("Cập nhật thất bại: " + error.message);
        });
}

function clearForm() {
    document.getElementById("email").value = "";
    document.getElementById("username").value = "";
    document.getElementById("fullName").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("address").value = "";
    document.getElementById("role").value = "2";

    editingId = null;
    document.getElementById("hint").textContent = "Bấm nút \"Sửa\" ở bảng bên dưới để chọn 1 tài khoản.";
}
