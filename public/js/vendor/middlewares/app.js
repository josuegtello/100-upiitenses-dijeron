import fetchRequest from "./fetch_request.js"
import {MENU} from "./constants.js"
import router from "./router.js";
const   d=document,
        w=window,
    body = d.body

class App {
    constructor(){
        this.teams=[
            
        ];
        this.rounds=[
            {
                id:1,
                question:"",
                answers:[
                    {
                        id:1,
                        score:90,
                        answer:""
                    }
                ]
            }
        ]
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
}
const app= new App();
export default app;