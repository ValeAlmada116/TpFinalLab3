const apiUrl = 'https://api.yumserver.com/17059/generic/productos'

const formNuevoProd = document.getElementById('formNuevoProd');
const formModificarProd = document.getElementById('formModificar');
const nombreProducto = document.getElementById('nombreProducto');
const precioProd = document.getElementById('precioProd');
const categoriaProd = document.getElementById('categoriaProd');
const tablaProductos = document.getElementById('tablaProductos')

function MostrarProductos(producto){
    let html = '';
    for(let i=0; i <producto.length; i++){
        console.log(producto[i].nombreProducto)
        html += `
        <tr>
        <td><b>${producto[i].idcod}</b></td>
        <td><b>${producto[i].param1}</b></td><nombreProducto>
        <td><b>${producto[i].param2}</b></td><precioProd>
        <td><b>${producto[i].param3}</b></td><categoriaProd>
        <td><button onclick="Eliminar('${producto[i].idcod}')" class="btn btnEliminar">Eliminar</button></td>
        <td><button onclick="MostrarFormularioModificar('${producto[i].idcod}', '${producto[i].param1}', '${producto[i].param2}', '${producto[i].param3}')" class="btn btnModificar">Modificar</button></td>
        </tr>

        `;
    }
    document.getElementById('tablaProductos').innerHTML = html;
}

function ObtenerProductos(){
    fetch(apiUrl)
    .then(response => response.json())
    .then(data =>{
        MostrarProductos(data);
    })
    .catch(error => console.error('Error:', error));
}

function CrearNuevoProducto(){    
    let producto ={
        param1: document.getElementById('nombreProducto').value,
        param2: document.getElementById('precioProd').value,
        param3: document.getElementById('categoriaProd').value
    };
    fetch('https://api.yumserver.com/17059/generic/productos',{
        method: 'POST',
        headers :{ 'Content-Type': 'application/json'},
        body: JSON.stringify(producto)
    })
    .then(response =>response.text())
    .then(
        function (texto){
            if(texto.trim() == "OK"){
                alert('Se ha creado el producto');
                ObtenerProductos();

                document.getElementById('nombreProducto').value = '';
                document.getElementById('precioProd').value = '';
                document.getElementById('categoriaProd').value = '';
            }
            else{
                alert(texto);
                
            }
           
        }
    )
    .catch(error => console.error ('Error', error));
}

function Eliminar(idcod) {
    const confirmacion = confirm('¿Está seguro de que desea eliminar este producto?');
    if(!confirmacion) return;
    fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({idcod:idcod})
    })

      .then(response => response.text())
      .then(data => {
        if(data === 'OK') {
            alert('Se ha eliminado el producto');
            ObtenerProductos();
        }else {
            alert(`Error: ${data}`);
        }
    })
    .catch(error => console.error('Error:', error));
}

function MostrarFormularioModificar(idcod, nombreProducto, precioProd, categoriaProd) {
    console.log("Id:", idcod, "Nombre:", nombreProducto, "Precio:", precioProd, "Categoria:", categoriaProd);
    document.getElementById('nuevoIdcod').value = idcod;
    document.getElementById('nuevoProd').value = nombreProducto;
    document.getElementById('nuevoPrecio').value = precioProd;
    document.getElementById('nuevaCategoriaProd').value = categoriaProd;
    document.getElementById('formModificarProd').style.display = 'block';
}

function Modificar() {
    const id = document.getElementById('nuevoIdcod').value;
    const productoModificado = {
        idcod: id,
        param1: document.getElementById('nuevoProd').value,
        param2: document.getElementById('nuevoPrecio').value,
        param3: document.getElementById('nuevaCategoriaProd').value
    }
    fetch(apiUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productoModificado)
    })

       .then(response => response.text())
       .then(data => {
        console.log(data)
        if (data.trim() == "OK") {
            alert('Se ha modificado el producto');
            document.getElementById('formModificarProd').style.display = 'none';
                    
        } else {
            alert('Error al modificar el producto');
                    
        }
    })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', ObtenerProductos);