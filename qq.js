const url = "https://6a1aa01ebc2f944754927e80.mockapi.io/gandum1";

fetch(url)
    .then(res => res.json())
    .then(data => {

        const DataHome = data
            .sort(() => Math.random() - 0.5)
            .slice(0, 6);

        const productGrid = document.querySelector(".filterable_cards");

        DataHome.forEach(product => {

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

    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });