// Lấy ID và loại (HG/RG/MG) của sản phẩm đang xem từ <body data-id="..." data-title="...">
const currentId = document.body.dataset.id;
const currentTitle = document.body.dataset.title;


// ===================== GIÁ SẢN PHẨM =====================
// Lấy giá thật từ Firestore rồi ghi đè lên giá viết sẵn trong HTML,
// để admin sửa giá trong trang quản lý là trang chi tiết cũng đổi theo

const priceBox = document.querySelector(".product-info .price");

if (priceBox) {
    db.collection("products").doc(currentId).get().then((doc) => {
        if (doc.exists) {
            let product = doc.data();
            priceBox.textContent = Number(product.price).toLocaleString() + " VNĐ";
        }
    });
}


// ===================== NÚT MUA HÀNG =====================

const addCartBtn = document.getElementById("add-cart");
const buyNowBtn = document.getElementById("buy-now");

if (addCartBtn) {
    addCartBtn.onclick = function () {
        themVaoGio(false);
    };
}

if (buyNowBtn) {
    buyNowBtn.onclick = function () {
        themVaoGio(true);
    };
}

// chuyenTrang = true: thêm xong thì chuyển sang trang giỏ hàng (nút "Mua Ngay")
// chuyenTrang = false: thêm xong thì chỉ báo thông báo (nút "Thêm vào giỏ hàng")
function themVaoGio(chuyenTrang) {
    const user = auth.currentUser;

    if (!user) {
        alert("Bạn cần đăng nhập để mua hàng");
        location.href = "dkdn.html";
        return;
    }

    // Bước 1: lấy thông tin sản phẩm đang xem từ Firestore
    db.collection("products").doc(currentId).get().then((productDoc) => {

        if (!productDoc.exists) {
            alert("Sản phẩm này không còn tồn tại");
            return;
        }

        let product = productDoc.data();

        // Bước 2: lấy giỏ hàng hiện tại của user
        db.collection("users").doc(user.uid).get().then((userDoc) => {

            let cart = [];
            if (userDoc.exists && userDoc.data().cart) {
                cart = userDoc.data().cart;
            }

            // Bước 3: nếu sản phẩm đã có trong giỏ thì tăng số lượng, chưa có thì thêm mới
            let daCo = false;

            for (let i = 0; i < cart.length; i++) {
                if (cart[i].id === currentId) {
                    cart[i].quantity = cart[i].quantity + 1;
                    daCo = true;
                }
            }

            if (!daCo) {
                cart.push({
                    id: currentId,
                    name: product.name,
                    price: Number(product.price),
                    img: product.img,
                    quantity: 1,
                });
            }

            // Bước 4: lưu giỏ hàng mới lên Firestore
            db.collection("users").doc(user.uid).set({ cart: cart }, { merge: true })
                .then(() => {
                    if (chuyenTrang) {
                        location.href = "giohang.html";
                    } else {
                        alert("Đã thêm vào giỏ hàng!");
                    }
                })
                .catch((error) => {
                    alert("Thêm vào giỏ thất bại: " + error.message);
                });
        });
    });
}


// ===================== SẢN PHẨM LIÊN QUAN =====================

const relatedBox = document.querySelector(".related-products");

// Trang nào không có khung "sản phẩm liên quan" thì bỏ qua phần này
if (relatedBox) {
    db.collection("products")
        .where("title", "==", currentTitle)
        .limit(4)
        .get()
        .then((snapshot) => {

            relatedBox.innerHTML = "";

            snapshot.forEach((doc) => {

                let product = doc.data();

                relatedBox.innerHTML += `
                    <div class="product-item">

                        <img src="${product.img}" alt="${product.name}">

                        <h2>${product.name}</h2>

                        <h5>
                            Giá: ${Number(product.price).toLocaleString()} VNĐ
                        </h5>

                        <a href="${product.link}">
                            <button>Xem chi tiết</button>
                        </a>

                    </div>
                `;

            });

        })
        .catch((error) => console.error(error));
}
