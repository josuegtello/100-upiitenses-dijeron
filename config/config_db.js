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

db.rounds.drop()

db.rounds.insertMany([
    {
        id: 1,
        question: "Principios de bioética",
        answers: [
            { id: 1, text: "Autonomía", score: 40 },
            { id: 2, text: "Beneficencia", score: 30 },
            { id: 3, text: "No maleficencia", score: 20 },
            { id: 4, text: "Justicia", score: 10 }
        ]
    },
    {
        id: 2,
        question: "Campos de bioética",
        answers: [
            { id: 1, text: "Genética", score: 40 },
            { id: 2, text: "Medio ambiente", score: 30 },
            { id: 3, text: "Procreación", score: 20 },
            { id: 4, text: "Centros salud", score: 10 }
        ]
    },
    {
        id: 3,
        question: "Principios sustentabilidad",
        answers: [
            { id: 1, text: "Equidad intergen", score: 40 },
            { id: 2, text: "Prevención", score: 30 },
            { id: 3, text: "Circularidad", score: 20 },
            { id: 4, text: "Quien contamina", score: 10 }
        ]
    },
    {
        id: 4,
        question: "Aplicaciones ingeniería",
        answers: [
            { id: 1, text: "Innov. respons.", score: 40 },
            { id: 2, text: "Energías limpia", score: 30 },
            { id: 3, text: "Diseño ecológic", score: 20 },
            { id: 4, text: "Innov. tecnolog", score: 10 }
        ]
    },
    {
        id: 5,
        question: "Eventos históricos",
        answers: [
            { id: 1, text: "Código Núremb.", score: 30 },
            { id: 2, text: "Potter 1971", score: 25 },
            { id: 3, text: "Brundtland 1987", score: 20 },
            { id: 4, text: "Juicio Núremb.", score: 15 },
            { id: 5, text: "Estocolmo 1972", score: 10 }
        ]
    },
    {
        id: 6,
        question: "Etimología bioética",
        answers: [
            { id: 1, text: "BIOS (vida)", score: 60 },
            { id: 2, text: "ETHOS (ética)", score: 40 }
        ]
    },
    {
        id: 7,
        question: "Etimología sustentabilidad",
        answers: [
            { id: 1, text: "SUBS (debajo)", score: 50 },
            { id: 2, text: "TENERE (sujetar)", score: 35 },
            { id: 3, text: "-bilidad", score: 15 }
        ]
    },
    {
        id: 8,
        question: "DILEMA: Innovación vs Ambiente",
        answers: [
            { id: 1, text: "Beneficencia", score: 30 },
            { id: 2, text: "Resp. socioamb", score: 25 },
            { id: 3, text: "Equidad interge", score: 20 },
            { id: 4, text: "Innov. respons.", score: 15 },
            { id: 5, text: "Prevención", score: 10 }
        ]
    },
    {
        id: 9,
        question: "DILEMA: Clonación Humana",
        answers: [
            { id: 1, text: "Autonomía", score: 30 },
            { id: 2, text: "No maleficencia", score: 25 },
            { id: 3, text: "Justicia", score: 20 },
            { id: 4, text: "Reg. genética", score: 15 },
            { id: 5, text: "Beneficencia", score: 10 }
        ]
    },
    {
        id: 10,
        question: "DILEMA: Eutanasia",
        answers: [
            { id: 1, text: "Autonomía", score: 30 },
            { id: 2, text: "No maleficencia", score: 25 },
            { id: 3, text: "Beneficencia", score: 20 },
            { id: 4, text: "Reg. centros", score: 15 },
            { id: 5, text: "Justicia", score: 10 }
        ]
    },
    {
        id: 11,
        question: "DILEMA: Fábrica Contaminante",
        answers: [
            { id: 1, text: "Quien contamina", score: 30 },
            { id: 2, text: "Prevención", score: 25 },
            { id: 3, text: "Justicia", score: 20 },
            { id: 4, text: "Innov. respons.", score: 15 },
            { id: 5, text: "Circularidad", score: 10 }
        ]
    },
    {
        id: 12,
        question: "DILEMA: Experimentación Animal",
        answers: [
            { id: 1, text: "Beneficencia", score: 30 },
            { id: 2, text: "No maleficencia", score: 25 },
            { id: 3, text: "Justicia", score: 20 },
            { id: 4, text: "Regulación", score: 15 },
            { id: 5, text: "Innov. respons.", score: 10 }
        ]
    },
    {
        id: 13,
        question: "DILEMA: Energía Nuclear",
        answers: [
            { id: 1, text: "Equidad interge", score: 30 },
            { id: 2, text: "Prevención", score: 25 },
            { id: 3, text: "Energías limpia", score: 20 },
            { id: 4, text: "Resp. socioamb.", score: 15 },
            { id: 5, text: "Innov. tecnolog", score: 10 }
        ]
    }
])

db.rounds.find()




