let editingId = null;

auth.onAuthStateChanged((user) => {
    if (!user) {
        alert("Bạn phải đăng nhập mới quản lý được sản phẩm");
        location.href = "dkdn.html";
        return;
    }

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

        loadProducts();
    });
});

function loadProducts() {
    db.collection("products")
        .get()
        .then((fbtv) => {
            const tableBody = document.getElementById("product-table-body");
            tableBody.innerHTML = "";

            fbtv.forEach((doc) => {
                let product = doc.data();

                const row = `
                    <tr>
                        <td><img src="${product.img}" alt="${product.name}" class="product-thumb"></td>
                        <td>${product.name}</td>
                        <td>${Number(product.price).toLocaleString()} VNĐ</td>
                        <td>${product.title}</td>
                        <td>
                            <button class="btn-edit" onclick="editProduct('${doc.id}')">Sửa</button>
                            <button class="btn-delete" onclick="deleteProduct('${doc.id}')">Xoá</button>
                        </td>
                    </tr>
                `;

                tableBody.innerHTML += row;
            });
        })
        .catch((error) => {
            alert("Không tải được danh sách sản phẩm: " + error.message);
        });
}

function saveProduct() {
    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value.trim();
    const img = document.getElementById("img").value.trim();
    const link = document.getElementById("link").value.trim();
    const title = document.getElementById("title").value.trim();

    if (!name || !price) {
        alert("Vui lòng nhập tên và giá sản phẩm");
        return;
    }

    const product = {
        name: name,
        price: Number(price),
        img: img,
        link: link,
        title: title,
    };

    if (editingId === null) {
        db.collection("products")
            .add(product)
            .then(() => {
                alert("Thêm sản phẩm thành công!");
                clearForm();
                loadProducts();
            })
            .catch((error) => {
                alert("Thêm thất bại: " + error.message);
            });
    } else {
        db.collection("products")
            .doc(editingId)
            .update(product)
            .then(() => {
                alert("Cập nhật sản phẩm thành công!");
                clearForm();
                loadProducts();
            })
            .catch((error) => {
                alert("Cập nhật thất bại: " + error.message);
            });
    }
}

function editProduct(id) {
    db.collection("products")
        .doc(id)
        .get()
        .then((doc) => {
            let product = doc.data();

            document.getElementById("name").value = product.name || "";
            document.getElementById("price").value = product.price || "";
            document.getElementById("img").value = product.img || "";
            document.getElementById("link").value = product.link || "";
            document.getElementById("title").value = product.title || "HG";

            editingId = id;
            document.getElementById("form-title").textContent = "Sửa sản phẩm";
            document.getElementById("saveBtn").textContent = "Cập nhật";

            window.scrollTo(0, 0);
        });
}

function deleteProduct(id) {
    if (!confirm("Bạn có chắc muốn xoá sản phẩm này không?")) {
        return;
    }

    db.collection("products")
        .doc(id)
        .delete()
        .then(() => {
            alert("Đã xoá sản phẩm");
            loadProducts();
        })
        .catch((error) => {
            alert("Xoá thất bại: " + error.message);
        });
}

function clearForm() {
    document.getElementById("name").value = "";
    document.getElementById("price").value = "";
    document.getElementById("img").value = "";
    document.getElementById("link").value = "";
    document.getElementById("title").value = "HG";

    editingId = null;
    document.getElementById("form-title").textContent = "Thêm sản phẩm mới";
    document.getElementById("saveBtn").textContent = "Thêm sản phẩm";
}
