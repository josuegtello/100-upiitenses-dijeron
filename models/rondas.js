import db from "../config/db.js";
mronda = {
    getAllQuestions: async () => {
        try {
            const [results] = await db.query("SELECT * FROM question");
            return results;
        } catch (err) {
            throw { status: 500, message: "Error al cargar la ronda " };
        }
    },
    getAllAnswers: async () => {
        try {
            const [results] = await db.query("SELECT * FROM respuestas WHERE id_ronda = ?", [
                id_ronda,
            ]);
            return results;
        } catch (err) {
            throw { status: 500, message: "Error al cargar la ronda " };
        }
    },
    getOneQuestion: async () => {
        try {
            const [results] = await db.query("SELECT * FROM pregunta where id_ronda = ?",[id_ronda]);
            return results;
        } catch (err) {
            throw { status: 500, message: "Error al cargar la ronda " };
        }
    },
    getOneAnswer: async () => {
        try {
            const [results] = await db.query(
                'SELECT respuesta FROM respuestas WHERE id_ronda = ? AND id_respuesta = ?',
                [id_ronda, id_respuesta]
            );
            return results;
        } catch (err) {
            throw { status: 500, message: "Error al cargar la ronda " };
        }
    },

};

export default mronda