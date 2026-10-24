let cart = [];

auth.onAuthStateChanged((user) => {
    if (!user) {
        document.getElementById("cart-empty").innerHTML =
            'Bạn cần <a href="dkdn.html">đăng nhập</a> để xem giỏ hàng.';
        return;
    }

    loadCart();
});

function loadCart() {
    const user = auth.currentUser;

    db.collection("users").doc(user.uid).get().then((doc) => {
        cart = [];

        if (doc.exists && doc.data().cart) {
            cart = doc.data().cart;
        }

        renderCart();
    });
}

function renderCart() {
    const cartItems = document.getElementById("cart-items");
    cartItems.innerHTML = "";

    let total = 0;
    let soLuong = 0;

    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        let thanhTien = item.price * item.quantity; 

        total = total + thanhTien;
        soLuong = soLuong + item.quantity;

        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.name}">

                <div class="cart-item-info">
                    <h5>${item.name}</h5>
                    <p>Giá: ${item.price.toLocaleString()}đ</p>

                    <div class="cart-qty">
                        <button onclick="doiSoLuong(${i}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="doiSoLuong(${i}, 1)">+</button>
                    </div>

                    <p>Thành tiền: <b>${thanhTien.toLocaleString()}đ</b></p>
                </div>

                <button class="cart-remove" onclick="xoaSanPham(${i})">Xoá</button>
            </div>
        `;
    }

    document.getElementById("cart-count").textContent = soLuong + " sản phẩm";
    document.getElementById("cart-total").textContent = total.toLocaleString() + "đ";

    if (cart.length === 0) {
        document.getElementById("cart-empty").style.display = "block";
    } else {
        document.getElementById("cart-empty").style.display = "none";
    }
}

function saveCart() {
    const user = auth.currentUser;

    db.collection("users").doc(user.uid).set({ cart: cart }, { merge: true })
        .then(() => {
            renderCart();
        })
        .catch((error) => {
            alert("Lưu giỏ hàng thất bại: " + error.message);
        });
}

function doiSoLuong(i, amount) {
    cart[i].quantity = cart[i].quantity + amount;

    if (cart[i].quantity <= 0) {
        cart.splice(i, 1);
    }

    saveCart();
}

function xoaSanPham(i) {
    cart.splice(i, 1);
    saveCart();
}

document.getElementById("checkout-btn").onclick = function () {
    if (cart.length === 0) {
        alert("Giỏ hàng đang trống");
        return;
    }

    cart = [];
    saveCart();
    alert("Đặt hàng thành công!");
};
