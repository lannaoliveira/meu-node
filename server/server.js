import { rotas } from '../rotas/rotas.js';
import http from 'http';
import { json } from "../middleware/json.js"

const server = http.createServer(async (req, res) => {
    if (!req.method) return "Método inválido";

    await json(req);

    const extraiParametros = () => {
        const { url } = req;
        const regex = /\/([^\/]+)\/([^\/]+)/;
        const match = url?.match(regex);

        if (match && match[2]) {
            const id = match[2];
            return id;
        }

        return '';
    };

    rotas?.forEach(rota => {
        if (rota.method === req.method) {
            rota.execucao({
                res,
                id: extraiParametros(),
                data: req.body,
            });
        }
    });

    res.end();
});

server.listen(3334, () => { });