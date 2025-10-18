
import initController from "../controller.js"
import {initPresentation} from "../presentation.js"
import app from "../middlewares/app.js"
import { connectWebSocket } from "./websocket.js"

const controller = (redirect) => {
    const {href,route} = redirect

    if (href.includes("controller")){
        redirect.route="controller"
        // Colocar los controladores
        initController();
        app.rol="controller";
        connectWebSocket();
    }
    else if (href.includes("presentation")){
        redirect.route="presentation"
        // Colocar los controladores
        initPresentation();
        app.rol="presentation";
        connectWebSocket();

    }
    else if (href.includes("menu")){
        redirect.route="home"
    }
    // COMENTAR LA LINEA DE ABAJO SI ESTAN EN LIVE SERVER
    history.replaceState(null,'',redirect.route);

    sessionStorage.setItem('redirect',JSON.stringify(redirect))
    console.log(sessionStorage.getItem("redirect"))
}
export default controller