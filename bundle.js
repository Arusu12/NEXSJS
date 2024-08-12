var NEXSJS = (function () {
    'use strict';

    class Animate{
        constructor(app) {
            this.app = app;
            this.availableAnimations = [];
        }
        
        section(section, animation) {
            if (this.availableAnimations.includes(animation)) {
                const section = this.app.sections.get(section);
                if (section) {
                    section.classList.add(animation);
                } else {
                    console.log('Section for animation does not exist!');
                }
            } else {
                console.log('Animation not available!');
            }
        }
    }

    class apiManager {
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

    class BlockManager {
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

    class EasyBlocks{
        constructor(instance) {
            this.app = instance;
        }

        convertToNode(code) {
            const node = document.createElement('div');
            node.innerHTML = code;
            return node.firstElementChild;
        }
        
        newLink(url, value, classes) {
            return `<a ${url ? `href="${url}"` : ''} ${classes ? `class="${classes}"` : ''}>${value}</a>`;
        }
        
        newLinks(links, classes) {
            return links.map(a => this.newLink(a.url, a.body, classes)).join('\n');
        }
        
        newInput(type, name, classes, placeholder, value) {
            return `<input ${type ? `type="${type}"` : ''} ${name ? `name="${name}"` : ''} ${classes ? `class="${classes}"` : ''} ${placeholder ? `placeholder="${placeholder}"` : ''} ${value ? `value="${value}"` : ''}>`;
        }
        
        newImage(url, classes, alt) {
            return `<img ${url ? `src="${url}"` : ''} ${classes ? `class="${classes}"` : ''} ${alt ? `alt="${alt}"` : ''}>`;
        }
        
        newBlock(tag, value, classes) {
            return `<${tag} ${classes ? `class="${classes}"` : ''}>${value}</${tag}>`;
        }
        
        newBlocks(values, tag, classes) {
            return values.map(a => this.newBlock(tag, a, classes)).join('\n');
        }
        
        newButton(type, value, classes) {
            return `<button ${type ? `type="${type}"` : ''} ${classes ? `class="${classes}"` : ''}>${value}</button>`;
        }
        
        newButtons(buttons, classes) {
            return buttons.map(b => this.newButton(b.type, b.body, classes)).join('\n');
        }
        
        newTextarea(name, classes, placeholder, value) {
            return `<textarea ${name ? `name="${name}"` : ''} ${classes ? `class="${classes}"` : ''} ${placeholder ? `placeholder="${placeholder}"` : ''}>${value ? `${value}` : ''}</textarea>`;
        }
        
        newForm(action, method, classes, content) {
            return `<form ${action ? `action="${action}"` : ''} ${method ? `method="${method}"` : ''} ${classes ? `class="${classes}"` : ''}>${content}</form>`;
        }
        
        newSelect(name, options, classes) {
            return `<select ${name ? `name="${name}"` : ''} ${classes ? `class="${classes}"` : ''}>
          ${options.map(option => `<option value="${option.value}">${option.label}</option>`).join('\n')}
        </select>`;
        }
        
        newList(items, ordered, classes) {
            const tag = ordered ? 'ol' : 'ul';
            return `<${tag} ${classes ? `class="${classes}"` : ''}>
          ${items.map(item => `<li>${item}</li>`).join('\n')}
        </${tag}>`;
        }
        
        newTable(headers, rows, classes) {
            return `<table ${classes ? `class="${classes}"` : ''}>
          <thead>
            <tr>${headers.map(header => `<th>${header}</th>`).join('\n')}</tr>
          </thead>
          <tbody>
            ${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('\n')}</tr>`).join('\n')}
          </tbody>
        </table>`;
        }
    }

    class NEXS_Helper{
        constructor(instance) {
            this.app = instance;
        }

        matchDynamicPath(link) {
            for (const page of this.app.pages.array) {
                const { match, params } = this.pathToRegex(page.link).exec(link);
                if (match) {
                    return { page, params };
                }
            }
            return null;
        }
        
        pathToRegex(path) {
            const regexStr = path.replace(/:[^\s/]+/g, '([^\\/]+)');
            const regex = new RegExp(`^${regexStr}\\/?$`);
            return {
                exec: (link) => {
                    const match = link.match(regex);
                    if (match) {
                        const params = {};
                        const keys = path.match(/:[^\s/]+/g);
                        if (keys) {
                            keys.forEach((key, index) => {
                                params[key.substring(1)] = match[index + 1];
                            });
                        }
                        return { match, params };
                    }
                    return { match: null, params: {} };
                }
            };
        }

        waitAndGo(funct, ms) {
            setTimeout(funct, ms);
        }

        goBack() {
            window.history.back();
        }

        checkInput(value, { defaultValue, valueScope }) {
            if (value === undefined || value === null || value === '') return defaultValue;
            if (valueScope && !valueScope.includes(value)) return defaultValue;
            return value;
        }

        async renderSyntax(template, data) {
            const regex = /\@\{\{([^}]+)\}\}/g;
        
            const renderValue = (key) => {
                const keys = key.split('.');
                let value = data;
        
                for (const k of keys) {
                    value = value[k] !== undefined ? value[k] : '';
                }
        
                if (typeof value === 'object') {
                    return Array.isArray(value) ? value.map(item => JSON.stringify(item)).join(', ') : JSON.stringify(value, null, 2);
                }
                return value;
            };
        
            return template.replace(regex, (match, key) => renderValue(key));
        }

        setCookie(name, value, days) {
            let expires = "";
            if (days) {
                let date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        }

        getCookie(name) {
            let nameEQ = name + "=";
            let cookiesArray = document.cookie.split(';');
            for (let i = 0; i < cookiesArray.length; i++) {
                let cookie = cookiesArray[i].trim();
                if (cookie.indexOf(nameEQ) === 0) {
                    return cookie.substring(nameEQ.length, cookie.length);
                }
            }
            return null;
        }
    }

    class LayoutManager {
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

    class Loader{
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

    class PageManager {
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
            } else if (page.type === 'popup') ; else if (page.type === 'ws') {
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

    class SectionManager {
        constructor(app) {
            this.app = app;
            this.array = [];
        }

        get(name) {
            const section = this.array.find(s => s.name == name);
            return section ? section.code : `Section ${name} not found.`;
        }

        defineNew(name, code) {
            const section = { name, code, layout: this.app.currentLayout };
            this.array.push(section);
            return section;
        }

        async render(section, block, data) {
            const sectionElement = this.get(section);
            const blockElement = this.app.blocks.get(block);
            if (!sectionElement) {
                console.error('%c[NEXS.JS] ', 'color: red', 'Section not found.');
                return;
            }
            if (!this.app.currentLayout) {
                console.error('%c[NEXS.JS] ', 'color: red', 'Layout needs to be initialized for sections to be available.');
                return;
            }
            if (!blockElement) {
                console.error('%c[NEXS.JS] ', 'color: red', `Block named [${block}] not found.`);
                return;
            }
        
            let renderedBlock = await this.app.helper.renderSyntax(blockElement, { ...data, user: this.app.user.data });
        
            if (sectionElement) {
                if (!sectionElement.getAttribute('onclick')) {
                    sectionElement.setAttribute('onclick', '');
                }
                sectionElement.innerHTML = renderedBlock;
            } else {
                console.error('%c[NEXS.JS] ', 'color: red', 'Cannot set innerHTML because sectionElement or sectionElement.code is null.');
            }
            return sectionElement;
        }
    }

    class userManager {
        constructor(app) {
            this.app = app;
            this.data = {};
        }

        async set(userAPIEndpoint) {
            try {
                const response = await fetch(userAPIEndpoint, { method: 'POST' });
                if (!response.ok) throw new Error('Error getting data from API.');
        
                const data = await response.json();
                if (data.UID) {
                    this.data = data;
                    return data.name;
                } else {
                    console.warn('Not logged in. Continuing with no user data.');
                    return 'Not logged in. Continuing with no user data.';
                }
            } catch (error) {
                console.error('%c[NEXS.JS] ', 'color: red', error.message);
            }
        }

        setManually(name, UID, pfp){
            this.data = { name, UID, pfp };
        }

        setLocally() {
            const setName = this.app.helper.getCookie('userName');
            const setUID = this.app.helper.getCookie('userUID');
            const setPFP = this.app.helper.getCookie('userPfp');

            if(setUID){
                this.setManually(setName, parseInt(setUID, 10), setPFP);
                return;
            }


            const userName = prompt("Enter your name:");
            const userUID = prompt("Enter your UID (random):");
            const userEmail = prompt("Enter your profile picture link:");
        
            if (userName && userUID && userEmail) {
                this.setManually(userName, parseInt(userUID, 10), userEmail);
        
                // Save to cookies for 7 days for testing
                this.app.helper.setCookie('userName', userName, 7);
                this.app.helper.setCookie('userUID', userUID, 7);
                this.app.helper.setCookie('userPfp', userEmail, 7);
        
                alert("User details saved successfully!");
            } else {
                alert("All fields are required!");
            }
        }
    }

    class Listener{
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

    class NEXSJS {
      constructor() {
        this.initialized = true;
        this.currentLayout = '';
        this.sectionToRender = '';
        this.body = '';

        this.animations = new Animate(this);
        this.loader = new Loader(this);
        this.user = new userManager(this);
        this.api = new apiManager(this);

        this.pages = new PageManager(this);
        this.layouts = new LayoutManager(this);
        this.sections = new SectionManager(this);
        this.blocks = new BlockManager(this);

        this.listener = new Listener(this);
        this.block = new EasyBlocks(this);
        this.helper = new NEXS_Helper(this);
      }

      init(theme = { bgColor: '#333', bgImageUrl: '', opacity: 0.8 }, layout) {
        this.loader.css();
        this.loader.theme(theme);
        this.loader.prepare(layout);
      }
    }

    return NEXSJS;

})();
