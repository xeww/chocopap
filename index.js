let menuButton = document.getElementById("menu");
let menu = document.getElementById("toggle-menu");
let isMenuToggled = false;

menuButton.addEventListener("click", () => {
    if (isMenuToggled) {
        isMenuToggled = false;
        menu.style.display = "none";
    } else {
        isMenuToggled = true;
        menu.style.display = "block";
    }
});