const express = require("express");
const axios = require("axios");
const { getData, insertar, editar, eliminar } = require("./database/connection");
const app = express();
const port = 3002;

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

const { Pool } = require("pg");
// CONFIG BD
const config = {
  user: "postgres",
  host: "localhost",
  database: "repertorio",
  password: "admin",
  port: 5432,
};

app.use(express.json());//PARA ACCEDER A req.body

//ESTATICOS
app.use(express.static("public"));
app.use("/axios", express.static(__dirname + "/node_modules/axios/dist"));
app.use("/jquery", express.static(__dirname + "/node_modules/jquery/dist"));

//VISTA
app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//COMPLETAR DATOS
app.get("/canciones", async (req, res) => {
  try {
    const pool = new Pool(config);
    const result = await getData();
    //console.log(result);
    res.json(result);
  } catch {
    res.status(500).send("Algo salio mal :(");
  }
});

//INSERTAR
app.post("/cancion", async (req, res) => {
  try {
    const datos = Object.values(req.body);
    const respuesta = await insertar(datos);
    res.json(respuesta);
    //console.log(respuesta);
    //console.log(datos);
  } catch {
    res.status(500).send("Algo salio mal :(");
  }
});

//EDITAR
app.put("/cancion/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, artista, tono } = req.body;
    //const datos = Object.values(req.body);//OTRA FORMA DE RECOGER BODY
    
    const datosCompletos = {
      titulo: titulo,
      artista: artista,
      tono: tono,
      id: id,
    }; //HAY QUE ESTRUCTURAR EL OBJ PARA QUE COINCIDA CON LOS VALORES DE LA TABLA

    const resultado = await editar(datosCompletos);
    //console.log(resultado);
    res.status(200).json({ success: true, message: "Canción agregada" });
  } catch {
    console.error("Error al editar la canción:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno al editar la canción" });
  }
});

// ELIMINAR
app.delete("/cancion", async (req, res) => {
  try{
  const { id } = req.query;
  console.log(id);
  const resultado = await eliminar(id);
  res.status(200).json({ success: true, message: "Canción eliminada" });
  }catch{
    console.error("Error al eliminar la canción:", error);
    res
      .status(500)
      .json({ success: false, message: "Error interno al eliminar la canción" });

  }
})


// req.query: Parámetros de consulta en la URL (después de ?).
// req.body: Datos en el cuerpo de la solicitud (enviados en POST, PUT, PATCH).
// req.params: Parámetros de la ruta definidos en la URL (parte de la definición de la ruta).