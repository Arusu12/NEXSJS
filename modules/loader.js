export class Loader{
    constructor(app) {
        this.app = app;
        this.files = { 'css':'https://arusu12.github.io/NEXSJS/nexs.css' };
    }
    
    css() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = this.files['css'];
        document.head.appendChild(link);
    }
    
    theme({ bgColor, bgImageUrl, opacity, fontColor }) {
        const root = document.documentElement;
        root.style.setProperty('--bg-color', bgColor || '#333');
        root.style.setProperty('--bg', bgImageUrl ? `url('${bgImageUrl}')` : '');
        root.style.setProperty('--bg-opacity', opacity != null ? 1 - opacity : 1);
        root.style.setProperty('--font-color', fontColor || 'black');
        console.log('%c[NEXS.JS] ', 'color: #365BFF', 'Theme Rendered');
    }
    
    prepare(layout) {
        const app = document.createElement('div');
        app.id = 'app';
        app.classList.add(layout || 'col');
        if (!layout) {
            console.error('%c[NEXS.JS] ', 'color: red', 'Application is missing layout property!');
        }
        document.body.appendChild(app);
        this.app.body = app;
    }
}