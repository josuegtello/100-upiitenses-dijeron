import sleep from "../middlewares/sleep.js";
import app from "../middlewares/app.js";
import { setRoundParticipants } from "../controller.js";
const d=document;

let connection={
    readyState:WebSocket.CLOSED
}

//Evento de mensaje
const handleOnMessage=function(e){
    const data=JSON.parse(e.data);
    console.log("Mensaje WebSokcet recibido:",data);
    const {event,body}=data;
    //Mensaje de conexion webSocket exitoso
    if(event === "websocket-connected"){
        console.log("Configuramos el puerto WebSocket");
        const {ws_id}=body;
        app.ws_id=ws_id;
    }
    else if(event === "teams-obtained"){
        const {teams}=body;
        app.teams=teams;
    }
    else if(event === "rounds-obtained"){
        const {rounds}=body;
        app.rounds=rounds;
        console.log(app);
    }
    // EVENTOS DEL CONTROLADOR
    // Evento que contiene los primeros 3 participantes 
    else if(event === "round-participants"){
        const {participants}=body;
        setRoundParticipants(participants);
    }

    // EVENTOS DE LA PRESENTACION




}

// Evento de conexion
const handleOnOpen=async function(event) {
    console.log("WebSocket conectado");
    await sleep(500);//Espero 1 segundo para solicitar mi ws_id
    sendWebSocketMessage({
        event:'set-rol',
        body:{
            rol:app.rol
        }
    });
    await sleep(200);
    app.getTeams();
    await sleep(200);
    app.getRounds();
    await sleep(200);
    // CASO PARTICULAR - CONTROLADOR
    if(app.rol==="controller"){
        sendWebSocketMessage({
            event:"test-participants",
            body:null
        })
    }



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