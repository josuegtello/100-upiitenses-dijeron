import fetchRequest from "./fetch_request.js"
import {MENU} from "./constants.js"
import router from "./router.js";
const   d=document,
        w=window,
    body = d.body

class App {
    constructor(){
        this.teams = [];
        this.rounds = [
            {
                id: 1,
                pregunta: "pregunta 1",
                score: 0,
                respuestas: [
                    { id: 1, texto: "Respuesta 101", score: 65 },
                    { id: 2, texto: "Respuesta 201", score: 60 },
                    { id: 3, texto: "Respuesta 301", score: 58 },
                    { id: 4, texto: "Respuesta 401", score: 44 },
                    { id: 5, texto: "Respuesta 501", score: 32 },
                ],
            },
            {
                id: 2,
                pregunta: "pregunta 2",
                score: 0,
                respuestas: [
                    { id: 1, texto: "Respuesta 102", score: 67 },
                    { id: 2, texto: "Respuesta 202", score: 62 },
                    { id: 3, texto: "Respuesta 302", score: 59 },
                    { id: 4, texto: "Respuesta 402", score: 46 },
                    { id: 5, texto: "Respuesta 502", score: 35 },
                ],
            },
            {
                id: 3,
                pregunta: "pregunta 3",
                score: 0,
                respuestas: [
                    { id: 1, texto: "Respuesta 103", score: 70 },
                    { id: 2, texto: "Respuesta 203", score: 65 },
                    { id: 3, texto: "Respuesta 303", score: 60 },
                    { id: 4, texto: "Respuesta 403", score: 50 },
                    { id: 5, texto: "Respuesta 503", score: 38 },
                ],
            },
            {
                id: 4,
                pregunta: "pregunta 4",
                score: 0,
                respuestas: [
                    { id: 1, texto: "Respuesta 104", score: 72 },
                    { id: 2, texto: "Respuesta 204", score: 68 },
                    { id: 3, texto: "Respuesta 304", score: 63 },
                    { id: 4, texto: "Respuesta 404", score: 52 },
                    { id: 5, texto: "Respuesta 504", score: 40 },
                ],
            },
            {
                id: 5,
                pregunta: "pregunta 5",
                score: 0,
                respuestas: [
                    { id: 1, texto: "Respuesta 105", score: 75 },
                    { id: 2, texto: "Respuesta 205", score: 70 },
                    { id: 3, texto: "Respuesta 305", score: 65 },
                    { id: 4, texto: "Respuesta 405", score: 55 },
                    { id: 5, texto: "Respuesta 505", score: 42 },
                ],
            },
            {
                id: 6,
                pregunta: "pregunta 6",
                score: 0,
                respuestas: [
                    { id: 1, texto: "Respuesta 106", score: 77 },
                    { id: 2, texto: "Respuesta 206", score: 72 },
                    { id: 3, texto: "Respuesta 306", score: 68 },
                    { id: 4, texto: "Respuesta 406", score: 57 },
                    { id: 5, texto: "Respuesta 506", score: 45 },
                ],
            },
            {
                id: 7,
                pregunta: "pregunta 7",
                score: 0,
                respuestas: [
                    { id: 1, texto: "Respuesta 107", score: 80 },
                    { id: 2, texto: "Respuesta 207", score: 74 },
                    { id: 3, texto: "Respuesta 307", score: 70 },
                    { id: 4, texto: "Respuesta 407", score: 60 },
                    { id: 5, texto: "Respuesta 507", score: 48 },
                ],
            },
            {
                id: 8,
                pregunta: "pregunta 8",
                score: 0,
                respuestas: [
                    { id: 1, texto: "Respuesta 108", score: 82 },
                    { id: 2, texto: "Respuesta 208", score: 76 },
                    { id: 3, texto: "Respuesta 308", score: 72 },
                    { id: 4, texto: "Respuesta 408", score: 62 },
                    { id: 5, texto: "Respuesta 508", score: 50 },
                ],
            },
            {
                id: 9,
                pregunta: "pregunta 9",
                score: 0,
                respuestas: [
                    { id: 1, texto: "Respuesta 109", score: 85 },
                    { id: 2, texto: "Respuesta 209", score: 78 },
                    { id: 3, texto: "Respuesta 309", score: 74 },
                    { id: 4, texto: "Respuesta 409", score: 64 },
                    { id: 5, texto: "Respuesta 509", score: 52 },
                ],
            },
            {
                id: 10,
                pregunta: "pregunta 10",
                score: 0,
                respuestas: [
                    { id: 1, texto: "Respuesta 110", score: 88 },
                    { id: 2, texto: "Respuesta 210", score: 80 },
                    { id: 3, texto: "Respuesta 310", score: 76 },
                    { id: 4, texto: "Respuesta 410", score: 66 },
                    { id: 5, texto: "Respuesta 510", score: 55 },
                ],
            },
        ];




        this.ws_id=null;
        this.rol=null;
    }
    //Metodo que obtendra todo el contenido necesario para la app
    async initContent(){
        let url=null;
        //TODO: Antes de hacer la peticion ver que ruta tiene ahorita
        if (sessionStorage.getItem("redirect")){
            const redirect=JSON.parse(sessionStorage.getItem('redirect')),
                $main = d.querySelector('main'),
                {route,href} = redirect;   
            $main.setAttribute('data-html', href);
            url=href
        }else{
            url=MENU
        }
        const $a = d.createElement('a');
	    $a.setAttribute('href', url);
	    $a.setAttribute('data-route', 'replace-main');

	    await router($a, null);
        return;
    }
    //Metodo que obtendra la informacion actualizada de los clientes asi como el WebSocket ID de nuestros botones
    async getTeams(){

    }


    async setRounds() {


    }


    getRounds() {
        return this.rounds;
    }

}
const app= new App();
export default app;