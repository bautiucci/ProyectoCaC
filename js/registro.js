const BASEURL = 'http://127.0.0.1:5000';
/**
* Función para realizar una petición fetch con JSON.
* @param {string} url - La URL a la que se realizará la petición.
* @param {string} method - El método HTTP a usar (GET, POST, PUT, DELETE, etc.).
* @param {Object} [data=null] - Los datos a enviar en el cuerpo de la petición.
* @returns {Promise<Object>} - Una promesa que resuelve con la respuesta en formato JSON.
*/
async function fetchData(url, method, data = null) {
    const options = {
        method: method,
        headers: {
        'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : null, // Si hay datos, los convierte a JSON y los incluye en el cuerpo
    };
    try {
        const response = await fetch(url, options); // Realiza la petición fetch
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json(); // Devuelve la respuesta en formato JSON
    } catch (error) {
        console.error('Fetch error:', error);
        alert('An error occurred while fetching data. Please try again.');
    }
}
/** Funcion para usar con el formulario de registro que podra llenar el usuario */

async function agregar_usuario(){
    const apellido = document.querySelector('#lastname').value;
    const nombre = document.querySelector('#firstname').value;    
    const fecha_nacimiento = document.querySelector('#birthdate').value;
    const genero = document.querySelector('#gender').value;
    const clave = document.querySelector('#password').value;
    const email = document.querySelector('#email').value;
    //VALIDACION DE FORMULARIO
    if (!email) {
        Swal.fire({
            title: 'Error!',
            text: 'Por favor completa todos los campos.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
            });
        return;
    }
    // Crea un objeto con los datos de la película
    const userData = {
        firstname: nombre,
        lastname: apellido,
        birthdate: fecha_nacimiento,
        gender: genero,
        password: clave,
        email: email
    }; 
    let result = null;
    result = await fetchData('http://127.0.0.1:5000/nuevo_usuario', 'POST', userData);
    const formUser = document.querySelector('#form-registro');
    formUser.reset();
    Swal.fire({
        title: 'Exito!',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'Cerrar'
        });
}
document.addEventListener('DOMContentLoaded',function(){
    const btnEnviar = document.querySelector('#btn-enviar');
    //ASOCIAR UNA FUNCION AL EVENTO CLICK DEL BOTON
    btnEnviar.addEventListener('click', agregar_usuario);
    });
