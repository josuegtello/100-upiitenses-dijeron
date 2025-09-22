// PACKAGES DEL PROYECTO
import http from "http";
import { fileURLToPath } from 'url';
import express from "express";
import { WebSocketServer } from 'ws';
import path from "path";
import morgan from "morgan";
import getLocalIpAddress from "./middlewares/ip.js";

// Definicion de __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IP_ADRESS = getLocalIpAddress();
console.log("Dirección IP local:", IP_ADRESS);

// DEFINICION DEL SERVIDOR WEBSOCKET
const websocket = new WebSocketServer({ port: 8083 });

websocket.on("connection", (ws, req) => {
    // Nuevo cliente WebSocket conectado
    
    // Manejador para mensajes tipo "pong" (respuesta a un "ping" enviado por el servidor)
    ws.on("pong", () => {
        
    });

    // Manejador de errores en la conexión WebSocket del cliente
    ws.on("error", (err) => {
        console.error("WebSocket Client Error:", err);
    });

    // Manejador cuando el cliente se desconecta
    ws.on("close", () => {
        console.log("WebSocket Client Disconnected");
    });

    // Manejador para recibir mensajes enviados por el cliente
    ws.on("message", (msg) => {
        console.log("Mensaje recibido:", msg.toString());
    });
});

// Manejador de errores globales del servidor WebSocket
websocket.on("error", (err) => {
    console.error(`WebSocket Server Error: ${err}`);
});

// DEFINICION DE LA APP EXPRESS
const app = express();
const httpServer = http.createServer(app);
//Definicion del puerto
const port = 80;

// Middlewares

// Registra las solicitudes HTTP en la consola (modo "dev": método, ruta, estado, tiempo de respuesta)
app.use(morgan("dev"));

// Configuracion de la app
// Configuración de la carpeta pública para servir archivos estáticos (HTML, CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Middleware para parsear solicitudes con cuerpo en formato JSON
app.use(express.json());

// Middleware para parsear datos codificados en URL (por ejemplo, formularios HTML)
app.use(express.urlencoded({ extended: false }));

// Definición de rutas específicas que deben regresar siempre el archivo index.html (SPA: Single Page Application)
const routes = ["/","/home","/controller", "/presentation"];
app.get(routes, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Definición de las rutas principales de la aplicación


// Middleware para manejar rutas no definidas: responde con un error 404
app.use((req, res) => {
    res.status(404);
    // TODO: Devolver una respuesta en formato JSON en lugar de texto plano
    res.send("Resource Not Found");
});



httpServer.listen(port, () => {
    console.log(`Aplicación funcionando en http://${IP_ADRESS}:${port}/home`);
});