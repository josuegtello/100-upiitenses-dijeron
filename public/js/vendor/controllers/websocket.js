import sleep from "../middlewares/sleep.js";
import app from "../middlewares/app.js";
import { setRoundParticipants } from "../controller.js";
import { initRound, showAnswer, showStrikes, showTeam ,updateScoreTeam, playTutuSound, showQuestion,winGame,playButtonPressed} from "../presentation.js";

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
    else if(event === "all-obtained"){
        const {rounds,teams} = body;
        app.teams=teams;
        app.rounds=rounds;
        console.log(app);
        teams.forEach(team => {
            updateScoreTeam(team,false);
        });
    }
    //CALLBACK que se envia si el equipo se actualizo correctamente
    else if(event === "team-updated"){
        const {response,team}=body;
        if (response.status === 200){ // Se actualizo correctamente el equipo
            app.teams.forEach((tm,index) => {
                if(tm.uuidv4=== team.uuidv4){
                    app.teams[index]=team
                }
            });
            console.log(response.statusText,app);
            if(app.rol==="presentation"){
                updateScoreTeam(team,false);
            }
        }
        else{
            console.log(`Error: ${response.statusText}`, team);
        }
    }
    // EVENTOS DEL CONTROLADOR
    // Evento que contiene los primeros 3 participantes 
    else if(event === "round-participants"){
        const {participants}=body;
        setRoundParticipants(participants);
    }
    else if(event === "teams-setup-complete"){
        console.log("Registro de equipos terminado")
        const {teams}=body;
        app.teams=teams;
        console.log(app)
    }

    // EVENTOS DE LA PRESENTACION
    else if(event=== "show-round"){
        const {round} = body,
              rounds = app.rounds
        rounds.forEach(rd => {
            if(rd.uuidv4 === round.uuidv4){
                initRound(rd);
            }
        });
    }
    else if(event === "show-answer"){
        const {round} = body,
              rounds=app.rounds
        rounds.forEach(rd => {
            if(rd.uuidv4 === round.uuidv4){
                rd.answers.forEach(answer => {
                    if(answer.id=== round.answer.id){
                        showAnswer(answer);
                    }
                });
            }
        });
    }
    else if(event === "strike"){
        const {strikes}=body;
        showStrikes(strikes)
    }
    else if(event === "show-team"){
        const {team}=body,
              teams = app.teams
        teams.forEach(tm => {
            if(team.uuidv4 === tm.uuidv4){
                showTeam(tm);
            }
        });
    }
    else if(event === "winner-round"){
        const {team}=body,
              teams = app.teams
        teams.forEach((tm,index) => {
            if(team.uuidv4 === tm.uuidv4){
                app.teams[index]=team;
                updateScoreTeam(team);
            }
        });
    }
    else if(event === "tutu-sound"){
        playTutuSound()
    }
    else if(event === "enable-buttons"){
        const {round}=body,
                rounds=app.rounds;
        rounds.forEach(rd => {
            if(round.uuidv4 === rd.uuidv4){
                showQuestion(rd)
            }
        });
        const $led=d.querySelector(".led");
        $led.classList.remove("led-off");
        $led.classList.add("led-on");
    }
    else if(event === "win-game"){
        const {teams}=body;
        winGame(teams);
    }
    else if(event === "button-pressed"){
        playButtonPressed();
    }


};


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
    app.getAll();
    //app.getTeams();
    //await sleep(200);
    //app.getRounds();
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
const getReadyState=function(){
    return connection.readyState
}
export {
    getReadyState,
    connectWebSocket,
    sendWebSocketMessage
}