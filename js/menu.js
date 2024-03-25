let menuButton = document.getElementById("menu");
let menu = document.getElementById("toggle-menu");
let menuContent = document.getElementById("toggle-menu-content");
let isMenuToggled = false;

menuButton.addEventListener("click", () => {
    if (isMenuToggled) {
        isMenuToggled = false;
        menu.style.maxHeight = "0";
        menuContent.style.visibility = "hidden";
    } else {
        isMenuToggled = true;
        menu.style.maxHeight = "200px";
        menuContent.style.visibility = "visible";
    }
});