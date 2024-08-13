export class Listener{
    constructor(app) {
        this.app = app;
        this.events = [];
    }

    init() {
        window.removeEventListener('popstate', this.handlePopstate);
        this.handlePopstate = async () => { await this.app.pages.render(window.location.pathname) };
        window.addEventListener('popstate', this.handlePopstate);
    
        this.app.body.querySelectorAll('a').forEach(a => {
            a.replaceWith(a.cloneNode(true));
        });
    
        this.app.body.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', async (e) => {
                e.preventDefault();
                const href = a.getAttribute('href');
                if (!href) return;
    
                const clickedLink = href.startsWith('/') ? new URL(window.origin + href) : new URL(href);
                if (a.classList.contains('nexs-popup')) {
                    await this.app.pages.render(window.location.pathname);
                    console.log('Clicked on popup!');
                } else if (clickedLink.origin !== window.origin) {
                    location.href = href;
                } else {
                    history.pushState({}, '', href);
                    await this.app.render.page(href);
                }
            });
        });
    }    

    setOnClickRender(element, sectionName, blockName) {
        const section = this.app.sections.get(sectionName);
        const event = { element: element, section: section, block: blockName };
        
        if (!this.events.some(e => e.element === element && e.section === section && e.block === blockName)) {
            this.events.push(event);
            this.renderOnClick(event);
        }
        return true;
    }
    
    renderOnClick(event) {
        if (event.element) {
            event.element.addEventListener('click', async () => {
                this.app.sections.render(event.section, event.block);
            });
        }
    }    

    overlay(overlay){
        if (overlay) {
            overlay.addEventListener('click', (event) => {
                if (event.target.classList.contains('visible')) {
                    event.stopPropagation();
                    overlay.innerHTML = '';

                    // Needs update, not usable right now and may cause errors
                    if (this.app.sections.get('navbar').classList.contains('expand')) {
                        this.app.sections.get('menu-button').click();
                    }
                }
            });
        } else {
            console.error('%c[NEXS.JS] ', 'color: red', `Overlay element not defined!`);
        }
    }
    
    interactiveNavigation(sectionName, blockClassName, highlightColor) {
        function manageNav(open, navList, items) {
            navList.forEach(i => i.classList.remove('active'));
            document.querySelector(`div.user-section#${open.getAttribute('section')}`).classList.remove('hide-section');
            open.classList.add('active');
        }
    
        document.querySelectorAll('.user-sections div').forEach(a => {
            a.addEventListener('click', () => {
                manageNav(a, document.querySelectorAll('.user-sections div'), document.querySelectorAll('div.user-section'));
            });
        });
        manageNav(document.querySelector('.user-sections div'), document.querySelectorAll('.user-sections div'), document.querySelectorAll('div.user-section'));
    }
}