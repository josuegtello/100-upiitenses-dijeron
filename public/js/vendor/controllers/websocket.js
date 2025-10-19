import sleep from "../middlewares/sleep.js";
import app from "../middlewares/app.js";
const d=document;

let connection={
    readyState:WebSocket.CLOSED
}

//Evento de mensaje
// Evento de mensaje
const handleOnMessage = function (e) {
    const data = JSON.parse(e.data);
    console.log("Mensaje WebSocket recibido:", data);
    const { event, body } = data;

    // Mensaje de conexion WebSocket exitoso
    if (event === "websocket-connected") {
        console.log("Configuramos el puerto WebSocket");
        const { ws_id } = body;
        app.ws_id = ws_id;
    }

    else if (event === "got-teams") {
        const { teams } = body;
        app.teams = teams;
    }

    // EVENTOS DEL CONTROLADOR
    // Evento que contiene los primeros 3 participantes
    else if (event === "round-participants") {
        const { participants } = body;
        setRoundParticipants(participants);
    }

    // EVENTOS DE LA PRESENTACION


};


// Evento de conexion
const handleOnOpen=function(event) {
    console.log("WebSocket conectado");
    sendWebSocketMessage({
        event:'set-rol',
        body:{
            rol:app.rol
        }
    });
}

// Evento en cierre de conexion
const handleOnClose=async function(e) {
    console.log("WebSocket desconectado");
    // Tratamos de conectar nuevamente el websocket
    await connectWebSocket();
    
}

// Evento de error
const handleOnError=function(e) {
    console.log("Error WebSocket: ", e);
    //createToast('error','WebSocket:','An error has occurred');
}

// Función que inicializa el WebSocket
const connectWebSocket=async function(){
    //esperamos 5 segundos para tratar una reconexion
    await sleep(5000);
    // no se hace nada si se esta conectado o ya esta conectado
    if(connection.readyState === WebSocket.CONNECTING || connection.readyState === WebSocket.OPEN) return;
    connection=new WebSocket(`ws://${location.hostname}:8083`);
    connection.debug = true;
    connection.addEventListener("message", handleOnMessage);
    connection.addEventListener("open", handleOnOpen);
    connection.addEventListener('close', handleOnClose);  
    connection.addEventListener("error", handleOnError);
    return true;
}

// Funcion para mandar mensaje WebSocket
const sendWebSocketMessage=function(data){
    if(connection.readyState === WebSocket.OPEN){
        console.log("Enviando mensaje WebSocket");
        console.log(data);
        connection.send(JSON.stringify(data));
    }
    else if(connection.readyState === WebSocket.CLOSED){
        console.log("WebSocket desconectado, no se puede enviar mensaje");
    }
}

export {
    connectWebSocket,
    sendWebSocketMessage
}