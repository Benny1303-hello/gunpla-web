const loginLink = document.getElementById("login-link");

if (loginLink) {
    const originalHref = loginLink.getAttribute("href");
    const originalText = loginLink.textContent;

    auth.onAuthStateChanged((user) => {
        if (user) {
            loginLink.textContent = "Đăng xuất";
            loginLink.setAttribute("href", "#");
            loginLink.onclick = (event) => {
                event.preventDefault();
                auth.signOut().then(() => location.reload());
            };
        } else {
            loginLink.textContent = originalText;
            loginLink.setAttribute("href", originalHref);
            loginLink.onclick = null;
        }
    });
}

const searchForm = document.querySelector('form[role="search"]');

if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const keyword = searchForm.querySelector('input[type="search"]').value.trim();
        sessionStorage.setItem("searchKeyword", keyword);

        // Trang trong thư mục html/ thì timkiem.html nằm cùng thư mục, trang chủ (ở ngoài) thì phải vào html/
        let trangTimKiem = "html/timkiem.html";
        if (location.pathname.includes("/html/")) {
            trangTimKiem = "timkiem.html";
        }

        location.href = trangTimKiem;
    });
}
