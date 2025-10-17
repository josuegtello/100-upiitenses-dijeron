import app from "./middlewares/app.js";

function playsound(sound) {
    console.log("sonido de" + sound);
}

function changePregunta(newId) {
    const elemento = document.getElementById("id_pregunta");
    elemento.textContent = newId;
}

const preprocessTeams = (teams) => {
    return teams.map((team, index) => ({
        ...team,
        id_local: index + 1,
        strikes: 0,
        current_score: 0,
    }));
};

const teamsprepocesed = [
    { id: 1, name: "Team Alpha", score: 0 },
    { id: 6, name: "Team Yuigahama", score: 0 },
    { id: 8, name: "Team Yukinon", score: 0 },
];
teamsprepocesed.forEach(team => {
    if (team.id) {

    }
});

const teamspostproceded = preprocessTeams(teamsprepocesed);

const ronda = {
    id: 1,
    pregunta: "pregunta",
    score: 0,
    respuestas: [
        { id: 1, texto: "Respuesta 1", score: 65 },
        { id: 2, texto: "Respuesta 2", score: 60 },
        { id: 3, texto: "Respuesta 3", score: 55 },
        { id: 4, texto: "Respuesta 4", score: 44 },
        { id: 5, texto: "Respuesta 5", score: 32 },
    ],
};

const ronda2 = {
    id: 1,
    pregunta: "pregunta2",
    score: 0,
    respuestas: [
        { id: 1, texto: "Respuesta 21" },
        { id: 2, texto: "Respuesta 22" },
        { id: 3, texto: "Respuesta 23" },
        { id: 4, texto: "Respuesta 24" },
        { id: 5, texto: "Respuesta 25" },
    ],
};
let currentQuestionIndex = 0;

function nextquestion() {
    if (currentQuestionIndex < 20) {
        currentQuestionIndex++;
        changePregunta(currentQuestionIndex);
        console.log({ currentQuestionIndex });
    }
}

function prevquestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        changePregunta(currentQuestionIndex);
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



function addStrikes() {
    if (!selecionDeEquipos) {
        const team1 = teamspostproceded[0];
        const team2 = teamspostproceded[1];
        const team3 = teamspostproceded[2];

        if (team1.strikes >= 3 && team2.strikes >= 1 && team3.strikes >= 1) {
            currentTeam = teamspostproceded.find((t) => t.id_local === 1);
            asignRondaScore();
            renderTeamById(currentTeam.id_local);

            return;
        }

        if (team1.strikes < 3) {
            team1.strikes++;
        }
        if (team2.strikes >= 1 && team3.strikes < 1) {
            renderTeamById(team3.id_local);
            currentTeam = teamspostproceded.find((t) => t.id_local === 3);
            asignRondaScore();
            renderTeamById(currentTeam.id_local);
        }
        if (team1.strikes >= 3 && team2.strikes >= 1 && team3.strikes < 1) {
            team3.strikes++;
        }
        if (team1.strikes >= 3 && team2.strikes < 1) {
            currentTeam = teamspostproceded.find((t) => t.id_local === 2);
            asignRondaScore();
            renderTeamById(currentTeam.id_local);
            team2.strikes++;
        }
    } else {
        currentSelectionIndex++;
        renderTeamById(currentSelectionIndex);
        contadorDeSeleccion++;
        if (contadorDeSeleccion >= 3) {
            teamspostproceded.sort((a, b) => b.current_score - a.current_score);
            renderTeamById(teamspostproceded[0])
            selecionDeEquipos = false;
        }
    }
}

function addScore(id) {
    const ans = ronda.respuestas.find(t => t.id === Number(id));
    if (selecionDeEquipos) {
        console.log({ currentSelectionIndex });
        currentTeam = teamspostproceded[contadorDeSeleccion];

        if ((currentSelectionIndex < 2)) {
            console.log("entra al if va a suceder otra vez");
            console.log(currentTeam);
            currentSelectionIndex++;
            console.log({ currentSelectionIndex });
            renderTeamById(teamspostproceded[currentSelectionIndex].id_local);
        }
        currentTeam.current_score = ans.score;
        if (id === 1) {
            console.log("entro al if de id == 1")
            currentTeam.current_score = ans.score;
            teamspostproceded.sort((a, b) => b.current_score - a.current_score);
            currentTeam = teamspostproceded[0];
            renderTeamById(currentTeam.id_local);
            console.log(teamspostproceded);
            console.log(currentTeam.name);
            selecionDeEquipos = false;
            return;
        }
        contadorDeSeleccion++;
        console.log({ contadorDeSeleccion });

        if (contadorDeSeleccion >= 3) {
            console.log("entro al controlador de limite ");
            teamspostproceded.sort((a, b) => b.current_score - a.current_score);
            console.log(teamspostproceded);
            currentTeam = teamspostproceded[0];
            renderTeamById(currentTeam.id_local);
            selecionDeEquipos = false;
            console.log(currentTeam.name);
            return;
        }


    }


    ronda.score += ans.score;
    console.log(ans.score);
    console.log(ronda.score);
    console.log()
}

function asignRondaScore() {

    currentTeam.score += ronda.score;
    console.log(currentTeam.name);
    console.log(currentTeam.score);

}



let currentTeam = teamspostproceded.find((t) => t.id_local === 1);
let selecionDeEquipos = true;
let contadorDeSeleccion = 0;
let currentSelectionIndex = 0; //lo que modifique du/dx
let contadorPreguntas = 0;
function initController() {
    const leftquestionBtn = document.getElementById("leftquestionBtn");
    const rightquestionshowBtn = document.getElementById("rightquestionshowBtn");
    const showBtn = document.getElementById("showBtn");
    const countdownBtn = document.getElementById("countdownBtn");
    const WinBtn = document.getElementById("WinBtn");
    const TutuownBtn = document.getElementById("TutuownBtn");
    const contenedor = document.querySelector(".contendorespuestas");
    const wrongBtn = document.getElementById("wrongBtn");
    wrongBtn.addEventListener("click", addStrikes);
    renderTeamById(currentTeam.id_local);

    ronda.respuestas.forEach((respuesta) => {
        const p = document.createElement("p");
        p.textContent = respuesta.texto;

        p.addEventListener("click", () => {
            addScore(respuesta.id);
        });

        contenedor.appendChild(p);
    });


    leftquestionBtn.addEventListener("click", prevquestion);
    rightquestionshowBtn.addEventListener("click", nextquestion);
    showBtn.addEventListener("click", () => playsound("show"));
    countdownBtn.addEventListener("click", () => playsound("countdown"));
    WinBtn.addEventListener("click", () => {
        console.log(ans.score);
        console.log(ronda.score);

    });
    TutuownBtn.addEventListener("click", () => playsound("tutuown"));
}

export default initController;
