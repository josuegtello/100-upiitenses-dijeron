import app from "./middlewares/app.js";

const d=document,
        body=d.body;
// FUNCIONE SY TODO
/*
app.teams.forEach(team => {
    if(team.number==1){

    }
});
app.updateTeams({
    id:app.teams[1].id,
    score:96
})
*/
const mouseOver=function(e){
    console.log("mouse sobre header")
    console.log(e.target)
}



function initController(){
    console.log("Iniciando eventos del controlador")
    const $h1=d.querySelector('.h1-controller');
    $h1.addEventListener("mouseover",mouseOver)



    body.addEventListener("click",(e)=>{
        const $target=e.target;
        if($target.matches(".h1-controller")){
            console.log("click a header")
        }

    })
}

export default initController

