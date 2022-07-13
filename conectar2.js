var mysql = require('mysql');

var con = mysql.createConnection({
  host: "espiralsistemas.com",
  database: "ADMIN_PROPIEDADES",
  user: "admin_romero",
  password: "Rpn53r#53",
  port: "3306"
});

con.connect((err)=>{
  if(err) throw err;
  console.log("Conexión exitosa a base de datos");
});

const prompt = require('prompt-sync')();
const message=prompt("Número del contacto: ");


con.query(`SELECT * FROM CLIENTES WHERE CLAVE_CLIENTE = '${message}'`,(rows)=>{
 
        console.log(`Bienvenido usuario con ID: ${rows.CLAVE_CLIENTE}`);
});
con.end()