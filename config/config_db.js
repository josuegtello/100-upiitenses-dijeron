mongosh

use upiitenses-dijeron

show collections

db.teams.insertOne({id:1,name:"Equipo 1",score:0})

db.teams.insertOne({id:3,name:"Equipo 3",score:0})

db.teams.insertOne({id:4,name:"Equipo 4",score:0})

db.teams.insertOne({id:5,name:"Equipo 5",score:0})

db.teams.insertOne({id:6,name:"Equipo 6",score:0})

db.teams.insertOne({id:7,name:"Equipo 7",score:0})

db.teams.insertOne({id:8,name:"Equipo 8",score:0})

db.teams.find()

db.rounds.insertMany([
    {
        id: 1,
        question: "pregunta 1",
        answers: [
            { id: 1, answer: "Respuesta 101", score: 65 },
            { id: 2, answer: "Respuesta 201", score: 60 },
            { id: 3, answer: "Respuesta 301", score: 58 },
            { id: 4, answer: "Respuesta 401", score: 44 },
            { id: 5, answer: "Respuesta 501", score: 32 },
        ],
    },
    {
        id: 2,
        question: "pregunta 2",
        answers: [
            { id: 1, answer: "Respuesta 102", score: 67 },
            { id: 2, answer: "Respuesta 202", score: 62 },
            { id: 3, answer: "Respuesta 302", score: 59 },
            { id: 4, answer: "Respuesta 402", score: 46 },
            { id: 5, answer: "Respuesta 502", score: 35 },
        ],
    },
    {
        id: 3,
        question: "pregunta 3",
        answers: [
            { id: 1, answer: "Respuesta 103", score: 70 },
            { id: 2, answer: "Respuesta 203", score: 65 },
            { id: 3, answer: "Respuesta 303", score: 60 },
            { id: 4, answer: "Respuesta 403", score: 50 },
            { id: 5, answer: "Respuesta 503", score: 38 },
        ],
    },
    {
        id: 4,
        question: "pregunta 4",
        answers: [
            { id: 1, answer: "Respuesta 104", score: 72 },
            { id: 2, answer: "Respuesta 204", score: 68 },
            { id: 3, answer: "Respuesta 304", score: 63 },
            { id: 4, answer: "Respuesta 404", score: 52 },
            { id: 5, answer: "Respuesta 504", score: 40 },
        ],
    },
    {
        id: 5,
        question: "pregunta 5",
        answers: [
            { id: 1, answer: "Respuesta 105", score: 75 },
            { id: 2, answer: "Respuesta 205", score: 70 },
            { id: 3, answer: "Respuesta 305", score: 65 },
            { id: 4, answer: "Respuesta 405", score: 55 },
            { id: 5, answer: "Respuesta 505", score: 42 },
        ],
    },
    {
        id: 6,
        question: "pregunta 6",
        answers: [
            { id: 1, answer: "Respuesta 106", score: 77 },
            { id: 2, answer: "Respuesta 206", score: 72 },
            { id: 3, answer: "Respuesta 306", score: 68 },
            { id: 4, answer: "Respuesta 406", score: 57 },
            { id: 5, answer: "Respuesta 506", score: 45 },
        ],
    },
    {
        id: 7,
        question: "pregunta 7",
        answers: [
            { id: 1, answer: "Respuesta 107", score: 80 },
            { id: 2, answer: "Respuesta 207", score: 74 },
            { id: 3, answer: "Respuesta 307", score: 70 },
            { id: 4, answer: "Respuesta 407", score: 60 },
            { id: 5, answer: "Respuesta 507", score: 48 },
        ],
    },
    {
        id: 8,
        question: "pregunta 8",
        answers: [
            { id: 1, answer: "Respuesta 108", score: 82 },
            { id: 2, answer: "Respuesta 208", score: 76 },
            { id: 3, answer: "Respuesta 308", score: 72 },
            { id: 4, answer: "Respuesta 408", score: 62 },
            { id: 5, answer: "Respuesta 508", score: 50 },
        ],
    },
    {
        id: 9,
        question: "pregunta 9",
        answers: [
            { id: 1, answer: "Respuesta 109", score: 85 },
            { id: 2, answer: "Respuesta 209", score: 78 },
            { id: 3, answer: "Respuesta 309", score: 74 },
            { id: 4, answer: "Respuesta 409", score: 64 },
            { id: 5, answer: "Respuesta 509", score: 52 },
        ],
    },
    {
        id: 10,
        question: "pregunta 10",
        answers: [
            { id: 1, answer: "Respuesta 110", score: 88 },
            { id: 2, answer: "Respuesta 210", score: 80 },
            { id: 3, answer: "Respuesta 310", score: 76 },
            { id: 4, answer: "Respuesta 410", score: 66 },
            { id: 5, answer: "Respuesta 510", score: 55 },
        ],
    },
])

db.rounds.find()




