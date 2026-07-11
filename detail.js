const url = "https://6a1aa01ebc2f944754927e80.mockapi.io/gandum1";


const currentTitle = document.body.dataset.title;

fetch(url)
    .then(res => res.json())
    .then(data => {

        const relatedProducts = data
            .filter(product => product.title === currentTitle)
            .slice(0, 4);

        const relatedBox = document.querySelector(".related-products");

        relatedBox.innerHTML = "";

        relatedProducts.forEach(product => {

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
    .catch(error => console.error(error));




