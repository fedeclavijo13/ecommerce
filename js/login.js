//Función para tomar la data del usuario y guardarla en localStorage
function SaveUser() {
    let nombre = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    if ((nombre !== "") && (password !== "")) {
        localStorage.setItem('username', nombre);
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

});