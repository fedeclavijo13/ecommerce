const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

var showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function (url) {
  var result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

//En caso de haber un usuario logueado, se carga el dropdown para visualizar carrito, "mi perfil" y cerrar sesión.
//En caso contrario, se visualizará el link para iniciar sesión y dirigir al login.
document.addEventListener("DOMContentLoaded", function (e) {
  let usuario = localStorage.getItem('username');
  if (usuario != undefined && usuario != '') {
    document.getElementById('mostrarUsuario').innerHTML += `<a href="#" data-toggle="dropdown" class="dropdown-toggle user-action"><i class="far fa-user"></i>` + "  " + usuario + `<b class="caret"></b></a>
    <ul class="dropdown-menu">
    <li class="ml-2"><a href="my-profile.html"><i class="fas fa-id-card"></i> Mi perfil</a></li>
    <li class="ml-2"><a href="cart.html"><i class="fas fa-shopping-cart"></i>` + "  " + `Ver carrito</a></li>
    <hr class="my-2">
    <li class="ml-2"><a href="index.html" onclick="logOut()"><i class="fas fa-power-off"></i><span>   </span>Cerrar sesión</a></li>
  </ul>`
  } else {
    document.getElementById('mostrarUsuario').innerHTML += `<a href="index.html"><i class="fas fa-sign-in-alt"></i> Iniciar sesión</a></li>`
  }
});

//Genero función para eliminar usuario logueado del localStorage.
function logOut() {
  localStorage.removeItem('username');
}