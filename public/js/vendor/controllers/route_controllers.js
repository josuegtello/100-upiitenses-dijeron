
import initController from "../controller.js"


const controller = (redirect) => {
    const {href,route} = redirect

    if (href.includes("controller")){
        redirect.route="controller"
        //TODO: Colocar los controladores
        initController();
    }
    else if (href.includes("presentation")){
        redirect.route="presentation"
        // TODO: Colocar los controladores

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