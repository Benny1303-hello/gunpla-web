const keyword = sessionStorage.getItem("searchKeyword") || "";

document.getElementById("search-title").textContent = "Kết quả tìm kiếm cho: " + keyword +"" ;

function removeVietnameseSigns(str) {
    return str
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}

let products = [];

db.collection("products")
    .get()
    .then((fbtv) => {
        fbtv.forEach((doc) => {
            let data = doc.data();
            let product = {
                id: doc.id,
                name: data.name,
                price: data.price,
                img: data.img,
                link: data.link,
            };
            products.push(product);
        });

        renderProducts();
    })
    .catch((error) => {
        console.error("Lỗi khi load dữ liệu từ Firebase:", error);
    });

function renderProducts() {
    const matched = products.filter((product) =>
        removeVietnameseSigns(product.name)
            .toLowerCase()
            .includes(removeVietnameseSigns(keyword).toLowerCase())
    );

    const productGrid = document.querySelector(".filterable_cards");

    if (matched.length === 0) {
        productGrid.innerHTML = "<p>Không tìm thấy sản phẩm nào phù hợp.</p>";
        return;
    }

    matched.forEach((product) => {

        const productCard = `
            <div class="product-item">

                <img src="${product.img}" alt="${product.name}">

                <h2>${product.name}</h2>

                <h5>
                    Giá: ${product.price.toLocaleString()} VNĐ
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
}

