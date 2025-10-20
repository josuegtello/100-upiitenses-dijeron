import { sendWebSocketMessage } from "./controllers/websocket.js";
import app from "./middlewares/app.js";
import sleep from "./middlewares/sleep.js";

const d=document,
      body=d.body,
      board={
        id:0,
        actualScore:0,
        actualQuestion:"1.QUIEN ES MAS GUAPO",
        actualTeam:"E1. ENANITOS VERDES",
        actualStrikes:0
      }
const updateActualScore=function(){
    const $score=d.querySelector(".points")
    $score.value=board.actualScore
}
const showQuestion=async function(round){
    const question=`${round.id}.${round.question.toUpperCase()}`
    console.log(question)
    const $questionInput=d.querySelector(".question"),
          interval=1000/question.length
    for (let i = 0; i < question.length; i++) {
        let txtAnimation="";
        for (let j = 0; j <= i; j++) {
            txtAnimation=txtAnimation+question[j];
        }
        $questionInput.value=txtAnimation;
        await sleep(interval)
    }
}
const clearQuestion=function(){
    const $questionInput=d.querySelector(".question")
    $questionInput.value=""
}
const updateScoreTeam=function(team,play=true){
    const {id,score}=team,
          audio=new Audio("../../assets/audio/puntos.mp3"),
          $team=d.querySelector(`[data-team="${id}"]`);
    $team.value=score
    if(play) audio.play()
}
const showTeam = async function(team){
    const name=`E${team.id}.${team.name}`
    const $teamInput=d.querySelector(".team"),
          interval=1000/name.length
    for (let i = 0; i < name.length; i++) {
        let txtAnimation="";
        for (let j = 0; j <= i; j++) {
            txtAnimation=txtAnimation+name[j];
        }
        $teamInput.value=txtAnimation;
        await sleep(interval)
    }
}
const clearTeam=function(){
    const $teamInput=d.querySelector(".team")
    $teamInput.value=""
}
const showAnswer = async function(answer){
    let {id,text,score}=answer
    text=`${id}.${text}`
    const audio=new Audio("../../assets/audio/correcto_respuesta.mp3"),
          lenght=text.length,
          interval=1000/lenght,
          $container=d.querySelector(`[data-answer="${id}"]`),
          $answer = $container.querySelector(".answer"),
          $score = $container.querySelector(".score-answer");
    console.log(id,text,score);
    audio.play();
    for (let i = 0; i < lenght; i++) {
        let txtAnimation="";
        for (let j = 0; j <= i; j++) {
            txtAnimation=txtAnimation+text[j];
        }
        $answer.value=txtAnimation;
        await sleep(interval);
    }
    $score.value=score;
    board.actualScore=board.actualScore+score;
    updateActualScore()
}
const clearAnswer = async function(answer){
    let {id}=answer
    const $container=d.querySelector(`[data-answer="${id}"]`);
    const $answer = $container.querySelector(".answer"),
        $score = $container.querySelector(".score-answer");
    $answer.value=""
    $score.value=""
    for (let i = 0; i < 15; i++) {
        let lines=""
        for (let j = 0; j <= i; j++) {
            lines=lines+"-"
        }
        $answer.value=lines
        await sleep(1000/15)
    }
    $score.value="--"
}
const initRound= function(round){
    const {question,id}=round,
          audio=new Audio("../../assets/audio/vamos_a_jugar.mp3");
    for (let i = 1; i <=10; i++) {
        clearAnswer({id:i})
    }
    board.actualScore=0;
    board.actualQuestion=question
    board.actualTeam="";
    board.id=id
    board.actualStrikes=0
    clearStrikes()
    clearQuestion()
    clearTeam()
    updateActualScore()
    const $questionInput=d.querySelector(".question"),
        $led=d.querySelector(".led");
    $led.classList.remove("led-on");
    $led.classList.add("led-off");
    $questionInput.value=`RONDA ${id}`
    audio.play()
}
const showStrikes=async function(strikes){
    const $container=d.querySelector(".strikes-container"),
          audio=new Audio("../../assets/audio/incorrecto.mp3"),
          $strikes=d.querySelectorAll(".strike")

    $strikes.forEach($strike => {
        $strike.classList.add(".display-none")
    });
    $container.classList.remove("opacity-0")
    $strikes.forEach(($strike,index) => {
        console.log(index+1,strikes)
        if(index+1<=strikes){
            $strike.classList.remove("display-none");
        }
    });
    audio.play()
    await sleep(2000)
    $container.classList.add('opacity-0')
}
const clearStrike=function(id){
    const $strike=d.querySelector(`[data-strike="${id}"]`)
    $strike.classList.add("display-none");
}
const clearStrikes=function(){
    for (let i = 1; i <= 3; i++) {
        const $strike=d.querySelector(`[data-strike="${i}"]`)
        $strike.classList.add("display-none");            
    }
}
const addTeam=function(){
    const id=Number(d.querySelector("form input[name='team-number']").value),
          name=d.querySelector("form input[name='team-name']").value,
          teams=app.teams;
    let uuidv4=null;
    teams.forEach(team => {
        if(team.id===id){
            uuidv4=team.uuidv4;
        }
    });
    const request={
        event:"update-team",
        body:{
            team:{
                uuidv4,
                id,
                name,
                score:null
            }
        }
    }
    sendWebSocketMessage(request);
    // Pasamos al siguiente equipo en automatico
    if (id+1 <= 8) d.querySelector("form input[name='team-number']").value=id+1;
    d.querySelector("form input[name='team-name']").value="";
}

            // 2. Función que lanza un "chorro" de confeti
        async function frame() {
            const duration = 120 * 1000; // 30 segundos
            const animationEnd = Date.now() + duration;

            // 3. Define el delay. Te recomiendo 100ms para empezar (no 5ms)
            const delay = 150; 
            await sleep(800);
            // 4. Creamos un bucle 'while' que se ejecuta
            //    mientras no se acabe el tiempo.
            while (Date.now() < animationEnd) {
                
                confetti({
                    particleCount: 5, // Mantenemos pocas partículas por chorro
                    angle: 90,        
                    spread: 80,       
                    origin: { 
                        x: Math.random(), 
                        y: 0              
                    },
                    colors: [
                        '#FF4500', 
                        '#FFD700', 
                        '#FFFFFF', 
                        '#00BFFF', 
                        '#32CD32'  
                    ], 
                    shapes: ['square', 'circle'],
                    scalar: 2,      
                    gravity: 0.3,     
                    ticks: 2000        
                });

                // 5. ¡La magia! Pausamos la ejecución por 'delay' ms
                await sleep(delay);
            }
        }
const winGame=async function(teams){
    const teamWinner=teams[0]
    const text=`GANADOR DEL JUEGO E${teamWinner.id}.${teamWinner.name} - SCORE:${teamWinner.score}`;
    const audio=new Audio("../../assets/audio/cumbia_ganadora.mp3");
    audio.play();
    audio.volume=0.5;
    // Configuración para un efecto de "caída" más realista
    frame();
    const $questionInput=d.querySelector(".question"),
          interval=2000/text.length
    for (let i = 0; i < text.length; i++) {
        let txtAnimation="";
        for (let j = 0; j <= i; j++) {
            txtAnimation=txtAnimation+text[j];
        }
        $questionInput.value=txtAnimation;
        await sleep(interval)
    }
    const text2="GRACIAS POR JUGAR"
    const $teamInput=d.querySelector(".team"),
          interval2=1500/text2.length
    for (let i = 0; i < text2.length; i++) {
        let txtAnimation="";
        for (let j = 0; j <= i; j++) {
            txtAnimation=txtAnimation+text2[j];
        }
        $teamInput.value=txtAnimation;
        await sleep(interval2)
    }

}

const playTutuSound=function(){
    const audio=new Audio("../../assets/audio/tutu.mp3");
    audio.play();
}
const playButtonPressed=function(){
    const audio=new Audio("../../assets/audio/boton_presionado.mp3");
    audio.play();
}

const initPresentation=async function(){

    body.addEventListener("click",async (e)=>{
        const $target=e.target
        console.log($target)
        if($target.matches("input[name='rules']")){
            const $rules=d.querySelector(".rules")
            $rules.classList.add("opacity-0");
            await sleep(1000);
            $rules.classList.add("display-none")
        }
        //Evento para agregar usuarios
        else if($target.matches("input[name='add-team']")){
            console.log("Agregar equipo")
            addTeam()
        }
        else if($target.matches("input[name='finish']")){
            const $questionary=d.querySelector(".questionary")
            $questionary.classList.add("opacity-0","pointer-events-none")
            sendWebSocketMessage({
                event:"teams-setup-complete",
                body:null
            })
        }
    })

    // INPUT EN MAYUSCULAS
    const $inputTeamName=d.querySelector("form input[name='team-name']")
    $inputTeamName.addEventListener("input", (e)=>{
        e.stopPropagation()
        e.target.value=e.target.value.toUpperCase();
    })
    
}


export {
    initPresentation,
    updateActualScore,
    showQuestion,
    clearQuestion,
    updateScoreTeam,
    showTeam,
    clearTeam,
    showAnswer,
    clearAnswer,
    showStrikes,
    clearStrike,
    clearStrikes,
    initRound,
    playTutuSound,
    winGame,
    playButtonPressed
}