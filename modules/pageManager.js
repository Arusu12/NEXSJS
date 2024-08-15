export class PageManager {
    constructor(app) {
        this.app = app;
        this.array = [];
    }

    get(url) {
        const page = this.array.find(s => s.link === url);
        if(page){
            return page;
        } else {
            console.error('%c[NEXS.JS] ', 'color: red', `Page [${url}] not found.`);
            return null;
        }
    }

    defineNew(page = { link, layout, block, type, func }) {
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
        if (!this.get('/404')) {
            console.error('%c[NEXS.JS] ', 'color: red', 'No 404 Page set!');
            return;
        }
    
        let whatToRenderNow = sectionToRenderName || this.app.sectionToRender;

        if (!whatToRenderNow) {
            console.error('%c[NEXS.JS] ', 'color: red', 'No section to render. Either a deafult section to render or 2nd argument (section name) must be set.');
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
            if (!layout) {
                await this.render('/404');
                return;
            }
            await this.app.layouts.render(page.layout);
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
            await this.app.sections.render(this.app.sectionToRender, page.block);
        }
        return this.app.body;
    }
}