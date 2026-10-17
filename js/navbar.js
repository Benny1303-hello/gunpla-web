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

        location.href = "/html/timkiem.html";
    });
}
