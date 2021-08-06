//##### VARIABLES GLOBALES #####
const rutCliente = document.getElementById("rutCliente");
const nombreCliente = document.getElementById("nombreCliente");
const fechaVenta = document.getElementById("fechaVenta");
const regionVenta = document.getElementById("regionVenta");
const cantidad = document.getElementById("cantidad");
const btnAgregarVenta = document.getElementById("btnAgregarVenta");
const tarjetaCantidadVentas = document.getElementById("tarjetaCantidadVentas");
const tarjetaTotalVentas = document.getElementById("tarjetaTotalVentas");
const tablaDetalleVentas = document.getElementById("tablaDetalleVentas");
const mostrarDolar = document.getElementById("mostrarDolar");
const mostrarUf = document.getElementById("mostrarUf");
const listaVentas = [];
const listaProductos = [];
const selectProductoParaVender = document.getElementById("selectProductoParaVender");
let totalVentasAcumulado = 0;
let cantidadVentas = 0;

//se agrega evento al boton del formulario nueva venta
btnAgregarVenta.addEventListener("click", (evento) => {
    evento.preventDefault();//la acción predeterminada que pertenece al evento no ocurrirá
    generarVenta();//se llama a la funcion que agrega una nueva venta al hacer click en el boton agregar
});

//##### CLASES #####
class Producto {
    //metodo constructor
    constructor(nombreProducto, precio) {
        this.nombreProducto = nombreProducto;
        this.precio = precio;
    }
}

class Cliente {
    //metodo constructor
    constructor(rut, nombre) {
        this.rut = rut;
        this.nombre = nombre;
    }
}

class Venta {
    //metodo constructor
    constructor(fecha, region, cantidad, cliente, producto) {
        this.fecha = fecha;
        this.region = region;
        this.cantidad = cantidad;
        this.cliente = cliente;
        this.producto = producto;
        this.totalVenta = cantidad * this.producto.precio;
    }

    //metodo que calcula el 10% cuando se haga la 3ra venta
    calculaDescuento() {
        if (cantidadVentas >= 2) {
            this.totalVenta = this.totalVenta * 0.9;
            alert("Felicitaciones " + this.cliente.nombre + "!!\nHas sido premiad@\n\nLuego del tercer producto vendido por nuestra tienda, se aplica un descuento de 10%\n¿Quieres seguir comprando?");
        }
    }
}

//se llama a las funciones con que inicia la pagina
llenarArregloProductos();
dibujarUF();
dibujarDolar();

//##### FUNCIONES #####
//funcion que llena la tabla stock, con la informacion inicial (productos)
function llenarArregloProductos(){
    let nuevoProducto = new Producto();
    //se crean 4 productos nuevos para llenar el arreglo
    nuevoProducto = new Producto("Amonio cuaternario", 9900); //se instancia un nuevo Producto 
    listaProductos.push(nuevoProducto);//se ingresa el el producto al arreglo de productos
    nuevoProducto = new Producto("Cloro", 2550); //se instancia un nuevo Producto
    listaProductos.push(nuevoProducto);//se ingresa el el producto al arreglo de productos    
    nuevoProducto = new Producto("Toallas humedas", 2690); //se instancia un nuevo Producto
    listaProductos.push(nuevoProducto);//se ingresa el el producto al arreglo de productos
    nuevoProducto = new Producto("Alcohol gel", 2816); //se instancia un nuevo Producto
    listaProductos.push(nuevoProducto);//se ingresa el el producto al arreglo de productos

    llenarSelectProductoParaVender();//se llena la lista desplegable de productos del formulario de nueva venta 
}

// funcion que llena la lista desplegable de productos del formulario nueva venta
function llenarSelectProductoParaVender () {
    let html = "<option selected>Seleccione producto</option>";
    //se recorre el arreglo de productos para obtener sus objetos con su propiedad nombreProducto
    listaProductos.forEach((elemento) => {
        html += "<option>" + elemento.nombreProducto + "</option>";
    });
    selectProductoParaVender.innerHTML = html;//se dibujan los valores del selector del formulario nueva venta  
}

//funcion que entrega el precio de un producto
let buscarPrecioProducto = (productoBuscado) => {
    let precio = 0;
    listaProductos.forEach((elemento) => {
        if (productoBuscado == elemento.nombreProducto) {
            precio = elemento.precio;
        }
    });
    return precio;
}

//funcion que genera una nueva venta
let generarVenta = () => {
    //si el formulario ha recibido parametros validos, se ingresa una nueva venta
    if (validarFormulario() == true) {
        let precioProducto = buscarPrecioProducto(selectProductoParaVender.value);//se obtiene el precio del producto seleccionado 
        let nuevoProducto = new Producto(selectProductoParaVender.value, precioProducto);//se construye un Producto
        let nuevoCliente = new Cliente(rutCliente.value, nombreCliente.value);//se construye  un Cliente
        let nuevaVenta = new Venta(fechaVenta.value, regionVenta.value, parseInt(cantidad.value), nuevoCliente, nuevoProducto);//se construye una Venta

        nuevaVenta.calculaDescuento();//se aplica descuento si es que corresponde, antes de enviar al arreglo de ventas

        listaVentas.push(nuevaVenta);//se llena el arreglo de ventas, con la nueva venta    
        dibujarTablaDetalleVentas();//se actualiza la tabla detalle de venta 
        cantidadVentas = listaVentas.length;//se calcula la cantidad de ventas y se muestra en la tarjeta azul      
        tarjetaCantidadVentas.innerHTML = `<h6 class="card-title text-white">Cantidad de ventas</h6><hr><p class="card-text text-center text-white display-6">${cantidadVentas}</p>`;
        totalVentasAcumulado += nuevaVenta.totalVenta;//se calcula total de ventas acumulado y se muestra en la tarjeta verde 
        tarjetaTotalVentas.innerHTML = `<h6 class="card-title text-white">Total de ventas acumulado</h6><hr><p class="card-text text-center text-white display-6">$ ${totalVentasAcumulado}</p>`;
        limpiarFormulario();
    }
}

//funcion que limpia el formulario
let limpiarFormulario = () => {
    rutCliente.value = "";
    nombreCliente.value = "";
    fechaVenta.value = "";
    regionVenta.value = "Seleccione región";
    selectProductoParaVender.value = "Seleccione producto";
    cantidad.value = "";
}

//function  que itera con la funcion forEach los registros contenidos en el arreglo listaVentas y los muestra en la tabla
let dibujarTablaDetalleVentas = () => {
    let html = ""; //variable para armar la estructura html
    let cont = 0;

    //se itera el arreglo
    listaVentas.forEach((elemento) => {
        html += "<tr> <td>" + (cont += 1) + "</td> <td>" + elemento.cliente.rut + "</td> <td>" + elemento.cliente.nombre + "</td> <td>" + elemento.fecha + "</td> <td>" + elemento.region + "</td> <td>" + elemento.producto.nombreProducto + "</td> <td>$" + elemento.producto.precio + "</td> <td>" + elemento.cantidad + "</td> <td>$" + elemento.totalVenta + "</td> </tr>";
    });
    tablaDetalleVentas.innerHTML = html;//se envia la estructura html que va llenando la tabla de detalle ventas     
}

//funcion que imprime el valor de la Uf en la esquina superior derecha de la navbar
function dibujarUF() {
    //funcion que consulta una api para obtener el valor de la uf 
    let rescatarUF = () => {
        return new Promise(function (ok, noOK) {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.status == 200 && xhr.readyState == 4) {
                    ok(xhr.responseText);
                }
                else if (xhr.readyState == 4) {
                    noOK(xhr);
                }
            }
            xhr.open("get", "https://api.cmfchile.cl/api-sbifv3/recursos_api/uf?apikey=4fdf6d39eb742dc5fd3b3ce9dbedadb888400aff&formato=json");
            xhr.send();
        });
    }

    //se imprime el valor de la Uf en la esquina superior derecha de la navbar
    rescatarUF().then(dato => {
        let json = JSON.parse(dato);
        let valorUf = json.UFs[0].Valor;
        mostrarUf.append("(UF hoy: CLP$" + valorUf + ")");//se muestra el resultado en en el navbar
    }).catch(obj => {
        mostrarUf.append("(UF hoy: -Error-)");//se muestra el resultado en en el navbar   
    });
}

//funcion qu imprime el valor del Dolar en la esquina superior derecha de la navbar
function dibujarDolar() {
    //funcion que consulta una api para obtener el valor del dolar 
    let rescatarDolar = () => {
        return new Promise(function (ok, noOK) {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.status == 200 && xhr.readyState == 4) {
                    ok(xhr.responseText);
                }
                else if (xhr.readyState == 4) {
                    noOK(xhr);
                }
            }
            xhr.open("get", "https://api.sbif.cl/api-sbifv3/recursos_api/dolar?apikey=a6073621b6b49dffb8bcd2fe83dc304888a6766b&formato=json");
            xhr.send();
        });
    }

    //se imprime el valor del dolar en la esquina superior derecha de la navbar
    rescatarDolar().then(dato => {
        let json = JSON.parse(dato);
        let valorDolar = json.Dolares[0].Valor;
        mostrarDolar.append(" (Dolar hoy: US$" + valorDolar + ")");//se muestra el resultado en en el navbar
    }).catch(obj => {
        mostrarDolar.append(" (Dolar hoy: -ERROR-)");//se muestra el resultado en en el navbar   
    });

}

//#################### VALIDACIONES ####################
//funcion que valida el llenado de los campos del formulario consumiendo las funciones que vienen mas adelante
let validarFormulario = () => {
    if (validarIngresoRUT(rutCliente.value) == true && validarIngresoNombreCliente(nombreCliente.value) == true && validarIngesoFecha(fechaVenta.value) == true && validarIngresoRegion(regionVenta.value) == true && validarIngresoCantidad(cantidad.value) == true) {
        return true;
    }
    return false;
}

//funcion que valida el valor ingresado en el campo rut y el largo de este
let validarIngresoRUT = (rut) => {
    if (rut == "" || rut == null || rut == "Ingrese RUT") {
        alert("Debe completar el RUT del Cliente");
        return false;
    } else if (rut.length < 9) {
        alert("El rut debe tener más de 9 caratéres");
        return false;
    }
    return true;
}

// funcion que valida el valor en el campo nombre del cliente y el largo de este
let validarIngresoNombreCliente = (nombre) => {
    if (nombre == "" || nombre == null || nombre == "Ingrese nombre") {
        alert("Debe completar el Nombre del Cliente");
        return false;
    } else if (nombre.length < 4) {
        alert("El nombre debe tener más de 4 caratéres");
        return false;
    }
    return true;
}

// funcion que valida el valor en el campo nombre del cliente y el largo de este
let validarIngresoRegion = (region) => {
    if (region == "" || region == null || region == "Seleccione región") {
        alert("Debe seleccionar la región");
        return false;
    }
    return true;
}

//funcion que valida el valor ingresado en el campo fecha
let validarIngesoFecha = (fecha) => {
    if (fecha == "" || fecha == null) {
        alert("Debe completar la fecha de la venta");
        return false;
    }
    return true;
}

// funcion verifica el valor ingresado en el campo cantidad
let validarIngresoCantidad = (cantidad) => {
    if (isNaN(cantidad) || cantidad <= 0 || cantidad == null) {
        alert("Debe ingresar una cantidad mayor a 0");
        return false;
    }
    return true;
}









