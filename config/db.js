import mongoose from "mongoose";


const connectDB= async()=>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/upiitenses-dijeron");
        console.log("Conexion exitosa a MongoDB");
    } catch (err) {
        console.error("Error de conexion a MongoDB", err);
        process.exit(1);//cerramos la aplicacion de node
    }
}

export default connectDB;

