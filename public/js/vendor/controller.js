import app from "./middlewares/app.js";
import { sendWebSocketMessage, getReadyState } from "./controllers/websocket.js";
import sleep from "./middlewares/sleep.js";
//import uuidv4 from "../../../middlewares/uuidv4.js";

let teamsprepocesed = [];
let teamspostproceded = [];
let currentTeam = null;
let selecionDeEquipos = true;
let renderIndex = 0;
let contadorpreguntas = 0;
let currentQuestionIndex = 1;
let isRoundShown = false; // Track if show button has been clicked




async function setQuestion(newId) {
    document.getElementById("id_pregunta").textContent = newId;
    document.getElementById("pregunta").textContent = getPreguntaById(newId);

    currentRonda = setRonda(newId);
    isRoundShown = false; // Reset when question changes
    clearRespuestas(); // Clear answers until show is clicked
}



function getPreguntaById(id) {
    const ronda = rounds.find(r => r.id === id);
    return ronda ? ronda.question : null;
}

function setRonda(id) {
    return rounds.find(r => r.id === id);
}





const setRoundParticipants = function (participants) {

    participants.forEach(participant => {
        const teams = app.teams;
        teams.forEach(team => {

            if (participant.uuidv4 === team.uuidv4) {
                console.log(`participante encontrado ${team.name}`)
                const { uuidv4, id, name } = team
                teamsprepocesed.push({
                    uuidv4,
                    id,
                    name
                });
            }
        });
    });
    teamsprepocesed.forEach((team, index) => {
        teamspostproceded.push({
            ...team,
            id_local: index + 1,
            strikes: 0,
            current_score: 0,
        })
    });

    currentTeam = teamspostproceded.find((t) => t.id_local === 1);
    renderTeamById(currentTeam.id_local);
}



function updateWinner(team, score) {



    sendWebSocketMessage({
        event: "winner-round",
        body: {
            team: {

                uuidv4: team.uuidv4,
                current_score: score
            }
        }
    });
}

function nextquestion() {
    if (currentQuestionIndex < rounds.length) {
        currentQuestionIndex++;
        setQuestion(currentQuestionIndex);
        resetRound()

    }
}

function prevquestion() {
    if (currentQuestionIndex > 1) {
        currentQuestionIndex--;
        setQuestion(currentQuestionIndex);
        resetRound()

    }
}

function renderTeamById(_id_local) {
    const team = teamspostproceded.find((t) => t.id_local === _id_local);
    if (!team) return;

    const contenedorEquipo = document.querySelector(".contenedorequipo");
    contenedorEquipo.innerHTML = `
    <p>Equipo</p>
    <p>${team.id}</p>
    <p>: ${team.name}</p>
    
    `;

    sendWebSocketMessage({
        event: "show-team",
        body: {
            team: {
                uuidv4: team.uuidv4
            }
        }
    });
}

function startCountdown() {
    unableButton();
    setTimeout(() => {
        ableButton();
    }, 3000);
}

function unableButton() {
    wrongBtn.style.pointerEvents = 'none';
    wrongBtn.style.backgroundColor = '#8c8c8cff';
}

function ableButton() {
    wrongBtn.style.pointerEvents = 'auto';
    wrongBtn.style.backgroundColor = '#ff0000ff';
}

function disableButton(btn) {
    btn.classList.add('disabled');
}

function enableButton(btn) {
    btn.classList.remove('disabled');
}


function addStrikes() {
    if (!selecionDeEquipos) {

        const team1 = teamspostproceded[0];
        const team2 = teamspostproceded[1];
        const team3 = teamspostproceded[2];

        if (team1.strikes >= 3 && team2.strikes >= 1 && team3.strikes < 1) {
            team3.strikes++;
            sendWebSocketMessage({
                event: "strike",
                body: { strikes: team3.strikes }
            });
        }
        if (team1.strikes >= 3 && team2.strikes >= 1 && team3.strikes >= 1) {
            renderTeamById(team1.id_local);
            asignRondaScoreToFirst();
            rondaTerminated = true;
            resetRound();
            return;
        }
        if (team1.strikes >= 3 && team2.strikes < 1) {
            team2.strikes++;
            sendWebSocketMessage({
                event: "strike",
                body: { strikes: team2.strikes }
            });
        }
        if (team2.strikes >= 1 && team3.strikes < 1) {
            renderTeamById(team3.id_local);
        }

        if (team1.strikes < 3) {
            team1.strikes++;
            sendWebSocketMessage({
                event: "strike",
                body: { strikes: team1.strikes }
            });
        }
        if (team1.strikes >= 3 && team2.strikes < 1) {
            renderTeamById(team2.id_local);
        }
    } else {
        renderIndex++;
        renderTeamById(teamspostproceded[renderIndex].id_local);
        sendWebSocketMessage({
            event: "strike",
            body: { strikes: 1 }
        });
        if (renderIndex >= 2) {
            teamspostproceded.sort((a, b) => b.current_score - a.current_score);
            renderTeamById(teamspostproceded[0].id_local);
            selecionDeEquipos = false;
            return;
        }
    }
}

function addScore(id, elementToRemove) {
    const ans = currentRonda.answers.find(t => t.id === Number(id));
    currentRonda.score = (currentRonda.score || 0) + ans.score;

    if (elementToRemove && elementToRemove.parentNode) {
        elementToRemove.style.pointerEvents = 'none';
        elementToRemove.style.color = "#ff0080";
        elementToRemove.style.transition = 'opacity 1s ease-out';
        elementToRemove.style.opacity = '0';

        setTimeout(() => {
            elementToRemove.remove();
        }, 1000);
    }

    if (selecionDeEquipos) {
        teamspostproceded[renderIndex].current_score += ans.score;
        if (id === 1) {
            teamspostproceded.sort((a, b) => b.current_score - a.current_score);
            currentTeam = teamspostproceded[0];
            selecionDeEquipos = false;
            return;
        }
        renderIndex++;
        if (renderIndex >= 2) {
            teamspostproceded.sort((a, b) => b.current_score - a.current_score);
            renderTeamById(teamspostproceded[0].id_local);
            selecionDeEquipos = false;
            return;
        }
        currentTeam = teamspostproceded[renderIndex];
        renderTeamById(currentTeam.id_local);
    }
}

function asignRondaScoreToFirst() {

    updateWinner(teamspostproceded[0], currentRonda.score);
    rondaTerminated = true;

}

function automaticRondaTermination() {

    if (!selecionDeEquipos) {
        const team1 = teamspostproceded[0];
        const team2 = teamspostproceded[1];
        const team3 = teamspostproceded[2];

        if (team2.strikes >= 1 && team3.strikes < 1) {

            updateWinner(teamspostproceded[2], currentRonda.score);
            rondaTerminated = true;
            resetRound();
        }

        if (team1.strikes >= 3 && team2.strikes < 1) {

            updateWinner(teamspostproceded[1], currentRonda.score);
            rondaTerminated = true;
            resetRound();
        }
    }

    if ((teamspostproceded[0].strikes < 3) && (contadorpreguntas >= currentRonda.answers.length) && (!selecionDeEquipos)) {

        updateWinner(teamspostproceded[0], currentRonda.score);
        rondaTerminated = true;
        resetRound();
    }
}

function terminateGame() {
    sendWebSocketMessage({
        event: "win-game",
        body: null
    });
}

function hardRoundReset() {
    console.log("Hard-Round-resetting...");

    // Reset all team strikes
    teamspostproceded.forEach(team => {
        team.strikes = 0;
        team.current_score = 0;
    });

    // Reset round state (but NOT contadorpreguntas - keep answered questions)
    rondaTerminated = false;
    if (currentRonda) {
        currentRonda.score = 0;
    }

    // Reset team selection state
    selecionDeEquipos = true;
    renderIndex = 0;
    currentTeam = null;

    contadorpreguntas = 0;
    isRoundShown = false; // Reset show state

    clearRespuestas(); // Clear answers

    // Disable buttons at the beginning
    const countdownBtn = document.getElementById("countdownBtn");
    const wrongBtn = document.getElementById("wrongBtn");
    const TutuownBtn = document.getElementById("TutuownBtn");
    const enableBtn = document.getElementById("enableBtn");

    if (countdownBtn) disableButton(countdownBtn);
    if (wrongBtn) disableButton(wrongBtn);
    if (TutuownBtn) disableButton(TutuownBtn);
    if (enableBtn) disableButton(enableBtn);

}

function resetRound() {
    console.log("Resetting round...");

    // Reset all team strikes
    teamspostproceded.forEach(team => {
        team.strikes = 0;
        team.current_score = 0;
    });

    teamsprepocesed = [];
    teamspostproceded = [];

    // Reset round state (but NOT contadorpreguntas - keep answered questions)
    rondaTerminated = false;
    if (currentRonda) {
        currentRonda.score = 0;
    }
    currentRonda = null;

    // Reset team selection state
    selecionDeEquipos = true;
    renderIndex = 0;
    currentTeam = null;

    contadorpreguntas = 0;
    isRoundShown = false; // Reset show state

    // Disable buttons at the beginning
    const countdownBtn = document.getElementById("countdownBtn");
    const wrongBtn = document.getElementById("wrongBtn");
    const TutuownBtn = document.getElementById("TutuownBtn");
    const enableBtn = document.getElementById("enableBtn");

    if (countdownBtn) disableButton(countdownBtn);
    if (wrongBtn) disableButton(wrongBtn);
    if (TutuownBtn) disableButton(TutuownBtn);
    if (enableBtn) disableButton(enableBtn);

    console.log("Round reset complete", teamspostproceded);
}

function clearRespuestas() {
    const contenedor = document.querySelector(".contendorespuestas");
    contenedor.innerHTML = '';
}

function renderRespuestas() {
    // Only render if show button has been clicked
    if (!isRoundShown) {
        return;
    }

    const contenedor = document.querySelector(".contendorespuestas");

    // Clear existing answers efficiently
    contenedor.innerHTML = '';

    // Create answer elements using DocumentFragment for better performance
    const fragment = document.createDocumentFragment();

    if (currentRonda && currentRonda.answers) {
        currentRonda.answers.forEach((answer) => {
            const p = document.createElement("p");
            p.textContent = answer.text;
            p.dataset.answerId = answer.id;

            p.addEventListener("click", (event) => {
                if (!rondaTerminated) {
                    addScore(answer.id, event.currentTarget);
                    contadorpreguntas++;

                }

                sendWebSocketMessage({
                    event: "show-answer",
                    body: {
                        round: {
                            uuidv4: currentRonda.uuidv4,
                            answer: {
                                id: answer.id
                            }
                        }
                    }
                });
                automaticRondaTermination();
            });

            fragment.appendChild(p);
        });
    }

    contenedor.appendChild(fragment);
}

let rondaTerminated = false;
let rounds = [];
let currentRonda = null;
let wrongBtn;

async function initController() {
    while (app.rounds.length === 0) await sleep(400);
    rounds = app.rounds
    const leftquestionBtn = document.getElementById("leftquestionBtn");
    const rightquestionshowBtn = document.getElementById("rightquestionshowBtn");
    const showBtn = document.getElementById("showBtn");
    const countdownBtn = document.getElementById("countdownBtn");
    const WinBtn = document.getElementById("WinBtn");
    const TutuownBtn = document.getElementById("TutuownBtn");
    const resetBtn = document.getElementById("resetBtn");
    wrongBtn = document.getElementById("wrongBtn");
    const enableBtn = document.getElementById("enableBtn");
    const hardResetBtn = document.getElementById("hardResetBtn");
    let pressCount = 0;

    wrongBtn.addEventListener("click", addStrikes);
    setQuestion(currentQuestionIndex);

    leftquestionBtn.addEventListener("click", prevquestion);
    rightquestionshowBtn.addEventListener("click", nextquestion);

    showBtn.addEventListener("click", () => {
        enableButton(enableBtn);
        isRoundShown = true;
        renderRespuestas(); 
        sendWebSocketMessage({
            event: "show-round",
            body: { round: { uuidv4: currentRonda.uuidv4 } }
        });
    });

    countdownBtn.addEventListener("click", startCountdown);
    WinBtn.addEventListener("click", terminateGame);

    TutuownBtn.addEventListener("click", () => {
        sendWebSocketMessage({
            event: "tutu-sound",
            body: null
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener("click", () => {

            pressCount++;
            document.documentElement.style.setProperty("--darkcolor", "white");

            setTimeout(() => {
                document.documentElement.style.setProperty("--darkcolor", "#372c4d");
            }, 1000);


            if (pressCount < 2) {

            }
            else {
                hardRoundReset()
            }


        }








        );
    }

    enableBtn.addEventListener("click", function () {
        enableButton(countdownBtn);
        enableButton(wrongBtn);
        enableButton(TutuownBtn);
        sendWebSocketMessage({
            event: "enable-buttons",
            body: { round: { uuidv4: currentRonda.uuidv4 } }
        });

    });




    hardResetBtn.addEventListener("click", () => {
        pressCount++;
        document.documentElement.style.setProperty("--darkcolor", "red");

        setTimeout(() => {
            document.documentElement.style.setProperty("--darkcolor", "#372c4d");
        }, 1000);


        if (pressCount > 5) {
            console.log("HARD RESET TRIGGERED!");
            pressCount = 0;
            sendWebSocketMessage({
                event: "hard-reset",
                body: null
            });
        }
    });

}

export {
    initController,
    setRoundParticipants
}