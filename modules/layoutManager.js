export class LayoutManager {
    constructor(app) {
        this.app = app;
        this.array = [];
        this.sections = [];
    }

    get(name) {
        const layout = this.array.find(s => s.name == name);
        if(layout){
            return layout.code;
        } else {
            console.error('%c[NEXS.JS] ', 'color: red', `Layout [${name}] not found.`);
            return null;
        }
    }
    getSections(name) {
        const layout = this.array.find(s => s.name == name);
        if(layout){
            return layout.sections;
        } else {
            console.error('%c[NEXS.JS] ', 'color: red', `Layout [${name}] not found.`);
            return [];
        }
    }

    defineNew(name, code, sections = []) {
        if (!Array.isArray(sections)) {
            throw new Error('Sections must be an array');
        }
        const layout = { name, code, sections };
        this.array.push(layout);
        return layout;
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
                throw new Error('API does not contain layouts array.');
            }
        } catch (error) {
            console.error('%c[NEXS.JS] ', 'color: red', error.message);
        }
    }

    async render(name) {
        const layout = this.get(name);
        if (!layout) return;
        this.app.body.innerHTML = layout;
        this.getSections(name).forEach(e => {
            e.code = this.app.body.querySelector(e.code)
        });
        this.app.currentLayout = name;
        return this.app.body;
    }
}