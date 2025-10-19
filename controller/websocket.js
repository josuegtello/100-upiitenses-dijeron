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



    //COMANDOS DE PRUEBA
    // -CONTROLADOR
    else if(event === "test-participants"){
        const idTeams=[
            {
                uuidv4:"68f42ef5a4e5fe4f00eec4a9"
            },
            {
                uuidv4:"68f42f3ea4e5fe4f00eec4ae"
            },
            {
                uuidv4:"68f42fa4a4e5fe4f00eec4b0"
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

}

const socket={
    addClient,
    onMessage,
    removeClient
}

export default socket