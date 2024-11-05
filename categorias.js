const apiUrl = 'https://api.yumserver.com/17059/generic/categorias'

const formNuevaCat = document.getElementById('formNuevaCat');
const formModificar = document.getElementById('formModificar');
const nombreCategoria = document.getElementById('nombreCategoria');
const cantidadDeProd = document.getElementById('cantidadDeProd');
const tablaCategorias = document.getElementById('tablaCategorias')

function MostrarCategorias(categoria){
    let html = '';
    for(let i=0; i <categoria.length; i++){
        console.log(categoria[i].nombreCategoria)
        html += `
        <tr>
        <td><b>${categoria[i].idcod}</b></td>
        <td><b>${categoria[i].param1}</b></td><nombreCategoria>
        <td><b>${categoria[i].param2}</b></td><CantidadDeProd>
        <td><button onclick="Eliminar('${categoria[i].idcod}')" class="btn btnEliminar">Eliminar</button></td>
        <td><button onclick="MostrarFormularioModificar('${categoria[i].idcod}', '${categoria[i].param1}', '${categoria[i].param2}')" class="btn btnModificar">Modificar</button></td>
        </tr>

        `;
    }
    document.getElementById('tablaCategorias').innerHTML = html;
}

function ObtenerCategorias(){
    fetch(apiUrl)
    .then(response => response.json())
    .then(data =>{
        MostrarCategorias(data);
    })
    .catch(error => console.error('Error:', error));
}

function CrearNuevaCategoria(){    
    let categoria ={
        param1: document.getElementById('nombreCategoria').value,
        param2: document.getElementById('cantidadDeProd').value,
    };
    fetch('https://api.yumserver.com/17059/generic/categorias',{
        method: 'POST',
        headers :{ 'Content-Type': 'application/json'},
        body: JSON.stringify(categoria)
    })
    .then(response =>response.text())
    .then(
        function (texto){
            if(texto.trim() == "OK"){
                alert('Se ha creado la categoria');
                ObtenerCategorias();

                document.getElementById('nombreCategoria').value = '';
                document.getElementById('cantidadDeProd').value = '';                
            }
            else{
                alert(texto);
                
            }
           
        }
    )
    .catch(error => console.error ('Error', error));
}

function Eliminar(idcod) {
    const confirmacion = confirm('¿Está seguro de que desea eliminar esta categoria?');
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
            alert('Se ha eliminado la categoria');
            ObtenerCategorias();
        }else {
            alert(`Error: ${data}`);
        }
    })
    .catch(error => console.error('Error:', error));
}

function MostrarFormularioModificar(idcod, nombreCategoria, cantidadDeProd) {
    console.log("Id:", idcod, "Nombre:", nombreCategoria, "Cantidad de Productos:", cantidadDeProd);
    document.getElementById('nuevoIdcod').value = idcod;
    document.getElementById('nuevaCategoria').value = nombreCategoria;
    document.getElementById('nuevaCantidadDeProd').value = cantidadDeProd;
    document.getElementById('formModificar').style.display = 'block';
}

function Modificar() {
    const id = document.getElementById('nuevoIdcod').value;
    const categoriaModificada = {
        idcod: id,
        param1: document.getElementById('nuevaCategoria').value,
        param2: document.getElementById('nuevaCantidadDeProd').value
    }
    fetch('https://api.yumserver.com/17059/generic/categorias', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },

        body: JSON.stringify(categoriaModificada)
    })    
        
    .then(response => response.text())
        .then(data => {console.log(data)
            if (data.trim() == "OK") {
                alert('Se ha modificado la categoria');
                ObtenerCategorias();
                document.getElementById('formModificar').style.display = 'none';
                    
            } else {
                alert('Error al modificar la categoria');
                    
            }
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', ObtenerCategorias);