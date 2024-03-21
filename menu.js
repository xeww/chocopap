let menuButton = document.getElementById("menu");
let menu = document.getElementById("toggle-menu");
let isMenuToggled = false;

menuButton.addEventListener("click", () => {
    if (isMenuToggled) {
        isMenuToggled = false;
        menu.style.maxHeight = "0";
    } else {
        isMenuToggled = true;
        menu.style.maxHeight = "200px";
    }
});