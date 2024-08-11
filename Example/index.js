import NEXSJS from 'https://arusu12.github.io/NEXSJS/nexs.js'
import { layouts, pages, blocks } from './data.js';

const app = new NEXSJS();

app.init({ bgColor: "#333333", opacity:'1' }, 'row');
app.user.setLocally();

async function renderSite() {
    layouts.forEach(l=>{ app.layouts.defineNew(l.name, l.code) })
    blocks.forEach(b=>{ app.blocks.defineNew(b.name, b.code) })
    pages.forEach(p=>{ app.pages.defineNew({name: p.name, link: p.link, block: p.block, type: p.type}) })
    // await app.layouts.defineFromAPI('/nexs/api/layouts');
    // await app.blocks.defineFromAPI('/nexs/api/blocks');
    // await app.pages.defineFromAPI('/nexs/api/pages');

    await app.layouts.render('main');

    app.sections.defineNew('navbar', app.body.querySelector('.navbar'));
    app.sections.defineNew('content', app.body.querySelector('.chat-container'));

    app.sections.render('navbar', 'navbar');

    await app.pages.render('', 'content');
    app.listener.init();
    window.app = app;
}

renderSite();