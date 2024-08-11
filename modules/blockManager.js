export class BlockManager {
    constructor(app) {
        this.app = app;
        this.array = [];
    }

    get(name) {
        const block = this.array.find(s => s.name === name);
        return block ? block.code : `Block ${name} not found.`;
    }

    defineNew(name, code) {
        const block = { name, code };
        this.array.push(block);
        return block;
    }

    async defineFromAPI(link) {
        try {
            const response = await fetch(link, { method: 'POST' });
            if (!response.ok) throw new Error('Error getting data from API.');

            const data = await response.json();
            if (data[0]?.name && data[0]?.code) {
                this.array = data;
                return data;
            } else {
                throw new Error('API does not contain blocks array.');
            }
        } catch (error) {
            console.error('%c[NEXS.JS] ', 'color: red', error.message);
        }
    }
}