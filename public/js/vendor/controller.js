import app from "./middlewares/app.js";
import { sendWebSocketMessage } from "./controllers/websocket.js";

function setQuestion(newId) {
    document.getElementById("id_pregunta").textContent = newId;
    document.getElementById("pregunta").textContent = getPreguntaById(newId);

    // Update current round and render new answers
    currentRonda = setRonda(newId);
    renderRespuestas();
}



function getPreguntaById(id) {
    const ronda = rounds.find(r => r.id === id);
    return ronda ? ronda.pregunta : null;
}

function setRonda(id) {
    return rounds.find(r => r.id === id);
}


//app.getTeams();

const teamsprepocesed = [];
const teamspostproceded = [];

const setRoundParticipants = function (participants) {
    participants.forEach(participant => {
        const teams = app.teams
        teams.forEach(team => {
            if (participant.uuidv4 === team.uuidv4) {
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
    renderTeamById(currentTeam.id_local);
}

// console.log(teamspostproceded)

function nextquestion() {
    if (currentQuestionIndex < rounds.length) {
        currentQuestionIndex++;
        setQuestion(currentQuestionIndex);
        console.log({ currentQuestionIndex });
    }
}

function prevquestion() {
    if (currentQuestionIndex > 1) {
        currentQuestionIndex--;
        setQuestion(currentQuestionIndex);
        console.log({ currentQuestionIndex });
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

function addStrikes() {
    if (!selecionDeEquipos) {
        console.log("patrulla");
        console.log(teamspostproceded);
        const team1 = teamspostproceded[0];
        const team2 = teamspostproceded[1];
        const team3 = teamspostproceded[2];

        if (team1.strikes >= 3 && team2.strikes >= 1 && team3.strikes < 1) {
            team3.strikes++;
            sendWebSocketMessage({
                event: "STRIKE",
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
                event: "STRIKE",
                body: { strikes: team2.strikes }
            });
        }
        if (team2.strikes >= 1 && team3.strikes < 1) {
            renderTeamById(team3.id_local);
        }

        if (team1.strikes < 3) {
            team1.strikes++;
            sendWebSocketMessage({
                event: "STRIKE",
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
            event: "STRIKE",
            body: { strikes: 1 }
        });
        if (renderIndex >= 2) {
            teamspostproceded.sort((a, b) => b.current_score - a.current_score);
            console.log(teamspostproceded);
            renderTeamById(teamspostproceded[0].id_local);
            selecionDeEquipos = false;
            return;
        }
    }
}

function addScore(id, elementToRemove) {
    const ans = currentRonda.respuestas.find(t => t.id === Number(id));
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
            console.log(teamspostproceded);
            selecionDeEquipos = false;
            return;
        }
        renderIndex++;
        if (renderIndex >= 2) {
            teamspostproceded.sort((a, b) => b.current_score - a.current_score);
            console.log(teamspostproceded);
            renderTeamById(teamspostproceded[0].id_local);
            selecionDeEquipos = false;
            return;
        }
        currentTeam = teamspostproceded[renderIndex];
        renderTeamById(currentTeam.id_local);
    }
}

function asignRondaScoreToFirst() {

    teamspostproceded[0].score += (currentRonda.score || 0);
    console.log(teamspostproceded);
    rondaTerminated = true;
    updateWinnerById(teamspostproceded[0]);
    resetRound();
}

function automaticRondaTermination() {
    console.log(teamspostproceded);
    if (!selecionDeEquipos) {
        const team1 = teamspostproceded[0];
        const team2 = teamspostproceded[1];
        const team3 = teamspostproceded[2];

        if (team2.strikes >= 1 && team3.strikes < 1) {
            console.log("Equipo ganador 3");
            teamspostproceded[2].score += (currentRonda.score || 0);
            console.log(teamspostproceded);
            rondaTerminated = true;

            updateWinnerById(teamspostproceded[2]);
            resetRound();
        }

        if (team1.strikes >= 3 && team2.strikes < 1) {
            console.log("Equipo ganador 2");
            teamspostproceded[1].score += (currentRonda.score || 0);
            console.log(teamspostproceded);
            rondaTerminated = true;
            updateWinnerById(teamspostproceded[1]);

            resetRound();
        }
    }

    if ((teamspostproceded[0].strikes < 3) && (contadorpreguntas >= 5) && (!selecionDeEquipos)) {
        console.log("Equipo ganador");
        teamspostproceded[0].score += (currentRonda.score || 0);
        console.log(teamspostproceded);
        rondaTerminated = true;
        resetRound();
    }
}

function terminateGame() {
    teams = app.getTeams();
    const sorted = [...teams].sort((a, b) => a.score - b.score);
    sendWebSocketMessage({
        event: "WINGAME ",
        body: sorted[0]
    });
}

function resetRound() {
    console.log("Resetting round...");

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
    currentTeam = teamspostproceded.find((t) => t.id_local === 1);

    // Re-render current team
    renderTeamById(currentTeam.id_local);

    // Send win notification via WebSocket


    console.log("Round reset complete", teamspostproceded);
}

function renderRespuestas() {
    const contenedor = document.querySelector(".contendorespuestas");

    // Clear existing answers efficiently
    contenedor.innerHTML = '';

    // Create answer elements using DocumentFragment for better performance
    const fragment = document.createDocumentFragment();

    if (currentRonda && currentRonda.respuestas) {
        currentRonda.respuestas.forEach((respuesta) => {
            const p = document.createElement("p");
            p.textContent = respuesta.texto;
            p.dataset.answerId = respuesta.id;

            p.addEventListener("click", (event) => {
                if (!rondaTerminated) {
                    addScore(respuesta.id, event.currentTarget);
                    contadorpreguntas++;
                    console.log(contadorpreguntas);
                }
                automaticRondaTermination();

                sendWebSocketMessage({
                    event: "Respuesta",
                    body: { id: respuesta.id }
                });
            });

            fragment.appendChild(p);
        });
    }

    contenedor.appendChild(fragment);
}

let currentTeam = teamspostproceded.find((t) => t.id_local === 1);
let selecionDeEquipos = true;
let renderIndex = 0;
let contadorpreguntas = 0;
let rondaTerminated = false;
let currentQuestionIndex = 1;
let rounds = [];
let currentRonda;
let wrongBtn;

function initController() {
    rounds = app.getRounds();
    const leftquestionBtn = document.getElementById("leftquestionBtn");
    const rightquestionshowBtn = document.getElementById("rightquestionshowBtn");
    const showBtn = document.getElementById("showBtn");
    const countdownBtn = document.getElementById("countdownBtn");
    const WinBtn = document.getElementById("WinBtn");
    const TutuownBtn = document.getElementById("TutuownBtn");
    const resetBtn = document.getElementById("resetBtn");
    wrongBtn = document.getElementById("wrongBtn");

    // Event listeners for controls
    wrongBtn.addEventListener("click", addStrikes);
    leftquestionBtn.addEventListener("click", prevquestion);
    rightquestionshowBtn.addEventListener("click", nextquestion);

    showBtn.addEventListener("click", () => {
        sendWebSocketMessage({
            event: "SHOWROUND",
            body: { id: currentRonda ? currentRonda.id : null }
        });
    });

    countdownBtn.addEventListener("click", startCountdown);
    WinBtn.addEventListener("click", terminateGame);

    TutuownBtn.addEventListener("click", () => {
        sendWebSocketMessage({
            event: "TUTUsound",
            body: null
        });
    });

    if (resetBtn) {
        resetBtn.addEventListener("click", resetRound);
    }

    // Initial render

    setQuestion(currentQuestionIndex);
}

export { initController, setRoundParticipants };