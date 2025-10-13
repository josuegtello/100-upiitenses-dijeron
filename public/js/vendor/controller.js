import app from "./middlewares/app.js";

function playsound(sound) {
    console.log("sonido de" + sound);
}

const preprocessTeams = (teams) => {
    return teams.map((team, index) => ({
        ...team,
        id_local: index + 1,
        strikes: 0,
    }));
};

const teamsprepocesed = [
    { id: 1, name: "Team Alpha", score: 0 },
    { id: 6, name: "Team Yui", score: 0 },
    { id: 8, name: "Team Yukinon", score: 0 },
];

const teamspostproceded = preprocessTeams(teamsprepocesed);

const ronda = {
    id: 1,
    pregunta: "pregunta",
    respuestas: [
        { id: 1, texto: "Nueva Respuesta 12" },
        { id: 2, texto: "Nueva Respuesta 2" },
        { id: 3, texto: "Nueva Respuesta 3" },
        { id: 4, texto: "Nueva Respuesta 3" },
        { id: 5, texto: "Nueva Respuesta 3" },
    ],
};

function nextquestion() { }

function prevquestion() { }
function renderTeamById(id_local) {
    const team = teamspostproceded.find((t) => t.id_local === id_local);
    if (!team) return;

    const contenedorEquipo = document.querySelector(".contenedorequipo");
    contenedorEquipo.innerHTML = `
        <p>Equipo</p>
        <p>${team.id}</p>
        <p>: ${team.name}</p>
   
    `;
}

function addStrikes() {
    if (team1.strikes >= 3 && team2.strikes >= 1 && team3.strikes >= 1) {
        currentTeam = teamspostproceded.find((t) => t.id_local === 1);
        renderTeamById(currentTeam.id_local);
        return;
    }
    console.log("before" + currentTeam.name);
    console.log("before" + team1.strikes);
    console.log("before" + team2.strikes);
    console.log("before" + team3.strikes);
    if (team1.strikes < 3) {
        team1.strikes++;
    }
    if (team2.strikes >= 1 && team3.strikes < 1) {
        renderTeamById(team3.id_local);
        currentTeam = teamspostproceded.find((t) => t.id_local === 3);
        renderTeamById(currentTeam.id_local);
    }
    if (team1.strikes >= 3 && team2.strikes >= 1 && team3.strikes < 1) {
        team3.strikes++;
    }
    if (team1.strikes >= 3 && team2.strikes < 1) {
        console.log("entro al if de yui");
        currentTeam = teamspostproceded.find((t) => t.id_local === 2);
        renderTeamById(currentTeam.id_local);
        team2.strikes++;
    }


}

let currentTeam = teamspostproceded.find((t) => t.id_local === 1);
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

    // Insertar <p> dinámicamente
    ronda.respuestas.forEach((respuesta) => {
        const p = document.createElement("p");
        p.textContent = respuesta.texto;
        contenedor.appendChild(p);
    });
    leftquestionBtn.addEventListener("click", nextquestion);
    rightquestionshowBtn.addEventListener("click", prevquestion);
    showBtn.addEventListener("click", () => playsound("show"));
    countdownBtn.addEventListener("click", () => playsound("countdown"));
    WinBtn.addEventListener("click", () => playsound("win"));
    TutuownBtn.addEventListener("click", () => playsound("tutuown"));
}

export default initController;
