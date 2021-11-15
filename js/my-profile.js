//Genero la función para guardar los datos del usuario en localStorage,
//mediante JSON.stringify para convertirlo en una cadena de texto JSON
function saveUserData() {
    let userData = {
        name: document.getElementById("name").value,
        lastName: document.getElementById("lastName").value,
        email: document.getElementById("e-mail").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        birthDate: document.getElementById("birthDate").value,
        city: document.getElementById("birthDate").value
    }
    localStorage.setItem("userProfile", JSON.stringify(userData));
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que se hace click en el botón "Guardar cambios".
document.getElementById("saveChanges").addEventListener("click", function (e) {
    saveUserData();
});

//Genero la función para que una vez se cargue todo el contenido HTML se tome
//la información guardada en el localStorage de los datos y la foto del usuario.
document.addEventListener("DOMContentLoaded", function (e) {
    let savedData = JSON.parse(localStorage.getItem("userProfile"));
    if (savedData !== null) {
        document.getElementById("name").value = savedData.name;
        document.getElementById("lastName").value = savedData.lastName;
        document.getElementById("e-mail").value = savedData.email;
        document.getElementById("phoneNumber").value = savedData.phoneNumber;
        document.getElementById("birthDate").value = savedData.birthDate;
        document.getElementById("city").value = savedData.city;
    }
    const ImageData_URL = localStorage.getItem("recent-image");
    if (ImageData_URL) {
        document.querySelector("#imgPreview").setAttribute("src", ImageData_URL);
    }
});

//Se utiliza la API FileReader para poder leer el objeto blob que en este caso es la imagen almacenada en el cliente. 
$(document).ready(function () {
    var readURL = function (input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('.avatar').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    $(".file-upload").on('change', function () {
        readURL(this);
    });
});


document.querySelector("#myFileInput").addEventListener("change", function () {
    const reader = new FileReader();

    //Accedemos al URL y lo guardamos en localStorage. Una vez que se cargue la lectura del mismo, se ejecuta la función
    reader.addEventListener("load", () => {
        localStorage.setItem("recent-image", reader.result);
    });
    reader.readAsDataURL(this.files[0]);
});

//Realizo la validación de los campos para que sean obligatorios y se muestren
//alerts diseñados con Bootstrap.
function validateEmptyFields() {
    let nomb = document.getElementById("name").value;
    let apell = document.getElementById("lastName").value;
    let correo = document.getElementById("e-mail").value;
    let fecha = document.getElementById("birthDate").value;
    let telcel = document.getElementById("phoneNumber").value;
    let localidad = document.getElementById("city").value;
    if ((nomb === "") || (apell === "") || (correo === "") || (fecha === "") || (telcel === "") || (localidad === "")) {
        document.getElementById("alert-container").innerHTML = `<div class="alert alert-danger animate__animated animate__zoomIn" role="alert">
        <h4 class="alert-heading">Ups! Algo anda mal...</h4>
        <p>Debes llenar todos los campos para poder avanzar.</p>
        <hr>
      </div>`
    } else {
        document.getElementById("alert-container").innerHTML = `<div class="alert alert-success animate__animated animate__zoomIn" role="alert">
        <h4 class="alert-heading">Listo!</h4>
        <p>Los datos ya fueron guardados con éxito.</p>
        <hr>
      </div>`
    }
}