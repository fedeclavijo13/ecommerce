var product = {};
var comments = [];

//Función para tomar los nombres de las imágenes del producto y cargarlas como contenido HTML a la página.
function showImagesGallery(array) {

    let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {
        let imageSrc = array[i];

        htmlContentToAppend += `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
            </div>
        </div>
        `

        document.getElementById("productImagesGallery").innerHTML = htmlContentToAppend;
    }
}

//Función para realizar la petición del JSON de la información de los productos, y va agregando en las secciones del HTML los datos correspondientes en cada una de ellas.
//Por último, ejecuta la función para mostrar las imágenes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            product = resultObj.data;

            let productNameHTML = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productCostHTML = document.getElementById("productCost");
            let productSoldCount = document.getElementById("productSoldCount");
            let productCategoryHTML = document.getElementById('productCategory');

            productNameHTML.innerHTML = product.name;
            productDescriptionHTML.innerHTML = product.description;
            productCostHTML.innerHTML = product.currency + " " + product.cost;
            productSoldCount.innerHTML = product.soldCount;
            productCategoryHTML.innerHTML = product.category;

            //Muestro las imagenes en forma de galería
            showImagesGallery(product.images);
        }
    });
});

//Creo función para tomar la calificación de los comentarios y agregarlos en HTML con los iconos de estrella pintada (checked) y estrella vacía,
// recorriendo con el for para que considere todas las posibilidades que se puedan dar en cuanto a calificación.
function drawStars(stars) {

    let number = parseInt(stars);
    let htmlContentToAppend = "";
    for (let i = 1; i <= number; i++) {
        htmlContentToAppend += `<span class="fa fa-star checked"></span>`
    }
    for (let j = number + 1; j <= 5; j++) {
        htmlContentToAppend += `<span class="far fa-star"></span>`
    }
    return htmlContentToAppend;
}

//Función para tomar los comentarios tomados del JSON e irlos agregando en el HTML con sus datos correspondientes: Usuario, fecha, calificación y descripción.
function showComments(array) {
    let htmlContentToAppend = ""
    for (let i = 0; i < array.length; i++) {
        let comment = array[i];
        htmlContentToAppend += `<div class="shadow-sm p-2 mb-3 bg_comments rounded">
                    <dl>
                        <dt>${comment.user} - ${comment.dateTime} - ${drawStars(comment.score)}</dt>
                        <dd>${comment.description}</dd>
                    </dl>
                </div>`
    }
    document.getElementById('comments').innerHTML = htmlContentToAppend;
}

//Petición al JSON de los comentarios y posteriormente ejecuto la función para mostrarlos, solicitando que se agregue el contenido en el HTML.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            commentsArray = resultObj.data;
            showComments(commentsArray);
        }
    });
});

//Función que toma la información del textarea y la calificación de estrellas y luego carga el contenido debajo de los comentarios existentes,
//considerando el mismo estilo de los anteriores, tomando una diferencia en cuanto al color para resaltar que es el nuevo comentario ingresado.
function newComment() {
    let htmlContentToAppend = ""
    //Tomo la información de la fecha y hora que es en el momento de generar el comentario y arreglo el formato para que quede igual que los comentarios del JSON.
    let date = new Date();
    let formatDate = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + " " + date.getHours() + ":" + date.getMinutes().toString().padStart(2, '0') + ":" + date.getSeconds().toString().padStart(2, '0');

    //Declaro variables y realizo condicionales para poder setear la calificación correctamente.
    var score1 = document.getElementById("radio5");
    var score2 = document.getElementById("radio4");
    var score3 = document.getElementById("radio3");
    var score4 = document.getElementById("radio2");
    var score5 = document.getElementById("radio1");
    var review = 0

    if (score5.checked)
        review = 5
    else if (score4.checked)
        review = 4
    else if (score3.checked)
        review = 3
    else if (score2.checked)
        review = 2
    else if (score1.checked)
        review = 1

    var check = "";
    for (let i = 1; i <= review; i++) {
        check += `<span class="fa fa-star checked"></span>`
    }

    var noCheck = "";
    for (let i = 1; i <= 5 - review; i++) {
        noCheck += `<span class="far fa-star"></span>`
    }

    comment = {
        description: document.getElementById("textarea").value,
        completeDate: formatDate,
        user: localStorage.getItem("username")
    }

    //Armo el contenido HTML a agregar del nuevo comentario.
    htmlContentToAppend += `<div class="animate__animated animate__zoomIn shadow-sm p-2 mb-3 rounded bg_new_comment">
                    <dl>
                        <dt>${comment.user} - ${comment.completeDate} - ` + check + noCheck + `</dt>
                        <dd>${comment.description}</dd>
                    </dl>
                </div>`

    //Agrego el contenido al HTML y procedo a resetear la calificación y el textarea para un nuevo comentario.
    document.getElementById('comments').innerHTML += htmlContentToAppend;
    document.getElementById('calif').reset();
    document.getElementById('textarea').value = "";
}