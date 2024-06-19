const { Pool } = require("pg");

// CONFIG BD
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "repertorio",
  password: "admin",
  port: 5432,
});
//TODOS LOS DATOS
const getData = async () => {
  try {
    const result = await pool.query(
      "SELECT id, titulo, artista, tono FROM canciones ORDER BY id ASC"
    );
    return result;
  } catch {
    console.log("Ups, algo salió mal");
  }
};
//INSERTAR
const insertar = async (datos) => {
  try {
    const consulta = {
      text: "INSERT INTO canciones (titulo, artista, tono) VALUES ($1, $2, $3);",
      values: datos,
    };
    const result = await pool.query(consulta);
    return result;
  } catch (error) {
    console.error("Error al editar la canción:", error);
  }
};
//EDITAR
const editar = async (datos) => {
  try {
    const consulta = {
      text: "UPDATE canciones SET titulo = $1, artista = $2, tono = $3 WHERE id = $4;",
      values: Object.values(datos),
    };
    const result = await pool.query(consulta);
    return result;
  } catch (error) {
    console.error("Error al editar la canción:", error);
  }
};
//ELIMINAR
const eliminar = async (id) =>{
  try{
    const consulta={
      text: "DELETE FROM canciones WHERE id = $1",
      values: [id],
    }
    const result = await pool.query(consulta);
    return result;

  }catch (error){
    console.error("Error al eliminar la canción:", error);
  }
}
module.exports = { getData, insertar, editar, eliminar};
