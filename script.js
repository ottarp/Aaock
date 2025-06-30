// script.js
document.addEventListener("DOMContentLoaded", async () => {
    const nav = document.querySelector("nav");
    const main = document.querySelector("main");

    // Load menu from JSON
    const menuData = await fetch("menu.json").then(res => res.json());

    // Build navigation
    nav.innerHTML = menuData.menu.map(item =>
        `<a href="?page=${item.path}" data-path="${item.path}">${item.title}</a>`
    ).join("");

    // Handle navigation clicks
    nav.addEventListener("click", (e) => {
        const link = e.target.closest("a[data-path]");
        if (link) {
            e.preventDefault();
            const path = link.dataset.path;
            history.pushState({ path }, "", `?page=${path}`);
            loadContent(path);
        }
    });

    // Handle back/forward
    window.addEventListener("popstate", (e) => {
        const path = (e.state && e.state.path) || getPageFromUrl();
        loadContent(path);
    });

    // Load initial page
    const initialPath = getPageFromUrl() || "home";
    loadContent(initialPath);
});

function getPageFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("page");
}

async function loadContent(path) {
    const main = document.querySelector("main");
    const menuData = await fetch("menu.json").then(res => res.json());
    const item = menuData.menu.find(m => m.path === path);
    if (item) {
        const html = await fetch(item.file).then(res => res.text());
        main.innerHTML = html;
    } else {
        main.innerHTML = "<h2>Siden finnes ikke</h2><p>Innholdet du leter etter kunne ikke vises.</p>";
    }
}
