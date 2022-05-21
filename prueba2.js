// libreria para usar whatsapp web
const { Client, LocalAuth, MessageMedia, List } = require('whatsapp-web.js');

// libreria para usar prompts dentro de simbolo de sistema
const prompt = require('prompt-sync')();

// libreria para generar codigo qr
const qrcode = require('qrcode-terminal');

// libreria para generar archivo .txt 
var fs = require('fs');

var logger = fs.createWriteStream('Response.txt', {
    flags: 'a' // 'a' significa apendizar (conversar texto)
  });

let number=prompt("Número del contacto: ");
const text = prompt("Mensaje a enviar: ");

// Dar de alta clientes
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('authenticated', () => {
    console.log('Cliente autenticado');
});


// Notificar si hay un error al momento de restaurar una sesión
client.on('auth_failure', msg => {
    console.error('Error en la autentificación, correr programa de nuevo', msg);
});


//Generar código qr
client.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
  });

  client.on('ready', () => {
    console.log('Mensaje enviado');
   
    // Delay para mandar mensaje después de 10 segundos
    setTimeout(()=>{
     // Mandar mensaje si el número ingresado es correcto        
          const chatId ="521" +number+"@c.us";
            // Mandar mensaje
            client.sendMessage(chatId, text);
            logger.write(`Mensaje enviado correctamente: ${number}\n`);
        },1000);//delay para evitar mandar el mensaje al mismo tiempo
    }); 

// 8443538609

const listaProductos=new List(
    "Aquí puede ver toda nuestra lista de servicios",
    "Ver todos los servicios",
    [
        {
            title: "Lista de servicios",
            rows: [
                {id: "pdf",title: "PDF"},
                {id:"hola",title: "Hola"},
                {id: "info",title: "Info"},
            ],
        },
    ], 
    "Por favor selecciona un servicio"
);

client.on('message', async msg => {
    const nameChat=(await msg.getChat()).name;
    let mensaje=msg.body.toLowerCase();
    if (mensaje === 'info') {
        msg.reply('Este es un programa hecho en Javascript');
        console.log(`El usuario: ${nameChat} ha solicitado más información`);
    } 
    
    else if (mensaje === 'hola') {
        client.sendMessage(msg.from, 'Hola te habla un bot');
        console.log(`El usuario: ${nameChat} ha mandado hola`);
    }

    else if (mensaje === 'pdf') {
        const pdf=MessageMedia.fromFilePath("analisis_plastico.pdf");
        client.sendMessage(msg.from, pdf);
        console.log(`El usuario: ${nameChat} ha solicitado un PDF`);
    }

    else if (mensaje === 'opciones') {
        client.sendMessage(msg.from,listaProductos);
    }

    // else{
    //     client.sendMessage(msg.from,listaProductos);
    // }

});

client.on('disconnected', (reason) => {
    console.log('El número registrado para mandar mensajes se ha desconectado, volver y volver a escanear el código QR', reason);
});


client.initialize();

// convertir a ejecutable
//pkg prueba2.js 
