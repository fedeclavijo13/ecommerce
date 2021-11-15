const CART2_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/654.json"
var shippingPorcent = 0;

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
              <td class="align-middle"> <input type="number" min="1" style="width:75px; heigth:1px" onchange="subtotalCart(${i + 1});" value="${cartProd[i].count}" id="${i + 1}" /></td>
              <td class="align-middle"> <div class="price-wrap"> USD ${cost} </div></td>
              <td class="align-middle"> <div class="price-wrap"><var class="price" id="subt${i + 1}"> ${cartProd[i].count * cost}</var> </div></td>
              <td class="align-middle"> <button class="btn btn-danger" onclick="remove('${i}')" type="button"><i class="fas fa-trash"></i> Quitar</button> </td>
          </tr>`
    }
    //Cargo los elementos en el HTML según los ID colocados previamente.
    document.getElementById("cart").innerHTML = htmlContentToAppend;
    document.getElementById("total").innerHTML = sum;
}

//Genero función para quitar productos del carrito, y que luego se vuelva a ejecutar los cambios
//tanto en el subtotal y total como en el costo de envío.
function remove(id) {
    let i = 0;
    for (let products of cartProd) {
        products.count = document.getElementById(i + 1).value;
        i++;
    }
    cartProd.splice(id, 1);
    showCart();
    subtotalCost();
    totalCost();
}

//Creo función para que se calcule el subtotal y para que en caso de cambiar la cantidad del producto se realice el cambio en tiempo real
// (evento onchange en el elemento HTML a cargar)
function subtotalCart(subtCost) {
    var st = document.getElementById(subtCost).value;
    let cost = cartProd[subtCost - 1].unitCost;
    if (cartProd[subtCost - 1].currency === "UYU") {
        cost = cost / 40;
    }
    document.getElementById("subt" + subtCost).innerHTML = st * cost;
    subtotalCost();
    totalCost();
}

//Creo función para terminar de calcular el subtotal del pedido y enviarlo al HTML
function subtotalCost() {
    var sum = 0;
    for (let i = 1; i <= cartProd.length; i++) {
        var subtotal = document.getElementById("subt" + i).textContent;
        sum += parseInt(subtotal);
    }
    document.getElementById("total").innerHTML = sum;
}

//Función para mostrar los campos a llenar para cada método de pago
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

//Función para calcular el costo de envío y posteriormente el total de la orden.
function totalCost() {
    var sumSubtotal = 0;
    var suma = 0;
    for (let i = 1; i <= cartProd.length; i++) {
        if (document.getElementById("subt" + i) !== undefined) {
            var subtotal = document.getElementById("subt" + i).textContent;
            sumSubtotal += parseInt(subtotal);
        }
    }
    var costoEnvio = sumSubtotal * shippingPorcent;
    document.getElementById("costoEnv").innerHTML = Math.round(costoEnvio);
    suma = Math.round(sumSubtotal + costoEnvio);
    document.getElementById("totalCostText").innerHTML = suma;
}

//Indico que cada radio de tipo de envío modifique el porcentaje del shipping
//y luego se ejecute la función de cálculo del costo de envío para que se apliquen
//los cambios en tiempo real.
document.getElementById("premium").addEventListener("change", function () {
    shippingPorcent = 0.15;
    totalCost();
});

document.getElementById("express").addEventListener("change", function () {
    shippingPorcent = 0.07;
    totalCost();
});

document.getElementById("standard").addEventListener("change", function () {
    shippingPorcent = 0.05;
    totalCost();
});

//Aplico función para las validaciones por Bootstrap
(function () {
    'use strict'

    //Obtengo los formularios a los cuales les coloqué la clase para que se apliquen los estilos de
    //validación correspondientes.
    var forms = document.querySelectorAll('.needs-validation')

    //Realizo un bucle sobre ellos y que se evite la presentación
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})();

//Función para validar si se completó la elección del método de pago y
//sus datos correspondientes.
function validation() {
    if (document.getElementById("creditCheck").checked) {
        let nameCard = document.getElementById("validationCustom01").value;
        let numCard = document.getElementById("validationCustom02").value;
        let dateCaducity = document.getElementById("validationCustom03").value;
        let cvv = document.getElementById("validationCustom04").value;

        if ((nameCard != "") && (numCard != "") && (dateCaducity != "") && (cvv != "")) {
            return true
        } else {
            alert("Complete los datos de la tarjeta.");
            return false;
        }
    } else if (document.getElementById("transferCheck").checked) {
        let bank = document.getElementById("validationCustom05").value;
        let numAccount = document.getElementById("validationCustom06").value;

        if ((bank != "") && (numAccount != "")) {
            return true
        } else {
            alert("Complete los campos de transferencia");
            return false;
        }
    } else if (!(document.getElementById("creditCheck").checked || document.getElementById("transferCheck").checked)) {
        alert("Debe seleccionar un método de pago para avanzar.");
        return false;
    }
}

//Genero función para que una vez estén cargados los datos en el modal se pueda ocultar el mismo al querer confirmar
function ok() {
    if (document.getElementById("creditCheck").checked) {
        let nameCard = document.getElementById("validationCustom01").value;
        let numCard = document.getElementById("validationCustom02").value;
        let dateCaducity = document.getElementById("validationCustom03").value;
        let cvv = document.getElementById("validationCustom04").value;

        if ((nameCard != "") && (numCard != "") && (dateCaducity != "") && (cvv != "")) {
            //Oculto el modal por jQuery.
            $("#PaymentMethodModal").modal('hide');
        }
    } else if (document.getElementById("transferCheck").checked) {
        let bank = document.getElementById("validationCustom05").value;
        let numAccount = document.getElementById("validationCustom06").value;

        if ((bank != "") && (numAccount != "")) {
            //Oculto el modal por jQuery.
            $("#PaymentMethodModal").modal('hide');
        }
    }
    return false;
}