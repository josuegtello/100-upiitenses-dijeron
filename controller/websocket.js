import uuidv4 from "../middlewares/uuidv4.js";
import { model as round } from "../models/round.js";
import { model as team } from "../models/team.js"


const clients=new Map();    // Todos los clientes WebSocket
const controller=new Map();
const presentation=new Map();
const iot=new Map();

const addClient=function(ws,metadata){
    clients.set(ws,{ metadata: metadata });
}

const onMessage=async function(ws,data){
    const {event,body}=data;
    // Asignamos el rol al
    if(event === "set-rol"){
        console.log("Asignandor rol a cliente WebSocket");
        const rol=body.rol,
              client=clients.get(ws),
              {metadata}=client;
        if(rol === "controller"){
            controller.set(ws,metadata);
        }
        else if(rol === "presentation"){
            presentation.set(ws,metadata)
        }
        else if(rol === "iot-device"){
            iot.set(ws,metadata)
        }
        const callback={
            event:"websocket-connected",
            body:{
                ws_id:metadata.ws_id
            }
        }
        ws.send(JSON.stringify(callback));
    }
    // EVENTOS DE LAS RONDAS
    else if(event === "get-rounds"){
        console.log("Mandando rondas al cliente")
        const data=await round.getAll(),
              rounds=data.map(round =>{
                  const {_id,id,question,answers}=round
                  return{
                      uuidv4:_id.toString(),
                      id,
                      question,
                      answers
                  }
              })
        const callback={
            event:"rounds-obtained",
            body:{
                rounds
            }
        }
        ws.send(JSON.stringify(callback));
    }
    // EVENTOS DE LOS EQUIPOS
    else if(event === "get-teams"){
        console.log("Mandando equipos a cliente")
        const data=await team.getAll(),
              teams=data.map(team =>{
                  const {_id,id,name,score}=team
                  return{
                      uuidv4:_id.toString(),
                      id,
                      name,
                      score
                  }
              })
        const callback={
            event:"teams-obtained",
            body:{
                teams
            }
        }
        ws.send(JSON.stringify(callback));
    }
    else if(event === "teams-setup-complete"){
        const data=await team.getAll(),
              teams=data.map(team =>{
                  const {_id,id,name,score}=team
                  return{
                      uuidv4:_id.toString(),
                      id,
                      name,
                      score
                  }
              }),
              callback={
                event:"teams-setup-complete",
                body:{
                    teams
                }
              }
        // Le mando al controlador que el registro ha terminado
        controller.forEach((metadata,client) => {
                client.send(JSON.stringify(callback));
        });
    }
    else if(event === "update-team"){
        const {team:tm}=body
        console.log("Actualizando equipo",tm)
        const response = await team.update(tm),
              dataUpdated = await team.getOne(tm.uuidv4),
              teamUpdated={
                uuidv4:dataUpdated._id.toString(),
                id:dataUpdated.id,
                name:dataUpdated.name,
                score:dataUpdated.score
              }
        const callback ={
            event:"team-updated",
            body:{
                response,
                team:teamUpdated
            }
        }
        ws.send(JSON.stringify(callback));
    }

    else if(event === "get-all"){
        console.log("Mandando equipo y rondas a cliente")
        const data1=await team.getAll(),
              teams=data1.map(team =>{
                  const {_id,id,name,score}=team
                  return{
                      uuidv4:_id.toString(),
                      id,
                      name,
                      score
                  }
              }),
              data2=await round.getAll(),
              rounds=data2.map(round =>{
                  const {_id,id,question,answers}=round
                  return{
                      uuidv4:_id.toString(),
                      id,
                      question,
                      answers
                  }
              })
        const callback={
            event:"all-obtained",
            body:{
                teams,
                rounds
            }
        }
        ws.send(JSON.stringify(callback));
    }
    //EVENTOS DEL TABLERO
    // ACTUALIZO GANADOR
    else if(event === "winner-round"){
        const {team:tm}=body,
              dataToUpdate=await team.getOne(tm.uuidv4),
              teamToUpdate={
                uuidv4:dataToUpdate._id.toString(),
                id:dataToUpdate.id,
                name:dataToUpdate.name,
                score:dataToUpdate.score
              }
        teamToUpdate.score=teamToUpdate.score+tm.current_score;
        const response= await team.update(teamToUpdate),
              callback1={
                event:"team-updated",
                body:{
                    response,
                    team:teamToUpdate
                }
              },
              callback2={
                event:"winner-round",
                body:{
                    team:teamToUpdate
                }
              }
        // LO MANDO TANTO AL CONTROLADOR QUE SI SE ACTUALIZO LA INFORMACION
        // mensaje controlador
        ws.send(JSON.stringify(callback1))
        // Mensaje a la presentacion
        presentation.forEach((metadata,client) => {
                client.send(JSON.stringify(callback2));
        });

    }
    // ACTUALIZA EL NUMERO DE STRIKES EN LA PANTALLA
    else if(event === "strike"){
        const callback={event,body}
        // Mensaje a la presentacion
        presentation.forEach((metadata,client) => {
                client.send(JSON.stringify(callback));
        });
    }
    // FIN DEL JUEGO, MOSTRAR EQUIPOS Y PUNTAJE
    else if(event === "win-game"){
        const data=await team.getAll(),
              teams=data.map(team =>{
                  const {_id,id,name,score}=team
                  return{
                      uuidv4:_id.toString(),
                      id,
                      name,
                      score
                  }
              })
        const organizedTeams = [...teams].sort((a, b) => b.score - a.score);
        const callback={
            event,
            body:{
                teams:organizedTeams
            }
        }
        // Mensaje a la presentacion
        presentation.forEach((metadata,client) => {
                client.send(JSON.stringify(callback));
        });
    }
    // MOSTRAR RESPUESTA 
    else if(event === "show-answer"){
        const callback={
            event,
            body
        }
        // Mensaje a la presentacion
        presentation.forEach((metadata,client) => {
                client.send(JSON.stringify(callback));
        });
    }
    // INICIO DE LA RONDA
    else if(event === "show-round"){
        const callback={
            event,
            body
        }
        // Mensaje a la presentacion
        presentation.forEach((metadata,client) => {
                client.send(JSON.stringify(callback));
        });
        // Mensaje a los dispositivos IoT - DESABILITAR BOTONES
        iot.forEach((metadata,client) => {
                client.send(JSON.stringify(callback));
        });
    }
    // SONIDO DE RESPUESTA INVALIDA
    else if(event === "tutu-sound"){
        const callback={
            event,
            body
        }
        // Mensaje a la presentacion
        presentation.forEach((metadata,client) => {
                client.send(JSON.stringify(callback));
        });
    }
    // MOSTRAMOS EL EQUIPO QUE ESTA JUGANDO ACTUALMENTE EN LA RONDA
    else if(event === "show-team"){
        const callback={
            event,
            body
        }
        // Mensaje a la presentacion
        presentation.forEach((metadata,client) => {
                client.send(JSON.stringify(callback));
        });
    }
    // HABILITA LOS BOTONES PARA QUE LOS PUEDA PRESIONAR
    else if(event === "enable-buttons"){
        const callback={
            event,
            body
        }
        // Mensaje a la presentacion
        presentation.forEach((metadata,client) => {
                client.send(JSON.stringify(callback));
        });
        // Mensaje a dispositivos IoT
        iot.forEach((metadata,client) => {
                client.send(JSON.stringify(callback));
        });
    }

    //COMANDOS DE PRUEBA
    // -CONTROLADOR
    else if(event === "test-participants"){
        const idTeams=[
            {
                uuidv4: "68f560760b2c1734c1eec4a9"
            },
            {
                uuidv4: "68f5607f0b2c1734c1eec4aa"
            },
            {
                uuidv4: "68f560870b2c1734c1eec4ab"
            }
        ]
        const callback={
            event:"round-participants",
            body:{
                participants:idTeams
            }
        }
        console.log(callback)
        ws.send(JSON.stringify(callback));
    }

}

const removeClient=function(ws){
    try {
        clients.delete(ws)
        if(presentation.get(ws)) presentation.delete(ws)
        else if(controller.get(ws)) controller.delete(ws)
        else if(iot.get(ws)) iot.delete(ws)
    } catch (err) {
        console.log("Error eliminando cliente WebSocket",err)
    }
}

const socket={
    addClient,
    onMessage,
    removeClient
}

export default socket