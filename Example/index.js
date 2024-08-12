import NEXSJS from 'https://arusu12.github.io/NEXSJS/nexs.js'
import { layouts, pages, blocks } from './data.js';
// NEXSJS is a modular and component based framework that allows you to predefine and save parts of your code as component and later render them with data using API.
// @{{data}} is the data syntax that the framework renders, and only JSON will be rendered. It is part of section and page rendering.
// app.sections.render('navbar', 'navbar');

// You can also manually render syntax although it is not very used.
// await app.helper.renderSyntax('This is how @{{ data.type }} is rendered.', { data });

// Create an instance of the framework that acts as the web-application.
const app = new NEXSJS();

// Initialize the application. This creates an #app HTMLElement within body with simple theme. Second parameter appoints a class name to #app.
app.init({ bgColor: "#333333", opacity:'1' }, 'flex-row');

app.user.setLocally(); // Set example user data with the help of cookies using JavaScript prompts.
// app.user.set(); // Gets basic user data from API that is later used while rendering.
// app.user.setManually(); // Set user JSON data directly just like set() but without API

async function renderSite() {
    // Easily call API endpoints by only passing an url.
    // app.api.post();
    // app.api.get();

    // Easy way to interact with cookies
    // app.helper.setCookie('name', 'value', 'days');
    // app.helper.getCookie('name');

    // Loading layouts, blocks, and pages from local data arrays
    // Use forEach to populate pages, layouts and blocks on the frontend.
    layouts.forEach(l=>{ app.layouts.defineNew(l.name, l.code) });
    blocks.forEach(b=>{ app.blocks.defineNew(b.name, b.code) });
    pages.forEach(p=>{ app.pages.defineNew({name: p.name, link: p.link, block: p.block, type: p.type}) });

    // Optionally, you could define these from an API
    // await app.layouts.defineFromAPI('/nexs/api/layouts');
    // await app.blocks.defineFromAPI('/nexs/api/blocks');
    // await app.pages.defineFromAPI('/nexs/api/pages');

    // Simply print the predefined layout after getting it by name
    await app.layouts.render('main');

    // Sections must be defined after rendering a layout. They contain the HTMLElement, not the code as a string so they can be easily manipulated.
    app.sections.defineNew('navbar', app.body.querySelector('.navbar'));
    app.sections.defineNew('content', app.body.querySelector('.chat-container'));

    // Rendering a section means you render a block within a section. Arguments are (sectionName, blockName, jsonDataToRenderIfThereIsAny).
    app.sections.render('navbar', 'navbar');

    // Render a page. Arguments take (PageParameters, setDefaultSectionToRender).
    await app.pages.render('', 'content');

    // Runs event listeners that modifies the click interaction with hyperlinks (<a>) to dynamically render pages.
    app.listener.init();

    // Set the app scope globally to easily work along with other JavaScript files.
    window.app = app;
}

renderSite();

// How the framework works in summary
// Initialize NEXS and app using init(). It creates a dedicated Element that can be accessed through app.body and applies simple theme and a class to it.
// You can write your own css of that class. There is predefined classes 'flex-row' and 'flex-column' for quick start.
// Set basic user data using app.user functionalities for UI rendering.
// Define layouts, pages, sections and blocks.
// Pages are what defines routing for the frontend. There are different types of pages - static, ws, popup, func. They all have different functionalities.
// const page = [
//     { link: '/', layout: 'main', block: 'home', type: 'static' },
//     { link: '/ws', layout: 'main', block: 'ws', type: 'ws', event: "ping", value: { reply: "Pong!" } },
//     { link: 'http', layout: 'main', block: 'http', type: 'http' },
//     { link: '/popup', layout: 'main', block: 'popup', type: 'popup' },
//     { link: '/NEXSJS/js', layout: 'main', block: 'home', type: 'func', func: "renderPage()" },
//     { link: '/404', layout: 'main', block: '404', type: 'static' }
// ]
// Static just renders the block associated with it.
// WS just emits preset data to websocket from frontend.
// HTTP gets data from the same api endpoint using POST method and uses it to render specified block.
// Popup shows a specified block on overlay.
// Func executes a function after rendering the specified block.

// Blocks are small pieces of html code in string format.
// Sections are parent elements or locations where blocks will be rendered.

// Set a default section (typically the page content body) after defining sections.
// app.sections.setDefaultSection('nameOfSection')

// It is possible to set click event listener on html elements to render a block.
// app.listeners.setOnClickRender(elementThatWillRenderOnClick, sectionNameWhereItWillRender, blockNameWhatWillBeRendered);

// await app.pages.render('', 'sectionNameWhereThisPageShallRenderBypassingDefault');
// The function above makes use of other managers to render defined page routes. It also uses history.pushState() 