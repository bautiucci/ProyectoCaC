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
    <button class="btn-cac" onclick='updateMovie(${user.id_usuario})'><i class="fa fa-pencil" ></button></i>
    <button class="btn-cac" onclick='deleteMovie(${user.id_usuario})'><i class="fa fa-trash" ></button></i>
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
    const email = document.querySelector('#email').value;
    const fecha_nacimiento = document.querySelector('#birthdate').value;
    const genero = document.querySelector('#gender').value;
    const clave = document.querySelector('#password').value;
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
        'email': email,
        'birthdate': fecha_nacimiento,
        'gender': genero,
        'password': clave
    }; 
    let result = null;
    // Si hay un idMovie, realiza una petición PUT para actualizar la película existente
    if(idUser!==""){
        result = await fetchData(`${BASEURL}/actualizar_usuario/${idUser}`, 'PUT', userData);
    }else{
    // Si no hay idMovie, realiza una petición POST para crear una nueva película
        result = await fetchData(`${BASEURL}/nuevo_usuario`, 'POST', userData);
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
async function agregar_usuario(){
    const apellido = document.querySelector('#lastname').value;
    const nombre = document.querySelector('#firstname').value;
    const email = document.querySelector('#email').value;
    const fecha_nacimiento = document.querySelector('#birthdate').value;
    const genero = document.querySelector('#gender').value;
    const clave = document.querySelector('#password').value;
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
        'email': email,
        'birthdate': fecha_nacimiento,
        'gender': genero,
        'password': clave
    }; 
    let result = null;
    result = await fetchData(`${BASEURL}/nuevo_usuario`, 'POST', userData);
    const formUser = document.querySelector('#form-user');
    formUser.reset();
    Swal.fire({
        title: 'Exito!',
        text: result.message,
        icon: 'success',
        confirmButtonText: 'Cerrar'
        });
}