// libreria para usar whatsapp web
const { Client, LocalAuth, MessageMedia, List } = require('whatsapp-web.js');

// libreria para usar prompts dentro de simbolo de sistema
const prompt = require('prompt-sync')();

// libreria para generar codigo qr
const qrcode = require('qrcode-terminal');

// libreria para generar archivo .txt 
var fs = require('fs');

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

var logger = fs.createWriteStream('Response.txt', {
    flags: 'a' // 'a' significa apendizar (conversar texto) "w"
  });

const number=prompt("Número del contacto: ");
const text = prompt("Mensaje a enviar: ");

const lista=["001","002","003","004","005","006","007","008","009"];

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
   
     // Mandar mensaje si el número ingresado es correcto        
        const chatId ="521" +number+"@c.us";
        client.isRegisteredUser(chatId).then(function(isRegistered) {
        if(isRegistered) {
        // Mandar mensaje
            client.sendMessage(chatId, text);
            logger.write(`Mensaje enviado correctamente: ${number}\n`);
        }
            else{
                console.log(`El telefono: ${number} no esta registrado en whatsapp`)
        }
    });
}); 


const listaProductos=new List(
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
            ],
        },
    ], 
    "Por favor selecciona un servicio"
);


const info='Este es un programa hecho en Javascript';
const hola='Hola te habla un bot';
const pdf=MessageMedia.fromFilePath("analisis_plastico.pdf");

client.on('message', async msg => {
    const nameChat=(await msg.getChat()).name;
    let mensaje=msg.body.toLowerCase();
    if (mensaje === 'información') {
        msg.reply(info);
        console.log(`El usuario: ${nameChat} ha solicitado más información`);
    } 
    
    else if (mensaje === 'hola') {
        client.sendMessage(msg.from, hola);
        console.log(`El usuario: ${nameChat} ha mandado hola`);
    }

    else if (mensaje === 'pdf') {
        client.sendMessage(msg.from, pdf);
        console.log(`El usuario: ${nameChat} ha solicitado un PDF`);
    }

    else if (mensaje === 'opciones') {
        client.sendMessage(msg.from,listaProductos);
    }

    else if (mensaje === 'saldo'){
        client.sendMessage(msg.from,"Apoyame diciendome tu numero de cuenta");
        console.log(`El usuario: ${nameChat} ha solicitado conocer su saldo`);
    }

    else if(lista.includes(mensaje)){
        client.sendMessage(msg.from,`Bienvenid@ ${lista} cuenta con un saldo a vencer de : 500 pesos`);
    }

    // else{
    //     client.sendMessage(msg.from,listaProductos);
    // }

});

client.on('disconnected', (reason) => {
    console.log('El número registrado para mandar mensajes se ha desconectado, volver a escanear el código QR', reason);
});



client.initialize();