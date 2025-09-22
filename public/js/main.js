import app from "./vendor/middlewares/app.js";
import router from "./vendor/middlewares/router.js";

const   d=document,
        w=window,
        body=d.body,
        url=location.href;

d.addEventListener("DOMContentLoaded", async(e) => {
    await app.initContent()
    body.addEventListener("click", (e) => {
        const $target=e.target;
        if($target.matches("[data-route]")){
            router($target,e);
        }
    })
})