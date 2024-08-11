export class apiManager {
    constructor(app) {
        this.app = app;
    }

    async post(url) {
        try {
            const response = await fetch(url, { method: 'POST' });
            if (!response.ok) throw new Error('Error getting data from URL.');
    
            return await response.json();
        } catch (error) {
            console.error('%c[NEXS.JS] ', 'color: red', error.message);
        }
    }
    async get(url) {
        try {
            const response = await fetch(url, { method: 'GET' });
            if (!response.ok) throw new Error('Error getting data from URL.');
    
            return await response.json();
        } catch (error) {
            console.error('%c[NEXS.JS] ', 'color: red', error.message);
        }
    }
}