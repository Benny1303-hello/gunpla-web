// Chỉ lấy những sản phẩm có title = "HG" trong Firestore
db.collection("products")
    .where("title", "==", "HG")
    .get()
    .then((snapshot) => {

        const productGrid = document.querySelector(".filterable_cards");

        productGrid.innerHTML = "";

        snapshot.forEach((doc) => {

            let product = doc.data();

            const productCard = `
                <div class="product-item">

                    <img src="${product.img}" alt="${product.name}">

                    <h2>${product.name}</h2>

                    <h5>
                        Giá: ${Number(product.price).toLocaleString()} VNĐ
                    </h5>

                    <a href="${product.link}">
                        <button>
                            Xem chi tiết
                        </button>
                    </a>

                </div>
            `;

            productGrid.innerHTML += productCard;
        });

    })
    .catch((error) => {
        console.error("Lỗi khi load dữ liệu từ Firebase:", error);
    });
