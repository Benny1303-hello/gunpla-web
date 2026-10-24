db.collection("products")
    .get()
    .then((gg) => {

        let products = [];

        gg.forEach((doc) => {
            products.push(doc.data());
        });

        const DataHome = products
            .sort(() => Math.random() - 0.5)
            .slice(0, 6);

        const productGrid = document.querySelector(".filterable_cards");

        DataHome.forEach((product) => {

            const productCard = `
                <div class="product-item">

                    <img src="${product.img}" alt="${product.name}">

                    <h2>${product.name}</h2>

                    <h5>
                        Giá: ${Number(product.price).toLocaleString()} VNĐ
                    </h5>

                    <a href="html/${product.link}">
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
