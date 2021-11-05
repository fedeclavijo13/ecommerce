const CART2_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json"

//Realizo petición a JSON de carrito para tomar la información, y ejecuto función para mostrar la info en la página.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(CART2_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            cartProd = resultObj.data.articles;
            showCart();
        }
    });
});

//Armo función para recorrer la info pedida del JSON y generar los elementos HTML para que se visualicen en la página.
function showCart() {
    let htmlContentToAppend = "";
    var sum = 0;
    for (let i = 0; i < cartProd.length; i++) {
        var cost = cartProd[i].unitCost;

        //Realizo condicional para cambiar el costo a USD en caso de que el precio esté en pesos uruguayos.
        if (cartProd[i].currency === "UYU") {
            cost = cost / 40;
        }
        //Genero sumatoria para el costo total del pedido.
        sum += cost * cartProd[i].count;
        //Creo los elementos HTML con la info tomada del JSON
        htmlContentToAppend += `<tr>
              <td><img src="${cartProd[i].src}" class="img-fluid img-thumbnail" width="100"></div></td>
              <td class="align-middle"><p class="title text-dark">${cartProd[i].name}</p></td>
              <td class="align-middle"> <input type="number" min="1" style="width:75px; heigth:1px" onchange="subtotal(${i + 1});" value="${cartProd[i].count}" id="${i + 1}" /></td>
              <td class="align-middle"> <div class="price-wrap"> USD ${cost} </div></td>
              <td class="align-middle"> <div class="price-wrap"><var class="price" id="subt${i + 1}"> ${cartProd[i].count * cost}</var> </div></td>
              <td class="align-middle"> <button class="btn btn-danger" type="button">Quitar</button> </td>
          </tr>`
    }
    //Cargo los elementos en el HTML según los ID colocados previamente.
    document.getElementById("cart").innerHTML += htmlContentToAppend;
    document.getElementById("total").innerHTML = sum;
}

//Creo función para que se calcule el subtotal y para que en caso de cambiar la cantidad del producto se realice el cambio en tiempo real
// (evento onchange en el elemento HTML a cargar)
function subtotal(subtCost) {
    var st = document.getElementById(subtCost).value;
    let cost = cartProd[subtCost - 1].unitCost;
    if (cartProd[subtCost - 1].currency === "UYU") {
        cost = cost / 40;
    }
    document.getElementById("subt" + subtCost).innerHTML = st * cost;
    total()
    shippingCost()
}

//Creo función para terminar de calcular el total del pedido y enviarlo al HTML
function total() {
    var sum = 0;
    for (let i = 1; i <= cartProd.length; i++) {
        var subtotal = document.getElementById("subt" + i).textContent;
        sum += parseInt(subtotal);
    }
    document.getElementById("total").innerHTML = sum;
}

function methodPaymentCheck() {
    if (document.getElementById('creditCheck').checked) {
        document.getElementById('creditYes').style.display = 'block';
    }
    else document.getElementById('creditYes').style.display = 'none';

    if (document.getElementById('transferCheck').checked) {
        document.getElementById('transferYes').style.display = 'block';
    }
    else document.getElementById('transferYes').style.display = 'none';
}

function shippingCost() {
    var shippingCost = 0;

    if (document.getElementById('premium').checked) {
        shippingCost = Math.round((total) * 0.15);
    }
    if (document.getElementById('express').checked) {
        shippingCost = Math.round((total) * 0.07);
    }
    if (document.getElementById('standard').checked) {
        shippingCost = Math.round((total) * 0.05);
    }

    document.getElementById('costoEnv').innerHTML = shippingCost;
}