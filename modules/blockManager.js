export class BlockManager {
    constructor(app) {
        this.app = app;
        this.array = [];
        this.sections = [];
    }

    get(name) {
        const block = this.array.find(s => s.name === name);
        if(block){
            return block.code;
        } else {
            console.error('%c[NEXS.JS] ', 'color: red', `Block [${name}] not found.`);
            return null;
        }
    }

    getSections(name) {
        const block = this.array.find(s => s.name === name);
        if(block){
            return block.sections;
        } else {
            console.error('%c[NEXS.JS] ', 'color: red', `Block [${name}] not found.`);
            return [];
        }
    }

    defineNew(name, code, sections = []) {
        if (!Array.isArray(sections)) {
            throw new Error('Sections must be an array');
        }
        const block = { name, code, sections };
        this.array.push(block);
        return block;
    }

    async defineFromAPI(link) {
        try {
            const response = await fetch(link, { method: 'POST' });
            if (!response.ok) throw new Error('Error getting data from API.');

            const data = await response.json();
            if (data[0]?.name && data[0]?.code) {
                data.forEach(l =>{
                    this.defineNew(l.name, l.code, l.sections)
                })
                return data;
            } else {
                throw new Error('API does not contain blocks array.');
            }
        } catch (error) {
            console.error('%c[NEXS.JS] ', 'color: red', error.message);
        }
    }
}