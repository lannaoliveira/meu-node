import { DataBase } from "../database/database.js";

const db = new DataBase();
const nomeTabela = 'tasks';

export const rotas = [
    {
        method: 'GET',
        path: '/tasks/',
        execucao: (props) => {
            const { res } = props;
            const dados = db.select(nomeTabela);
            res.end(JSON.stringify(dados));
        }
    },
    {
        method: 'PUT',
        path: '/tasks/:id',
        execucao: (props) => {
            const { res, id, data } = props;
            db.update(res, nomeTabela, id, data);
        }
    },
    {
        method: 'POST',
        path: '/tasks/',
        execucao: (props) => {
            const { data } = props;
            db.insert(nomeTabela, data);
        }
    },
    {
        method: 'DELETE',
        path: '/tasks/:id',
        execucao: (props) => {
            const { res, id } = props;
            db.delete(res, nomeTabela, id);
        }
    },
    {
        method: 'PATCH',
        path: '/tasks/:id/complete',
        execucao: (props) => {
            const { res, id } = props;
            db.patch(res, nomeTabela, id);
        }
    },
]