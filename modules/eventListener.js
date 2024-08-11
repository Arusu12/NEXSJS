export class Listener{
    constructor(app) {
        this.app = app;
    }

    init(overlay) {
        if (overlay) {
            document.getElementById('overlay').addEventListener('click', (event) => {
                if (event.target.classList.contains('visible')) {
                    event.stopPropagation();
                    document.getElementById('overlay').innerHTML = '';
                    if (this.app.sections.get('navbar').classList.contains('expand')) {
                        this.app.sections.get('menu-button').click();
                    }
                }
            });
        }
    
        window.addEventListener('popstate', async () => {
            await this.app.render.page(window.location.pathname);
        });
    
        this.app.body.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', async (e) => {
                e.preventDefault();
                const href = a.getAttribute('href');
                if (!href) return;
    
                const clickedLink = href.startsWith('/') ? new URL(window.origin + href) : new URL(href);
                if (a.classList.contains('nexs-popup')) {
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