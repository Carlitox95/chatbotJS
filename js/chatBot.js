/* Chatboat Code */
//Variable para saber el dominio donde estoy parado
let entornoWebIps="www.google.com/";

//Ubicacion fisica de los archivos JSON con preguntas y palabras claves
const jsonPreguntasSugeridas="json/preguntasSugeridas.json";
const jsonPalabrasClaves="json/palabrasClaves.json";


//Funcion para quitar acentos
function quitarAcentos(cadena){
  const acentos = {'á':'a','é':'e','í':'i','ó':'o','ú':'u','Á':'A','É':'E','Í':'I','Ó':'O','Ú':'U'};
  return cadena.split('').map( letra => acentos[letra] || letra).join('').toString(); 
}


function readTextFile(file, callback) {
 var rawFile = new XMLHttpRequest();
 rawFile.overrideMimeType("application/json");
 rawFile.open("GET", file, true);
 rawFile.onreadystatechange = function() {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
     callback(rawFile.responseText);
    }
  }
 rawFile.send(null);
}

//Funcion para enviar el mensaje Inicial
function mensajeInicial(msg) {
 $('.Messages_list').append('<div class="msg"><span class="avtr"><figure style="background-image: url(https://mrseankumar25.github.io/Sandeep-Kumar-Frontend-Developer-UI-Specialist/images/avatar.png)"></figure></span><span class="responsText">' + msg + '</span></div>');
 $("[name='msg']").val("");
};

//Funcion para aceptar sugerencia
function aceptarSugerencia(msg) {
 //Cargo la sugerencia como entrada de mensajes y simulo clickear boton
 document.getElementById('ingresarMensaje').value=msg;
 document.getElementById('ingresarMensaje').focus();
 document.getElementById("botonEnviarMensaje").click();
}

//Funcion para renderizar el mensaje del contacto
function escribirMensajeUsuario(msg) {
 $('.Messages_list').append('<div class="msg user"><span class="avtr"><figure style="background-image: url(https://mrseankumar25.github.io/Sandeep-Kumar-Frontend-Developer-UI-Specialist/images/avatar.png)"></figure></span><span class="responsText">' + msg + '</span></div>');
};

//Funcion para enviar un mensaje con el BOT
function enviarMensajeBot(msg) {
 $('.Messages_list').append('<div class="msg"><span class="avtr"><figure style="background-image: url(https://mrseankumar25.github.io/Sandeep-Kumar-Frontend-Developer-UI-Specialist/images/avatar.png)"></figure></span><span class="responsText">' + msg + '</span></div>');
 $("[name='msg']").val("");
};
      
//Funcion que calcula la cantidad de mensajes
function cantidadTotalMensajes() {
 let mensajes=$('.Messages_list').find('.msg');     
 return parseInt(mensajes.length);
}



//Funcion que obtiene sugerencias como links
function obtenerSugerencias(mensajeInicial) {

  //Leo el Texto con mis palabras claves:
  readTextFile(jsonPreguntasSugeridas, function(text){
   //Obtengo las sugerencias
   var arraySugerencias = JSON.parse(text);
  
   //Creo una coleccion para las sugerencias
   let sugerencias=mensajeInicial+"<br><br><div><br>";
    
    //Por cada sugerencia creo un boton
    for (let i = 0; i < arraySugerencias.length; i++) { 
     let unaSugerencia=`<a onclick="aceptarSugerencia('${arraySugerencias[i].palabraClave}')"  class="btn btn-info">${arraySugerencias[i].sugerencia}</a><br><br>`;
     sugerencias=sugerencias+unaSugerencia;
    }
   
   ///Termino el bloque de sugerencias
   sugerencias=sugerencias+"</div>";
   //Envio la respuesta del chatBot al usuario
   enviarMensajeBot(sugerencias); 
  }); 
}

//Funcion que busca la pregunta del usuario entre las preguntas posibles..
function buscarRespuesta(preguntaUsuario) {
 //Quito los acentos a lo que ingreso el usuario
 preguntaUsuario=quitarAcentos(preguntaUsuario);

  //Leo de mi archivo de palabras clave para buscar la pregunta:
  readTextFile(jsonPalabrasClaves, function(text){
   //Guardo los datos de mi json 
   var palabrasClaves = JSON.parse(text);
   //Defino la respuesta del mensaje
   let mensaje="";

    //Itero sobre todas las preguntas claves
    for (let i = 0; i < palabrasClaves.length; i++) {      
      //Si encuentro la pregunta, preparon respuestas...
      if(preguntaUsuario.indexOf(palabrasClaves[i].palabraClave) > -1) {            
       let botonMensaje=`<br><a class="btn btn-info" href="${entornoWebIps}/${palabrasClaves[i].enlace}">${palabrasClaves[i].vistaWeb}</a>`;
       mensaje=palabrasClaves[i].respuesta+botonMensaje;       
      }
    }
    
    //Si el mensaje no encontro nada.. capaz no entendi la pregunta..
    if(mensaje == "") {
     //Si no lo encontre en el Array
     mensaje="No hemos encontrado su pregunta, desea preguntar algo mas?";
    }
       
   //Envio el mensaje para responder al usuario
   enviarMensajeBot(mensaje);
  });
}
   

//Agrego el comportamiento una vez cargado el documento
jQuery(document).ready(function($) {
  
  jQuery(document).on('click', '.iconInner', function(e) {
   jQuery(this).parents('.botIcon').addClass('showBotSubject');
   $("[name='msg']").focus();
  });

  jQuery(document).on('click', '.closeBtn, .chat_close_icon', function(e) {
   jQuery(this).parents('.botIcon').removeClass('showBotSubject');
   jQuery(this).parents('.botIcon').removeClass('showMessenger');
  });

  jQuery(document).on('submit', '#botSubject', function(e) {
   e.preventDefault();
   jQuery(this).parents('.botIcon').removeClass('showBotSubject');
   jQuery(this).parents('.botIcon').addClass('showMessenger');
  });
  
 //Defino un mensaje inicial
 let msg="Hola!,sea usted bienvenido/a al nuevo sitio Web con quien tengo el gusto de comunicarme en el dia de hoy?";
 //Inicio la charla como el bot
 mensajeInicial(msg);

  //Evento de Submit para enviar mensajes
  $(document).on("submit", "#messenger", function(e) {    
   //cancelo el evento de recarga del formu..
   e.preventDefault();
   //Obtengo los valores ingresados
   var val = $("[name=msg]").val().toLowerCase();    
    
    //Si el usuario escribio algo lo muestro..  
    if (val.length > 0) {
     escribirMensajeUsuario(val);
    }
   
    //Si existe un valor deseado
    if (val) {
      //Si el chat recien inicia con el saludo del bot y la contestacion..
      if (cantidadTotalMensajes() <= 2) {
       let mensajeInicial="Hola <b>"+val+"</b>, un gusto comunicarme con usted, digame en que podemos ayudarte?. Tambien puedes ver nuestras sugerencias";
       //Intento obtener sugerencias y le mando el mensaje actual..
       obtenerSugerencias(mensajeInicial);
      }
      else {
       //Busco la respuesta en mi array de preguntas posibles..
       buscarRespuesta(val);              
      }  
    }

   //Le damos animacion al ultimo mensajes
   var lastMsg = $('.Messages_list').find('.msg').last().offset().top;
   $('.Messages').animate({scrollTop: lastMsg}, 'slow');
  });
  
})
/* Chatboat Code */
