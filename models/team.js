import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    id:{
        type:Number,
        default:0,
    },
    name:{
        type:String,
        defual:"",
    },
    score:{
        type:Number,
        default:0,
    }
})

const Team=mongoose.model("teams",Schema);

// Obtenemos todos los equipos
const getAll=async function () {
    // Hacemos un try catch si hay un error
    try {
        const callback= await Team.find();
        //console.log(callback)
        return callback;
    } catch (err) {
        // Lanzamos error
        throw {
            status:500,
            statusText:"El servidor no pudo carar las rondas"
        }
    }
}

// Obtenemos un equipo
const getOne=async function(id) {
    try {
        // Hacemos la query a la DB
        const callback=await Team.findById(id);
        //console.log(callback)
        console.log(callback)
        return callback;
    } catch (err) {
        // Lanzamos error
        throw {
            status:500,
            statusText:`El servidor no pudo obtener la ronda con id:${id}` 
        }
    }
}

// TODO: CREACION DE REGISTRO - EN UN FUTURO


//  Actualizamos un equipo
const update=async function (team) {
    try {
        const {id,name,score}=team
        const data={}
        if(name !== null) data.name=name;
        if(score != null) data.score=score; 

        // Actualizamos el registro
        await Team.findByIdAndUpdate(id,data);

        return {
            status:200,
            statusText:"Equipo actualizado exitosamente"
        }

    } catch (err) {
        // Lanzamos error
        throw {
            status:500,
            statusText:`El servidor no pudo actualizar al equipo con id:${team.id}` 
        }
    }
}

// TODO: ELIMINAR LA RONDA - EN UN FUTURO

export const model={
    getAll,
    getOne,
    update
} 




