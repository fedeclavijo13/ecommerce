//Modifico constantes para referir al ordenamiento por precios y por relevancia
const ORDER_ASC_BY_PRICE = "AZ";
const ORDER_DESC_BY_PRICE = "ZA";
const ORDER_BY_SOLD_COUNT = "Cant.";
var currentProductsArray = [];
var currentSortCriteria = undefined;
//Agrego variables de cantidad de productos vendidos (mín y máx) y de costo de producto (mínimo y máximo)
var minSoldCount = undefined;
var maxSoldCount = undefined;
var minCost = undefined;
var maxCost = undefined;

//Reconozco patrones de categories.js y ajusto para realizar ordenamiento de productos
function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE) {
        result = array.sort(function (a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if (aCost < bCost) { return -1; }
            if (aCost > bCost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_PRICE) {
        result = array.sort(function (a, b) {
            let aCost = parseInt(a.cost);
            let bCost = parseInt(b.cost);

            if (aCost > bCost) { return -1; }
            if (aCost < bCost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_SOLD_COUNT) {
        result = array.sort(function (a, b) {
            let aSoldCount = parseInt(a.soldCount);
            let bSoldCount = parseInt(b.soldCount);

            if (aSoldCount > bSoldCount) { return -1; }
            if (aSoldCount < bSoldCount) { return 1; }
            return 0;
        });
    }

    return result;
}

//Realizo función para mostrar listado de productos, tomando como base la función de mostrado de categorías
function showProductsList() {

    let htmlContentToAppend = "";
    for (let i = 0; i < currentProductsArray.length; i++) {
        let product = currentProductsArray[i];

        if (((minCost == undefined) || (minCost != undefined && parseInt(product.cost) >= minCost)) &&
            ((maxCost == undefined) || (maxCost != undefined && parseInt(product.cost) <= maxCost))) {

            htmlContentToAppend += `<div class="col-xs-12 col-sm-4">
            <div class="card bg-light">
                <a class="img-card" href="product-info.html">
                <img src="` + product.imgSrc + `" alt="` + product.description + `" class = "img-thumbnail">
              </a>
                <div class="card-content">
                    <h4 class="card-title">
                        <a href="product-info.html">` + product.name + `
                      </a>
                    </h4>
                    <b class="mb-1" style="font-size: 120%;">` + product.currency + ` ` + product.cost + ` </b><br>
                    <p>` + product.description + `</p>
                </div>
                <div class="card-read-more">
                    <a href="product-info.html" class="btn btn-link btn-block">
                        Ver más
                    </a>
                </div>
            </div>
            </div>`
        }

        document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;
    }
}

//Función que integra el ordenamiento y el mostrado de productos según el criterio correspondiente
function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;

    if (productsArray != undefined) {
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);
    //Muestro los productos ordenados
    showProductsList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            sortAndShowProducts(ORDER_ASC_BY_PRICE, resultObj.data);
        }
    });
    // Por defecto cuando se cargue la página se realiza el ordenamiento por precio de forma ascendente
    // Debajo le implemento a los botones del dropdown sus funciones correspondientes
    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("sortBySoldCount").addEventListener("click", function () {
        sortAndShowProducts(ORDER_BY_SOLD_COUNT);
    });

    //Acción para limpiar el filtro del rango de precio, y que muestre nuevamente a todos los productos.
    document.getElementById('clearRangeFilter').addEventListener('click', function () {
        document.getElementById('rangeFilterCostMin').value = "";
        document.getElementById('rangeFilterCostMax').value = "";

        minCost = undefined;
        maxCost = undefined;

        showProductsList();
    });

    //Filtro por rango de precio de los productos, tomando los valores que se indican de mínimo y máximo, para luego mostrar los productos que
    //tengan un costo comprendido entre estos dos valores
    document.getElementById('rangeFilterCost').addEventListener('click', function () {
        minCost = document.getElementById('rangeFilterCostMin').value;
        maxCost = document.getElementById('rangeFilterCostMax').value;

        if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0) {
            minCost = parseInt(minCost);
        }
        else {
            minCost = undefined;
        }

        if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0) {
            maxCost = parseInt(maxCost);
        }
        else {
            maxCost = undefined;
        }

        showProductsList();
    });
});