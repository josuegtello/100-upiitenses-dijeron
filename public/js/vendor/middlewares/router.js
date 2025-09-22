import fetchRequest from "./fetch_request.js";
import controller from "../controllers/route_controllers.js";
import { MENU, CONTROLLER,PRESENTATION } from "./constants.js";
const d=document

const router = async function ($el, e = null){
    let url = $el.getAttribute("href");
    const route = $el.getAttribute('data-route')
    const urlWeb=location.href;
    const redirect = JSON.parse(sessionStorage.getItem("redirect"));
    console.log(redirect,urlWeb)
    if(e) e.preventDefault();
    else{
        if (!redirect) console.log("No existe redirect")
        else if (!urlWeb.includes(redirect.route)){
            console.log("Ruta diferente a la de session storage, accediendo a otro contenido")
            const newUrl = new URL(urlWeb);
            const newRoute = newUrl.pathname.split("/").filter(Boolean).pop();

            console.log(newRoute)
            if(newRoute == undefined){
                url=MENU
            }
            else if (newRoute == "controller"){
                url=CONTROLLER
            }
            else if(newRoute == "presentation"){
                url=PRESENTATION
            }
        }
    }

    await fetchRequest({
        method:'GET',
        url:url,
        contentType:'text/html',
        body:null,
        credentials:'include',
        async success(response){
            if(response.ok){
                const redirect = {
                        route,
                        href:url
                      }
                if(route == "replace-main"){
                    const $main = d.querySelector('main'),
                          $html = await response.text()
                    $main.outerHTML = $html;
                }
                controller(redirect);
            }
            else{
                // TODO: Hacer el error 404
            }
        },
        async error(err){
            console.error(`Ocurrio un error en la obtencion de datos: ${err}`);
        }
    })
    return;
}
export default router