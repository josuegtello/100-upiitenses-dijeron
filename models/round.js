import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    id:{
        type:Number,
        default:0,
    },
    question:{
        type:String,
        default:"",
    },
    answers:{
        type:Array,
        default:[],
    }
})

const Round=mongoose.model("rounds",Schema);

// Obtenemos todas las rondas
const getAll=async function () {
    // Hacemos un try catch si hay un error
    try {
        const callback= await Round.find();
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

// Obtenemos un usuario
const getOne=async function(id) {
    try {
        // Hacemos la query a la DB
        const callback=await Round.findById(id);
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


// TODO: ACTUALIZAR LA RONDA - EN UN FUTURO


// TODO: ELIMINAR LA RONDA - EN UN FUTURO



export const model={
    getAll,
    getOne
}

