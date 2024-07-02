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
async function showUsers(){
    let users = await fetchData(BASEURL+'/usuarios/', 'GET');
    const tableUsers = document.querySelector('#list-table-users tbody');
    tableUsers.innerHTML='';
    users.forEach((user, index) => {
    let tr = `<tr>
    
        <td>${user.apellido}</td>
        <td>${user.nombre}</td>
        <td>${user.email}</td>
        <td>${user.fecha_nacimiento}</td>
        <td>${user.genero}</td>
        <td>${user.clave}</td>
        <td>
            <button class="btn-cac" onclick= updateUser(${user.id_usuario})><i class="fa fa-pencil" ></button></i>
            <button class="btn-cac" onclick= deleteUser(${user.id_usuario})><i class="fa fa-trash" ></button></i>
        </td>
    </tr>`;
    
    tableUsers.insertAdjacentHTML("beforeend",tr);
    });
}
/**
* Función para comunicarse con el servidor para poder Crear o Actualizar
* un registro de usuarios
* @returns
*/
async function saveUser(){
    const idUser = document.querySelector('#id-user').value;
    const apellido = document.querySelector('#lastname').value;
    const nombre = document.querySelector('#firstname').value;
    const fecha_nacimiento = document.querySelector('#birthdate').value;
    const genero = document.querySelector('#gender').value;
    const clave = document.querySelector('#password').value;
    const email = document.querySelector('#email').value;
    //VALIDACION DE FORMULARIO
    if (!apellido || !nombre || !fecha_nacimiento || !genero|| !clave || !email) {
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
        'firstname': nombre,
        'lastname': apellido,
        'birthdate': fecha_nacimiento,
        'gender': genero,
        'password': clave,
        'email': email
    }; 
    let result = null;
    // Si hay un idMovie, realiza una petición PUT para actualizar la película existente
    if(idUser!==""){
        var url_actualizar = 'http://127.0.0.1:5000/actualizar_usuario/'+idUser;
        result = await fetchData(url_actualizar, 'PUT', userData);
    }else{
    // Si no hay idMovie, realiza una petición POST para crear una nueva película
        result = await fetchData('http://127.0.0.1:5000/nuevo_usuario', 'POST', userData);
    }
    const formUser = document.querySelector('#form-user');
    formUser.reset();
    Swal.fire({
        title: 'Exito!',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'Cerrar'
        });
    showUsers();
}

/**
* Function que permite eliminar un usuario del array del localstorage
* de acuedo al indice del mismo
* @param {number} id posición del array que se va a eliminar
*/
function deleteUser(id){
    let data={};
    let url_borrar = BASEURL+'/eliminar_usuario/'+id;
    Swal.fire({
        title: "Esta seguro de eliminar la pelicula?",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                let response = await fetchData(url_borrar , 'DELETE', data);
                showUsers();
                Swal.fire(response.message, "", "success");
            }
        }
    );
}
/**
* Function que permite cargar el formulario con los datos de la pelicula
* para su edición
* @param {number} id Id de la pelicula que se quiere editar
*/
function formatoFecha(fecha){
    date = new Date(fecha)
    const [mes, dia, año] = [
        (date.getMonth()+1).toString().padStart(2, '0'),
        (date.getDate()+1).toString().padStart(2, '0'),
        date.getFullYear(),
      ];
    var armada = año+"-"+mes+"-"+dia;
    return armada
}
async function updateUser(id){
    //Buscamos en el servidor la pelicula de acuerdo al id
    let url_up = BASEURL+'/usuario/'+id;
    let response = await fetchData(url_up, 'GET');
    const idUser = document.querySelector('#id-user');
    const apellido = document.querySelector('#lastname');
    const nombre = document.querySelector('#firstname');
    const email = document.querySelector('#email');
    const fecha_nacimiento = document.querySelector('#birthdate');
    const genero = document.querySelector('#gender');
    const clave = document.querySelector('#password');

    idUser.value = response.id_usuario;
    apellido.value = response.apellido;
    nombre.value = response.nombre;
    email.value = response.email;
    fecha_nacimiento.value = formatoFecha(response.fecha_nacimiento);
    genero.value = response.genero;
    clave.value = response.clave;

}

// Escuchar el evento 'DOMContentLoaded' que se dispara cuando el
// contenido del DOM ha sido completamente cargado y parseado.
document.addEventListener('DOMContentLoaded',function(){
    const btnSaveUser = document.querySelector('#btn-save-user');
    //ASOCIAR UNA FUNCION AL EVENTO CLICK DEL BOTON
    btnSaveUser.addEventListener('click',saveUser);
    showUsers();
    });