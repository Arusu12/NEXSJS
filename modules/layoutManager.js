export class LayoutManager {
    constructor(app) {
        this.app = app;
        this.array = [];
    }

    get(name) {
        const layout = this.array.find(s => s.name == name);
        return layout ? layout.code : `Layout ${name} not found.`;
    }

    defineNew(name, code) {
        const layout = { name, code };
        this.array.push(layout);
        return layout;
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
                throw new Error('API does not contain layouts array.');
            }
        } catch (error) {
            console.error('%c[NEXS.JS] ', 'color: red', error.message);
        }
    }

    async render(name) {
        const layout = this.get(name);
        if (!layout) {
            console.error('%c[NEXS.JS] ', 'color: red', 'Layout not found.');
            return;
        }
        this.app.body.innerHTML = layout;
        this.app.currentLayout = name;
        return this.app.body;
    }
}