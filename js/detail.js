
const currentId = document.body.dataset.id;
const currentTitle = document.body.dataset.title;                         



const priceBox = document.querySelector(".product-info .price");

if (priceBox) {
    db.collection("products").doc(currentId).get().then((doc) => {
        if (doc.exists) {
            let product = doc.data();
            
            priceBox.textContent = Number(product.price).toLocaleString() + " VNĐ";
        }
    });
}



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


function themVaoGio(chuyenTrang) {
    const user = auth.currentUser;

    if (!user) {
        alert("Bạn cần đăng nhập để mua hàng");
        location.href = "dkdn.html";
        return;
    }

    db.collection("products").doc(currentId).get().then((productDoc) => {

        if (!productDoc.exists) {
            alert("Sản phẩm này không còn tồn tại");
            return;
        }

        let product = productDoc.data();

        db.collection("users").doc(user.uid).get().then((userDoc) => {

            let cart = [];
            if (userDoc.exists && userDoc.data().cart) {
                cart = userDoc.data().cart;
            }

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


const relatedBox = document.querySelector(".related-products");

if (relatedBox) {
    db.collection("products")
        .where("title", "==", currentTitle)
        .limit(4)
        .get()
        .then((gg) => {

            relatedBox.innerHTML = "";

            gg.forEach((doc) => {

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
