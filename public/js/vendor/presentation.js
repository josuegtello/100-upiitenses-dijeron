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
const showQuestion=async function(){
    const question=board.actualQuestion,
          $questionInput=d.querySelector(".question"),
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
const updateScoreTeam=function(team){
    const {id,score}=team,
          audio=new Audio("../../assets/audio/puntos.mp3"),
          $team=d.querySelector(`[data-team="${id}"]`);
    $team.value=score
    audio.play()
}
const showTeam = async function(){
    const team=board.actualTeam,
          $teamInput=d.querySelector(".team"),
          interval=1000/team.length
    for (let i = 0; i < team.length; i++) {
        let txtAnimation="";
        for (let j = 0; j <= i; j++) {
            txtAnimation=txtAnimation+team[j];
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
    let {id,text,points}=answer
    text=`${id}.${text}`
    const audio=new Audio("../../assets/audio/correcto_respuesta.mp3"),
          lenght=text.length,
          interval=1000/lenght,
          $container=d.querySelector(`[data-answer="${id}"]`),
          $answer = $container.querySelector(".answer"),
          $score = $container.querySelector(".score-answer");
    console.log(id,text,points);
    audio.play();
    for (let i = 0; i < lenght; i++) {
        let txtAnimation="";
        for (let j = 0; j <= i; j++) {
            txtAnimation=txtAnimation+text[j];
        }
        $answer.value=txtAnimation;
        await sleep(interval);
    }
    $score.value=points;
    board.actualScore=board.actualScore+points;
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
    const $questionInput=d.querySelector(".question")
    $questionInput.value=`RONDA ${id}`
    audio.play()
}
const addStrike=async function(){
    const $container=d.querySelector(".strikes-container"),
          audio=new Audio("../../assets/audio/incorrecto.mp3");
    $container.classList.remove("opacity-0")
    if(board.actualStrikes+1<=3){
        board.actualStrikes=board.actualStrikes+1
        for (let i = 1; i <= board.actualStrikes; i++) {
            const $strike=d.querySelector(`[data-strike="${i}"]`)
            $strike.classList.remove("display-none");

        }
    }
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
    addStrike,
    clearStrike,
    clearStrikes,
    initRound
}