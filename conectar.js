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

con.query("SELECT * FROM CLIENTES WHERE CLAVE_CLIENTE = '6'",(err, rows)=>{
  if(err) throw err;
  // const usuario = rows[4];
  // console.log(`El usuario ${usuario.CLIENTE_ID} se llama ${usuario.NOMBRE} y su número de teléfono es ${usuario.TEL_CLIENTE}`);
  let usuario=[]
  for(let i=0; i<rows.length; i++) {
    usuario=rows[i];
    numeroTelefono=usuario.TEL_CLIENTE.replace(/\s/g, '')
    console.log(numeroTelefono)
  }
})

con.end()
