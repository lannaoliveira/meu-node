import fs from 'fs';
import { parse } from 'csv-parse';
import axios from 'axios';
import path from 'path';

async function importCSV(filePath) {
    const parser = fs.createReadStream(filePath)
        .pipe(parse({
            columns: true,
            skip_empty_lines: true
        }));

    for await (const record of parser) {
        try {
            await axios.post('http://localhost:3334/tasks', record);
        } catch (error) {
            console.error('Erro ao enviar tarefa:', error.message);
        }
    }
}

const filePath = path.resolve('./public/arquivo.csv');
importCSV(filePath);
