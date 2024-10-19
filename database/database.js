import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';

export class DataBase {
    dataBase = {}
    dataBasePath;

    constructor() {
        this.dataBasePath = new URL("../db.json", import.meta.url);
        this.#loadData();
    }

    async #loadData() {
        try {
            const data = await fs.readFile(this.dataBasePath, 'utf8');
            this.dataBase = JSON.parse(data);
        } catch (err) {
            console.error('Erro ao carregar dados:', err);
            await this.#persistence();
        }
    }

    async #persistence() {
        try {
            await fs.writeFile(this.dataBasePath, JSON.stringify(this.dataBase, null, 2), 'utf8');
        } catch (err) {
            console.error('Erro ao persistir dados:', err);
        }
    }

    #findIndiceTask(id, res, table) {
        const itemIndex = this.dataBase[table]?.findIndex(dado => dado.id === id);
        if (itemIndex !== -1) {
            return itemIndex;
        }

        res.end("Tarefa não encontrada");
        return null;
    }

    select(table) {
        return this.dataBase[table] ?? [];
    }

    async insert(table, data) {
        if (!this.dataBase[table]) this.dataBase[table] = [];

        this.dataBase[table].push({
            id: randomUUID(),
            completed_at: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...data
        });

        await this.#persistence();
    }

    async delete(res, table, id) {
        const itemIndex = this.#findIndiceTask(id, res, table);
        if (itemIndex) {
            this.dataBase[table].splice(itemIndex, 1);
            await this.#persistence();
        }
    }

    async update(res, table, id, data) {
        const itemIndex = this.#findIndiceTask(id, res, table);

        if (itemIndex !== -1) {
            this.dataBase[table][itemIndex] = {
                ...this.dataBase[table][itemIndex],
                ...data,
                updatedAt: new Date(),
            };

            await this.#persistence();
        }
    }

    async patch(res, table, id) {
        const itemIndex = this.#findIndiceTask(id, res, table);

        this.dataBase[table][itemIndex] = {
            ...this.dataBase[table][itemIndex],
            completed_at: new Date(),
        };

        await this.#persistence();
    }
}