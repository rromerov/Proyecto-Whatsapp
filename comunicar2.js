// pkg filename.js --input number --input arguments

// libreria para usar whatsapp web
const { Client, LocalAuth, MessageMedia, List } = require('whatsapp-web.js');

// npm i whatsapp-web.js
// npm i qrcode-terminal
// npm i mysql

// libreria para generar codigo qr
const qrcode = require('qrcode-terminal');

// libreria para generar archivo .txt 
var fs = require('fs');

let ARGV = require( '@stdlib/process-argv' );

const executablePath = `${process.cwd()}\\chrome-win\\chrome.exe` 

const client = new Client({
    puppeteer: {
      executablePath: executablePath,
      headless: true,
      args:[
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    },
    authStrategy: new LocalAuth(),
});

// variable para crear archivo txt
var logger = fs.createWriteStream('Response.txt', {
    flags: 'a' // 'a' significa apendizar (conversar texto) "w"
  });

// variable para mandar mensaje a número telefonico  
let number=ARGV[2]

// variable para tomar comandos desde la cuarta posición
const arguments=ARGV.slice(3);

// función para guardar los argumentos como una cadena de texto
const text=arguments.join(" ");

const list=["001","002","003","004","005","006","007","008","009"];

client.on('authenticated', () => {
    console.log('Cliente autenticado');
});

// Notificar si hay un error al momento de restaurar una sesión
client.on('auth_failure', msg => {
    console.error('Error de autentificación', msg);
});


//Generar código qr
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Cliente listo');
    const chatId ="521" +number+"@c.us";
    // const examplenumber= "8661048597";
    // Mandar mensaje si el número ingresado es correcto 

    // if(number.length==examplenumber.length) {
    client.sendMessage(chatId, text);
    logger.write(`Mensaje enviado correctamente: ${number}\n`);
    // }
    // else{
    //     console.error("El número proporcionado no cuenta con 10 dígitos, favor de verificar que el número sea correcto"); 
    //     process.exit(1);
    // }
}); 
    
const productsList=new List(
    "Aquí puede ver toda nuestra lista de servicios",
    "Ver todos los servicios",
    [
        {
            title: "Lista de servicios",
            rows: [
                {id: "pdf",title: "PDF"},
                {id:"hola",title: "Hola"},
                {id: "información",title: "Información"},
                {id: "saldo",title: "Saldo"},
                {id: "contacto",title: "Contacto"}
            ],
        },
    ], 
    "Por favor selecciona un servicio"
);

const info='Este es un programa hecho en Javascript';
const hi='Hola te habla un bot';
const pdf=MessageMedia.fromFilePath("analisis_plastico.pdf");

client.on('message', async msg => {
    const nameChat=(await msg.getChat()).name;
    // función para convertir mensajes del usuario a minúsculas
    let message=msg.body.toLowerCase();

    if (message === 'información') {
        msg.reply(info);
        console.log(`El usuario: ${nameChat} ha solicitado más información`);
    } 
    
    else if (message === 'hola') {
        client.sendMessage(msg.from, hi);
        console.log(`El usuario: ${nameChat} ha mandado hola`);
    }

    else if (message === 'pdf') {
        client.sendMessage(msg.from, pdf);
        console.log(`El usuario: ${nameChat} ha solicitado un PDF`);
    }

    else if (message === 'opciones') {
        client.sendMessage(msg.from,productsList);
    }

    else if (message === 'saldo'){
        client.sendMessage(msg.from,"Apoyame diciendome tu numero de cuenta");
        console.log(`El usuario: ${nameChat} ha solicitado conocer su saldo`);
    }

    else if (message === 'contacto') {
        client.sendMessage(msg.from,"Da clic en el siguiente número para marcar a Espiral Sistemas: 8661763728");
        console.log(`El usuario: ${nameChat} ha solicitado información de contacto`);
    }

    else if(list.includes(message)){
        client.sendMessage(msg.from,`Bienvenid@ ${list} cuenta con un saldo a vencer de : 500 pesos`);
    }

    // else{
    //     client.sendMessage(msg.from,listaProductos);
    // }

});

client.on('disconnected', (reason) => {
    console.log('El número registrado para mandar mensajes se ha desconectado, volver a escanear el código QR', reason);
});

client.initialize();