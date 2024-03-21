let products = [];

(async () => {
    const response = await fetch("./products.json");
    let result = await response.json();

    result.forEach(element => {
        products[element.id] = element;
    });

    displayProductElements();
    displayProductInfo();
})();

function displayProductElements() {
    products.forEach((element) => {
        createProductElement(element.id, element.image, element.title, element.price, element.note);
    });
}

function createProductElement(id, img, name, price, note) {
    let allProducts = document.getElementById("all-products");
    if (allProducts) {
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
        allProducts.appendChild(div);
    }
}

function getProductById(searchedId) {
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        if (product) {
            if (product.id == searchedId) {
                return product;
            }
        }
    }
    return null;
}

function displayProductInfo() {
    let params = new URLSearchParams(window.location.search);
    let productInfoElement = document.getElementById("product-info");

    if (productInfoElement) {
        if (params.has("id")) {
            let id = Number(params.get("id"));
            if (isNaN(id) || id < 0 || id >= products.length) {
                er();
            } else {
                let product = getProductById(id);
                let image = document.querySelector("#product-top img");
                let name = document.querySelector("#product-top h1");
                let price = document.getElementById("p-product-price");
                let description = document.getElementById("p-product-description");
                let ingredients = document.querySelector("#product-bottom p");

                if (image) {
                    image.src = product.image;
                    image.alt = product.title;
                }

                if (name) name.innerHTML = product.title;
                if (price) price.innerHTML = product.price + " €";
                if (description) description.innerHTML = product.description;
                if (ingredients) ingredients.innerHTML = product.ingredients;
            }
        } else {
            er();
        }
    }
}

function er() {
    window.location.href = "./error.html";
}