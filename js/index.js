let products = [];
let basket = [];

document.addEventListener("DOMContentLoaded",
    async () => {
        const response = await fetch("./products.json");
        let result = await response.json();

        result.forEach(element => {
            products[element.id] = element;
        });

        displayProductElements();
        displayProductInfo();
        loadBasket();
    }
);

const toastApp = new SvelteToast({
    target: document.body
});

function sendToast(message) {
    toast.push(message, {
        pausable: true,
        duration: 1500,
        theme: {
            '--toastColor': 'mintcream',
            '--toastBackground': 'rgba(72,187,120,0.98)',
            '--toastBarBackground': '#2F855A',
            'font-family': 'Droid Serif'
        }
    });
}

// SENDS USER TO A GENERIC ERROR PAGE
function er() {
    window.location.href = "./error.html";
}

function loadBasket() {
    let save = localStorage.getItem("basket");
    if (save) {
        basket = JSON.parse(save);
    }
    updateBasketDisplay();
}

function exportBasket() {
    localStorage.setItem("basket", JSON.stringify(basket));
}

function resetBasket() {
    basket = [];
    exportBasket();
}

function getBasketProduct(productId) {
    for (let i = 0; i <= basket.length; i++) {
        let bp = basket[i];
        if (bp && (bp.pdt.id == productId || bp.id === productId)) {
            return bp;
        }
    }
    return null;
}

function addProductToBasket(product, quantity) {
    let bp = getBasketProduct(product.id);
    if (bp) {
        bp.qty += quantity;
    } else {
        basket.push({
            id: crypto.randomUUID(),
            pdt: product,
            qty: quantity
        });
    }
    exportBasket();
}

function removeProductFromBasket(bpid) {
    for (let i = 0; i <= basket.length; i++) {
        let bp = basket[i];
        if (bp) {
            if (bp.id === bpid) {
                basket.splice(i, 1);
            }
        }
    }
    exportBasket();
}

function getBasketTotalPrice() {
    let count = 0;
    basket.forEach((bp) => {
        count += (bp.pdt.price * bp.qty);
    });
    return count.toFixed(2);
}

function updateBasketDisplay() {
    let reference = document.getElementById("basket-product-ref");
    let basketMiddle = document.getElementById("basket-middle");
    if (reference && basketMiddle) {
        // removing previous elements to avoid duplicates
        let basketProducts = basketMiddle.querySelectorAll(".basket-product");
        for (let i = 0; i < basketProducts.length; i++) {
            let bp = basketProducts[i];
            if (bp && !bp.id) {
                bp.remove();
            }
        }

        // adding elements
        basket.forEach((pr) => {
            let refClone = reference.cloneNode(true);
            refClone.setAttribute("data-bpid", pr.id);

            refClone.removeAttribute("id");
            refClone.style.display = "flex";

            let img = refClone.querySelector("img");
            img.src = pr.pdt.image;
            img.alt = pr.pdt.title;

            let p = refClone.querySelectorAll("p");
            let name = p[0];
            let price = p[1];
            name.innerText = pr.pdt.title;
            price.innerText = pr.pdt.price + " €";

            let input = refClone.querySelector("input");
            input.value = pr.qty;

            basketMiddle.appendChild(refClone);
        });
    }

    let basketBottom = document.getElementById("basket-bottom");
    if (basketBottom) {
        let total = basketBottom.querySelector("span");
        if (total) total.innerText = getBasketTotalPrice();
    }

    let headerBasketCount = document.querySelector("#cart span");
    if (headerBasketCount) {
        headerBasketCount.innerText = `${basket.length}`;
    }

    let toggleMenuBasketCount = document.querySelectorAll("#m-cart p")[1];
    if (toggleMenuBasketCount) {
        toggleMenuBasketCount.innerText = `${basket.length}`;
    }
}

// RETURNS A PRODUCT OBJECT IF MATCHES ID
function getProductById(searchedId) {
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        if (product) {
            if (product.id == searchedId || product.title === searchedId) {
                return product;
            }
        }
    }
    return null;
}

// CREATES ALL PRODUCTS ELEMENTS IN THE STORE PAGE
function displayProductElements() {
    let allProducts = document.getElementById("all-products");
    if (allProducts) allProducts.innerHTML = "";
    products.forEach((element) => {
        if (checkCategoryFilter(element) && checkPriceFilter(element) && checkNoteFilter(element)) {
            createProductElement(element.id, element.image, element.title, element.price, element.note);
        }
    });
}

function checkCategoryFilter(element) {
    let categories = element.category;

    let chAll = document.getElementById("ch-all");
    if (chAll && chAll.checked) {
        return true;
    }

    let chBlanc = document.getElementById("ch-chocolat-blanc");
    if (chBlanc && chBlanc.checked && categories.blanc) {
        return true;
    }

    let chLait = document.getElementById("ch-chocolat-lait");
    if (chLait && chLait.checked && categories.lait) {
        return true;
    }

    let chNoir = document.getElementById("ch-chocolat-noir");
    if (chNoir && chNoir.checked && categories.noir) {
        return true;
    }

    let chNoix = document.getElementById("ch-noix");
    if (chNoix && chNoix.checked && categories.noix) {
        return true;
    }

    let chFruit = document.getElementById("ch-fruit");
    if (chFruit && chFruit.checked && categories.fruit) {
        return true;
    }

    let chCaramel = document.getElementById("ch-caramel");
    if (chCaramel && chCaramel.checked && categories.caramel) {
        return true;
    }

    let chLiqueur = document.getElementById("ch-liqueur");
    if (chLiqueur && chLiqueur.checked && categories.liqueur) {
        return true;
    }

    return false;
}

function checkPriceFilter(element) {
    let minPrice = (() => {
        let e = document.getElementById("price-min-input");
        return e ? e.value : 1;
    })();

    let maxPrice = (() => {
        let e = document.getElementById("price-max-input");
        return e ? e.value : 50;
    })();

    return element.price >= minPrice && element.price <= maxPrice;
}

function checkNoteFilter(element) {
    let minNote = (() => {
        let e = document.getElementById("note-min-select");
        return e ? e.value : 1;
    })();

    let maxNote = (() => {
        let e = document.getElementById("note-max-select");
        return e ? e.value : 5;
    })();

    return element.note >= minNote && element.note <= maxNote;
}

// CREATES AN ELEMENT FOR A PRODUCT IN THE STORE PAGE
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
        button.setAttribute("data-productid", id);

        div.appendChild(a);
        div.appendChild(p1);
        div.appendChild(p2);
        div.appendChild(p3);
        div.appendChild(button);

        allProducts.appendChild(div);
    }
}

// DISPLAYS PRODUCT'S PAGE INFO
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

// DISPLAY BASKET MENU
let basketMenu = document.getElementById("basket");
let basketButton = document.getElementById("cart");
let mBasketButton = document.querySelector("#m-cart p");
let basketCloseButton = document.querySelector("#basket-top svg");

// OPEN BASKET MENU
basketButton.addEventListener("click", () => {
    basketMenu.style.display = "initial";
    updateBasketDisplay();
});

mBasketButton.addEventListener("click", () => {
    basketMenu.style.display = "initial";
    updateBasketDisplay();
});

// CLOSE BASKET MENU
basketCloseButton.addEventListener("click", () => {
    basketMenu.style.display = "none";
});

// RESET BASKET
let resetBasketButton = document.getElementById("reset-basket-btn");
resetBasketButton.addEventListener("click", () => {
    resetBasket();
    updateBasketDisplay();
    sendToast("Panier réinitialisé!");
});

// BASKET PRODUCT REMOVE
let basketMiddle = document.getElementById("basket-middle");
basketMiddle.addEventListener("click", (event) => {
    let el = event.target;
    if (el.parentNode && el.parentNode.classList.contains("basket-product")) {
        let bpid = el.parentNode.getAttribute("data-bpid");
        if (bpid) {
            if (el.tagName === "svg") {
                removeProductFromBasket(bpid);
                updateBasketDisplay();
            }
        }
    }
});

// BASKET PRODUCT QUANTITY
basketMiddle.addEventListener("change", (event) => {
    let el = event.target;
    if (el.tagName === "INPUT") {
        if (el.value <= 0) {
            el.value = 1;
        } else {
            if (el.parentNode && el.parentNode.classList.contains("basket-product")) {
                let bpid = el.parentNode.getAttribute("data-bpid");
                if (bpid) {
                    let bp = getBasketProduct(bpid);
                    if (bp) {
                        bp.qty = el.value;
                        updateBasketDisplay();
                        exportBasket();
                    }
                }
            }
        }
    }
});

let qteInput = document.getElementById("qte");
if (qteInput) {
    qteInput.addEventListener("change", () => {
        if (qteInput.value <= 0) {
            qteInput.value = 1;
        }
    });

    let addToBasketBtn = document.querySelector("#product-top button");
    if (addToBasketBtn) {
        addToBasketBtn.addEventListener("click", () => {
            let params = new URLSearchParams(window.location.search);
            let product = getProductById(params.get("id"));
            if (product) {
                sendToast("Ajouté au panier!");
                addProductToBasket(product, Number(qteInput.value));
                updateBasketDisplay();
            }
        });
    }
}

document.addEventListener("click", (a) => {
    let el = a.target;
    if (el.tagName === "BUTTON") {
        let productId = el.getAttribute("data-productid");
        if (productId) {
            let product = getProductById(productId);
            if (product) {
                sendToast("Ajouté au panier!");
                addProductToBasket(product, 1);
                updateBasketDisplay();
            }
        }
    }
});

let filter = document.getElementById("filter");
if (filter) {
    let all = filter.querySelectorAll(".filter-zone");
    all.forEach((a) => {
        let p = a.querySelector("p");
        if (p) {
            p.addEventListener("click", () => {
                let hide = a.querySelector("div.filter-hide");
                let span = a.querySelector(".filter-span");
                if (hide.style.display === "none") {
                    hide.style.display = "block";
                    span.innerText = "-";
                } else {
                    hide.style.display = "none";
                    span.innerText = "+";
                }
            });
        }
    });
}

let categoryFilter = document.getElementById("category-filter");
if (categoryFilter) {
    categoryFilter.addEventListener("change", (event) => {
        let target = event.target;
        if (target.id === "ch-all") {
            if (target.checked) {
                let others = categoryFilter.querySelectorAll("input");
                for (let i = 0; i <= others.length; i++) {
                    let element = others[i];
                    if (element && element.id !== "ch-all") {
                        element.checked = false;
                    }
                }
            }
        } else {
            if (target.checked) {
                let chAll = document.getElementById("ch-all");
                if (chAll) chAll.checked = false;
            }
        }
        displayProductElements();
    });

    /*
    let p = categoryFilter.querySelector("p");
    if (p) {
        p.addEventListener("click", () => {
            let hide = categoryFilter.querySelector("div.filter-hide");
            let span = categoryFilter.querySelector(".filter-span");
            if (hide.style.display === "none") {
                hide.style.display = "block";
                span.innerText = "-";
            } else {
                hide.style.display = "none";
                span.innerText = "+";
            }
        });
    }
    */
}

let priceFilter = document.getElementById("price-filter");
if (priceFilter) {
    priceFilter.addEventListener("change", (event) => {
        let target = event.target;
        if (target.tagName === "INPUT") {
            if (target.value <= 0) target.value = 1;
            if (target.value >= 50) target.value = 50;
            displayProductElements();
        }
    });
}

let noteFilter = document.getElementById("note-filter");
if (noteFilter) {
    noteFilter.addEventListener("change", () => {
        displayProductElements();
    });
}