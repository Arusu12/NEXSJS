export class PageManager {
    constructor(app) {
        this.app = app;
        this.array = [];
    }

    get(url) {
        const layout = this.array.find(s => s.link === url);
        return layout ? layout.code : `Layout ${url} not found.`;
    }

    defineNew(page = { link, layout, block, type }) {
        if (!page) {
            console.error('%c[NEXS.JS] ', 'color: red', 'No page defined.');
            return;
        }
        this.array.push(page);
    }

    async defineFromAPI(link) {
        try {
            const response = await fetch(link, { method: 'POST' });
            if (!response.ok) throw new Error('Error getting data from API.');

            const data = await response.json();
            if (data[0]?.link && data[0]?.layout && data[0]?.block && data[0]?.type) {
                this.array = data;
                return data;
            } else {
                throw new Error('API does not contain page array.');
            }
        } catch (error) {
            console.error('%c[NEXS.JS] ', 'color: red', error.message);
        }
    }

    async render(link, sectionToRenderName) {
        if (link === '/404' && !this.get(link)) {
            console.error('%c[NEXS.JS] ', 'color: red', 'No 404 Page set!');
            return;
        }
    
        this.app.sectionToRender = sectionToRenderName || this.app.sectionToRender;
        if (!this.app.sectionToRender) {
            console.error('%c[NEXS.JS] ', 'color: red', 'Main rendering section is not set.');
            return;
        }
    
        link = link || window.location.pathname;
    
        const match = this.app.helper.matchDynamicPath(link);
        const page = match ? match.page : null;
    
        if (!page) {
            await this.render('/404');
            return;
        }
    
        if (page.layout !== this.app.currentLayout) {
            const layout = this.app.layouts.get(page.layout);
            if (!layout) return;
        }
    
        if (page.type === 'http') {
            try {
                const response = await fetch(link, { method: 'POST' });
                if (!response.ok) {
                    await this.get('/404');
                    return;
                }
                const data = await response.json();
                this.app.sections.render(this.app.sectionToRender, page.block, data);
                return data;
            } catch (error) {
                await this.render('/404');
            }
        } else if (page.type === 'popup') {
            // handle popup case
        } else if (page.type === 'ws') {
            socket.emit(ws, value);
        } else if (page.type === 'func') {
            const executeFunction = async (code) => {
                try {
                    const asyncFunction = new Function('return (async () => {' + code + '})();');
                    return await asyncFunction();
                } catch (error) {
                    console.error('%c[NEXS.JS] ', 'color: red', 'Error executing function:', error);
                    return '';
                }
            };
    
            executeFunction(page.func);
        } else {
            this.app.sections.render('content', page.block);
        }
        return this.app.body;
    }
}