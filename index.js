// TOGGLEABLE NAV MENU
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

// PRODUCTS
const products = [];

(async () => {
    const response = await fetch("./products.json");
    let result = await response.json();

    result.forEach(element => {
        products[element.id] = element;
    });

    displayProductElements();
})();

function displayProductElements() {
    products.forEach((element) => {
        createProductElement(element.id, element.image, element.title, element.price, element.note);
    });
}

function createProductElement(id, img, name, price, note) {
    let div = document.createElement("div");
    div.className = "single-product";

    let a = document.createElement("a");
    a.href = `./produit.html?id=${id}`;

    let eImg = document.createElement("img");
    eImg.src = img;
    eImg.alt = `Produit: ${name}`;
    a.appendChild(eImg);

    let p1 = document.createElement("p");
    p1.innerHTML = name;
    p1.className = "text-style2";

    let p2 = document.createElement("p");
    p2.innerHTML = `${price} €`;
    p2.className = "text-style2";

    let p3 = document.createElement("p");
    p3.innerHTML = `Note: ${note}`;
    p3.className = "text-style2";

    let button = document.createElement("button");
    button.classList.add("button-style1");
    button.classList.add("text-style1");
    button.innerHTML = "Ajouter au panier";

    div.appendChild(a);
    div.appendChild(p1);
    div.appendChild(p2);
    div.appendChild(p3);
    div.appendChild(button);

    let allProducts = document.getElementById("all-products");
    if (allProducts) {
        allProducts.appendChild(div);
    }
}

function getProductById(id) {
    products.forEach((element) => {
        if (element.id == id) return element;
    });
    return null;
}