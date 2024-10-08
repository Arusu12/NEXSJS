# NEXSJS Framework
## We had a major section update so the documentation is outdated.

NEXSJS is a modular and component-based JavaScript framework designed to simplify the development of web applications. It allows developers to predefine and save parts of their code as components (layouts, blocks, and pages), which can later be rendered with data using APIs. The framework also supports dynamic rendering, event handling, and state management.

## Table of Contents

- [Installation](#installation)
- [Getting Started](#getting-started)
- [Core Concepts](#core-concepts)
  - [Layouts](#layouts)
  - [Blocks](#blocks)
  - [Pages](#pages)
  - [Sections](#sections)
- [User Management](#user-management)
- [Rendering Components](#rendering-components)
- [API Interaction](#api-interaction)
- [Event Listeners](#event-listeners)
- [Global Scope](#global-scope)
- [Summary](#summary)

## Installation

To start using NEXSJS in your project, include it in your JavaScript file by importing it from the provided URL or local file url.

```javascript
import NEXSJS from 'https://arusu12.github.io/NEXSJS/nexs.js';
import { layouts, pages, blocks } from './data.js';
```

### Example `data.js` Structure

The `data.js` file should contain arrays that define your layouts, pages, and blocks. We are doing it on frontend for example but practice doing this on backend use API method.

```javascript
export const layouts = [
  { name: 'main', code: '<div class="navbar"></div><div class="chat-container"></div>' }
];

export const pages = [
  { name: 'home', link: '/', block: 'home', type: 'static' }
];

export const blocks = [
  { name: 'navbar', code: '<nav>Navbar content here</nav>' },
  { name: 'home', code: '<div>Home page content here</div>' }
];
```

## Getting Started

To begin using NEXSJS, create an instance of the framework:

```javascript
const app = new NEXSJS();
```

Initialize the application with optional settings, such as background color and opacity, and assign a class to the root element:

```javascript
app.init({ bgColor: "#333333", opacity: '1' }, 'flex-row');
```

## Core Concepts

### Layouts

Layouts define the overall structure or skeleton of your web pages. They are reusable templates that can contain various sections where content will be injected.

#### Defining a Layout

Use the `defineNew` method to define a layout:

```javascript
layouts.forEach(l => { 
    app.layouts.defineNew(l.name, l.code); 
});
```

#### Rendering a Layout

Render a layout using the `render` method:

```javascript
await app.layouts.render('main');
```

### Blocks

Blocks are smaller pieces of HTML code or UI components. They can be used within different sections of your application and are often reusable.

#### Defining a Block

Use the `defineNew` method to define a block:

```javascript
blocks.forEach(b => { 
    app.blocks.defineNew(b.name, b.code); 
});
```

### Pages

Pages tie together layouts and blocks, defining routes for the frontend. Each page can render specific blocks within defined sections.

#### Defining a Page

Use the `defineNew` method to define a page:

```javascript
pages.forEach(p => { 
    app.pages.defineNew({name: p.name, link: p.link, block: p.block, type: p.type}); 
});
```

#### Rendering a Page

Render a page using the `render` method:

```javascript
await app.pages.render('', 'content');
```

### Sections

Sections are parts of the layout where blocks are rendered. Sections are defined after rendering a layout and are linked to specific elements in the DOM.

#### Defining a Section

Use the `defineNew` method to define a section, for example:

```javascript
app.sections.defineNew('navbar', app.body.querySelector('.navbar'));
app.sections.defineNew('content', app.body.querySelector('.chat-container'));
```

#### Rendering a Block in a Section

Render a block within a section using the `render` method:

```javascript
app.sections.render('navbar', 'navbar');
```

## User Management

NEXSJS provides various methods to handle user data, either locally using cookies or by fetching data from an API.

#### Set User Data Locally

```javascript
app.user.setLocally();
```

#### Set User Data from API

```javascript
app.user.set(); // Fetches user data from an API
```

#### Manually Set User Data

```javascript
app.user.setManually();
```

## Rendering Components

Rendering in NEXSJS is done dynamically, allowing you to update sections of your web application based on user interaction or API data.

#### Render a Layout

```javascript
await app.layouts.render('main');
```

#### Render a Block in a Section

```javascript
app.sections.render('navbar', 'navbar');
```

#### Render a Page in a Specific Section

```javascript
await app.pages.render('', 'content');
```

## API Interaction

NEXSJS simplifies interaction with APIs by providing built-in methods for GET and POST requests.

#### GET Request

```javascript
app.api.get('/api/endpoint');
```

#### POST Request

```javascript
app.api.post('/api/endpoint', { key: 'value' });
```

## Event Listeners

NEXSJS can dynamically handle user interactions with built-in event listeners. These listeners can modify interactions with hyperlinks and other elements to dynamically render content.

#### Initialize Event Listeners

```javascript
app.listener.init();
```

#### Set Click Event Listener

```javascript
app.listeners.setOnClickRender(element, 'sectionName', 'blockName');
```

## Global Scope

To make the `app` instance globally accessible in other JavaScript files, you can assign it to the `window` object:

```javascript
window.app = app;
```

## Summary

1. **Initialize NEXSJS**: Create an instance and initialize the app.
2. **Define Layouts, Blocks, and Pages**: Set up your components using `defineNew`.
3. **Render Components**: Use `render` methods to display layouts, blocks, and pages.
4. **Manage User Data**: Set user data either locally or through APIs.
5. **Interact with APIs**: Use built-in methods for API requests.
6. **Handle Events**: Set up event listeners for dynamic content rendering.
7. **Global Scope**: Make `app` globally accessible if needed.