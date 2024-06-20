
let url = "/cancion";
let tbody = document.getElementById("cuerpo");
let cancion = document.getElementById("cancion");
let artista = document.getElementById("artista");
let tono = document.getElementById("tono");

let canciones = [];
window.onload = getData();
//MOSTRAR DATOS TABLA

async function getData() {
  await axios.get(url + "es").then((data) => {
    canciones = data.data;//SE AGREGA ROWS 
    tbody.innerHTML = "";
    //console.log(canciones)
    canciones.forEach((c, i) => {
      tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${c.titulo}</td>
        <td>${c.artista}</td>
        <td>${c.tono}</td>
        <td>
          <button class="btn btn-warning" onclick="prepararCancion(${i},'${c.id
        }')">Editar</button>
          <button class="btn btn-danger" onclick="eliminarCancion(${i},'${c.id
        }')">Eliminar</button>
        </td>
      </tr>
    `;
    });
  });
  cancion.value = "";
  artista.value = "";
  tono.value = "";
}
//INSERTAR
function nuevaCancion() {
  if (validarDatos()) {
    let data = {
      titulo: cancion.value,
      artista: artista.value,
      tono: tono.value,
    };
    axios.post(url, data).then(() => getData());
  }
}

function eliminarCancion(i, id) {
  axios.delete(url + "?id=" + id).then(() => {
    toastAlert("Canción " + canciones[i].titulo + " eliminada");
    getData();
  });
}

function prepararCancion(i, id) {
  cancion.value = canciones[i].titulo;
  artista.value = canciones[i].artista;
  tono.value = canciones[i].tono;
  document
    .getElementById("editar")
    .setAttribute("onclick", `editarCancion('${id}')`);
  document.getElementById("agregar").style.display = "none";
  document.getElementById("editar").style.display = "block";
}

function editarCancion(id) {
  if (validarDatos()) {
    axios.put(url + "/" + id, {
      titulo: cancion.value,
      artista: artista.value,
      tono: tono.value,
    }).then(() => {
      getData();
      document.getElementById("agregar").style.display = "block";
      document.getElementById("editar").style.display = "none";
    });
  }
}
function validarDatos() {
  if (cancion.value.trim() === "" || artista.value.trim() === "" || tono.value.trim() === "") {
    toastAlert("Todos los campos son obligatorios");
    return false;
  }
  return true;
}
function toastAlert(message) {
  $("#toastContainer").empty();
  const toast = `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="5000">
    <div class="toast-header">
      <strong class="me-auto">Alert</strong>
      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>  </div>
    <div class="toast-body">
      ${message}
    </div>
    </div>`;
  $("#toastContainer").append(toast);
  $(".toast").toast("show");
  $("#exampleModal").modal("hide");
}
