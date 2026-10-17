// Mảng giỏ hàng của user đang đăng nhập (lấy từ Firestore)
let cart = [];

auth.onAuthStateChanged((user) => {
    if (!user) {
        document.getElementById("cart-empty").innerHTML =
            'Bạn cần <a href="dkdn.html">đăng nhập</a> để xem giỏ hàng.';
        return;
    }

    loadCart();
});

// Lấy giỏ hàng từ Firestore rồi vẽ ra màn hình
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

// Vẽ danh sách sản phẩm trong giỏ + tính tổng tiền
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

    // Giỏ trống thì hiện dòng "Giỏ hàng của bạn đang trống", có hàng thì ẩn đi
    if (cart.length === 0) {
        document.getElementById("cart-empty").style.display = "block";
    } else {
        document.getElementById("cart-empty").style.display = "none";
    }
}

// Lưu giỏ hàng hiện tại lên Firestore rồi vẽ lại
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

// Bấm + thì amount = 1, bấm - thì amount = -1
function doiSoLuong(index, amount) {
    cart[index].quantity = cart[index].quantity + amount;

    // Giảm về 0 thì bỏ luôn sản phẩm khỏi giỏ
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
}

function xoaSanPham(index) {
    // splice(index, 1) = xoá 1 phần tử ở vị trí index ra khỏi mảng
    cart.splice(index, 1);
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
