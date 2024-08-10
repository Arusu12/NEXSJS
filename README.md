# NEXS.JS Documentation

NEXS.JS is a versatile JavaScript framework designed to simplify the creation of dynamic and interactive web applications. Built with flexibility and modularity in mind, NEXS.JS allows developers to seamlessly manage layouts, sections, and content blocks while providing robust tools for API integration and theme customization.

## Key Features

- **Modular Architecture**: NEXS.JS organizes your application into distinct components—pages, layouts, sections, and blocks—enabling easy maintenance and scalability.
- **Dynamic Content Rendering**: Effortlessly fetch and display content from APIs or user data, with built-in support for dynamic routing and path matching.
- **Customizable Themes**: Tailor the look and feel of your application with configurable themes, including background images, colors, opacity, and font styles.
- **Utility Functions**: Generate HTML elements like tables, forms, buttons, and more using a rich set of utility functions, ensuring consistency and reducing boilerplate code.
- **Animation Support**: Enhance user experience with predefined animations, such as `fadeInFromLeft`, with the potential for future expansion.
- **Interactive Navigation**: Create engaging, user-friendly navigation experiences with built-in support for interactive elements and overlays.

## Ideal For

NEXS.JS is perfect for developers looking to build modern, responsive web applications that require dynamic content management and a high degree of customization. Whether you're working on a small project or a large-scale application, NEXS.JS provides the tools you need to bring your ideas to life.

## Installation

To use NEXS.JS in your project, include the `nexs.js` file in your HTML file:

```html
<script src="path/to/nexs.js"></script>
```

## Usage

Here's a basic example of how to use NEXS.JS to initialize an application with a theme and layout:

```javascript
const app = new NEXSJS();
app.init({ bgColor: '#333', bgImageUrl: '', opacity: 0.8 }, 'row');
```

## Table of Contents

- [API Reference](#api-reference)
  - [Constructor](#constructor)
  - [init](#init)
  - [loadCSS](#loadcss)
  - [loadTheme](#loadtheme)
  - [loadApp](#loadapp)
  - [setUser](#setuser)
  - [defineNewPage](#definenewpage)
  - [definePagesFromAPI](#definepagesfromapi)
  - [definePageLoaderStripe](#definepageloaderstripe)
  - [defineNewLayout](#definenewlayout)
  - [defineLayoutsFromAPI](#definelayoutsfromapi)
  - [defineNewSection](#definenewsection)
  - [defineBlock](#defineblock)
  - [getLayout](#getlayout)
  - [getBlock](#getblock)
  - [getSection](#getsection)
  - [requestPOST](#requestpost)
  - [renderLayout](#renderlayout)
  - [renderSection](#rendersection)
  - [renderSyntax](#rendersyntax)
  - [initListeners](#initlisteners)
  - [render](#render)
  - [matchDynamicPath](#matchdynamicpath)
  - [pathToRegex](#pathtoregex)
  - [checkInput](#checkinput)
  - [animateSection](#animatesection)
  - [interactiveNavigation](#interactivenavigation)
  - [waitAndGo](#waitandgo)
  - [newLink](#newlink)
  - [newLinks](#newlinks)
  - [newInput](#newinput)
  - [newImage](#newimage)
  - [newBlock](#newblock)
  - [newBlocks](#newblocks)
  - [newButton](#newbutton)
  - [newButtons](#newbuttons)
  - [newTextarea](#newtextarea)
  - [newForm](#newform)
  - [newSelect](#newselect)
  - [newList](#newlist)
  - [newTable](#newtable)

## API Reference

### Constructor

- Creates a new instance of the NEXSJS class.

```javascript
const app = new NEXSJS();
```

### init

- Initializes the application with a theme and layout.

```javascript
app.init(theme, layout);
```

- **Parameters:**
  - `theme` (Object, optional): Theme settings. Defaults to `{ bgColor: '#333', bgImageUrl: '', opacity: 0.8 }`.
  - `layout` (string): Layout style ('row' or 'col').

### loadCSS

- Loads the CSS file for the NEXS.JS library.

```javascript
app.loadCSS();
```

### loadTheme

- Loads the theme for the application.

```javascript
app.loadTheme(theme);
```

- **Parameters:**
  - `theme` (Object): Theme settings.
    - `bgColor` (string, optional): Background color. Defaults to '#333'.
    - `bgImageUrl` (string, optional): Background image URL.
    - `opacity` (number, optional): Background opacity. Defaults to 0.8.
    - `fontColor` (string, optional): Font color. Defaults to 'black'.

### loadApp

- Loads the application layout.

```javascript
app.loadApp(layout);
```

- **Parameters:**
  - `layout` (string): Layout style ('row' or 'col').

### setUser

- Sets the user data for the application by making a POST request to a user API endpoint.

```javascript
app.setUser(userAPIEndpoint);
```

- **Parameters:**
  - `userAPIEndpoint` (string): User API endpoint.

### defineNewPage

- Defines a new page for the application.

```javascript
app.defineNewPage(page);
```

- **Parameters:**
  - `page` (Object, optional): Page settings.
    - `link` (string): Page link.
    - `layout` (string): Page layout.
    - `block` (string): Page block.
    - `type` (string): Page type.

### definePagesFromAPI

- Defines pages for the application by making a POST request to an API endpoint.

```javascript
app.definePagesFromAPI(link);
```

- **Parameters:**
  - `link` (string): API endpoint.

### definePageLoaderStripe

- Defines the page loader stripe for the application.

```javascript
app.definePageLoaderStripe(code);
```

- **Parameters:**
  - `code` (string): Page loader stripe code.

### defineNewLayout

- Defines a new layout for the application.

```javascript
app.defineNewLayout(name, code);
```

- **Parameters:**
  - `name` (string): Layout name.
  - `code` (string): Layout code.

### defineLayoutsFromAPI

- Defines layouts for the application by making a POST request to an API endpoint.

```javascript
app.defineLayoutsFromAPI(link);
```

- **Parameters:**
  - `link` (string): API endpoint.

### defineNewSection

- Defines a new section for the application.

```javascript
app.defineNewSection(name, code);
```

- **Parameters:**
  - `name` (string): Section name.
  - `code` (string): Section code.

### defineBlock

- Defines a new block for the application.

```javascript
app.defineBlock(name, code);
```

- **Parameters:**
  - `name` (string): Block name.
  - `code` (string): Block code.

### getLayout

- Retrieves the layout code for a given layout name.

```javascript
const layoutCode = app.getLayout(name);
```

- **Parameters:**
  - `name` (string): Layout name.

### getBlock

- Retrieves the block code for a given block name.

```javascript
const blockCode = app.getBlock(name);
```

- **Parameters:**
  - `name` (string): Block name.

### getSection

- Retrieves the section code for a given section name.

```javascript
const sectionCode = app.getSection(name);
```

- **Parameters:**
  - `name` (string): Section name.

### requestPOST

- Makes a POST request to a given URL and returns the response data.

```javascript
const responseData = await app.requestPOST(url);
```

- **Parameters:**
  - `url` (string): URL to make the POST request to.

### renderLayout

- Renders the layout for the application.

```javascript
app.renderLayout(name);
```

- **Parameters:**
  - `name` (string): Layout name.

### renderSection

- Renders a section for the application.

```javascript
app.renderSection(section, block, data);
```

- **Parameters:**
  - `section` (string): Section name.
  - `block` (string): Block name.
  - `data` (Object, optional): Data to render in the section.

### renderSyntax

- Renders syntax in a template string using data.

```javascript
const renderedTemplate = app.renderSyntax(template, data);
```

- **Parameters:**
  - `template` (string): Template string with syntax.
  - `data` (Object): Data to render in the template.

### initListeners

- Initializes event listeners for the application.

```javascript
app.initListeners(overlay);
```

- **Parameters:**
  - `overlay` (boolean, optional): Whether to initialize the overlay listener. Defaults to `false`.

### render

- Renders the application based on the given link and rendered section name.

```javascript
app.render(link, renderedSectionName);
```

- **Parameters:**
  - `link` (string, optional): Link to render. Defaults to the current window location pathname.
  - `renderedSectionName` (string, optional): Rendered section name. Defaults to the current rendered section name.

### matchDynamicPath

- Matches a dynamic path to a page in the application.

```javascript
const match = app.matchDynamicPath(link);
```

- **Parameters:**
  - `link` (string): Link to match.

### pathToRegex

- Converts a path string to a regular expression.

```javascript
const regex = app.pathToRegex(path);
```

- **Parameters:**
  - `path` (string): Path string.

### checkInput

- Checks the input value based on the given options.

```javascript
const checkedValue = app.checkInput(value, options);
```

- **Parameters:**
  - `value` (any): Input value to check.
  - `options` (Object): Options for checking the input value.
    - `defaultValue` (any): Default value to return if the input value is invalid.
    - `valueScope` (Array, optional): Array of valid values for the input value.

### animateSection

- Applies an animation to a section in the application.

```javascript
app.animateSection(sectionName, animationName);
```

- **Parameters:**
  - `sectionName` (string): Section name.
  - `animationName` (string): Animation name.

### interactiveNavigation

- Manages interactive navigation for the application.

```javascript
app.interactiveNavigation(sectionName, blockClassName, highlightColor);
```

- **Parameters:**
  - `sectionName` (string): Section name.
  - `blockClassName` (string): Block class name.
  - `highlightColor` (string): Highlight color.

### waitAndGo

- Executes a function after a specified delay.

```javascript
app.waitAndGo(funct, ms);
```

- **Parameters:**
  - `funct` (Function): Function to execute.
  - `ms` (number): Delay in milliseconds.

### newLink

- Creates an anchor tag.

```javascript
const linkHTML = app.newLink(url, value, classes);
```

- **Parameters:**
  - `url` (string, optional): URL for the anchor tag.
  - `value` (string): Display text for the anchor tag.
  - `classes` (string, optional): CSS classes for the anchor tag.

### newLinks

- Creates multiple anchor tags.

```javascript
const linksHTML = app.newLinks(links, classes);
```

- **Parameters:**
  - `links` (Array): Array of objects containing URL and body text for each link.
  - `classes` (string, optional): CSS classes for the anchor tags.

### newInput

- Creates an input field.

```javascript
const inputHTML = app.newInput(type, name, classes, placeholder, value);
```

- **Parameters:**
  - `type` (string, optional): Type of the input field.
  - `name` (string, optional): Name attribute for the input field.
  - `classes` (string, optional): CSS classes for the input field.
  - `placeholder` (string, optional): Placeholder text for the input field.
  - `value` (string, optional): Value attribute for the input field.

### newImage

- Creates an image tag.

```javascript
const imageHTML = app.newImage(url, classes, alt);
```

- **Parameters:**
  - `url` (string, optional): URL for the image source.
  - `classes` (string, optional): CSS classes for the image.
  - `alt` (string, optional): Alt text for the image.

### newBlock

- Creates a block element.

```javascript
const blockHTML = app.newBlock(tag, value, classes);
```

- **Parameters:**
  - `tag` (string): HTML tag for the block element.
  - `value` (string): Inner HTML content of the block element.
  - `classes` (string, optional): CSS classes for the block element.

### newBlocks

- Creates multiple block elements.

```javascript
const blocksHTML = app.newBlocks(values, tag, classes);
```

- **Parameters:**
  - `values` (Array): Array of inner HTML content for each block element.
  - `tag` (string): HTML tag for the block elements.
  - `classes` (string, optional): CSS classes for the block elements.

### newButton

- Creates a button element.

```javascript
const buttonHTML = app.newButton(type, value, classes);
```

- **Parameters:**
  - `type` (string, optional): Type attribute for the button.
  - `value` (string): Display text for the button.
  - `classes` (string, optional): CSS classes for the button.

### newButtons

- Creates multiple button elements.

```javascript
const buttonsHTML = app.newButtons(buttons, classes);
```

- **Parameters:**
  - `buttons` (Array): Array of objects containing type and body text for each button.
  - `classes` (string, optional): CSS classes for the button elements.

### newTextarea

- Creates a textarea element.

```javascript
const textareaHTML = app.newTextarea(name, classes, placeholder, value);
```

- **Parameters:**
  - `name` (string, optional): Name attribute for the textarea.
  - `classes` (string, optional): CSS classes for the textarea.
  - `placeholder` (string, optional): Placeholder text for the textarea.
  - `value` (string, optional): Inner HTML content for the textarea.

### newForm

- Creates a form element.

```javascript
const formHTML = app.newForm(action, method, classes, content);
```

- **Parameters:**
  - `action` (string, optional): Action attribute for the form.
  - `method` (string, optional): Method attribute for the form.
  - `classes` (string, optional): CSS classes for the form.
  - `content` (string): Inner HTML content of the form.

### newSelect

- Creates a select dropdown element.

```javascript
const selectHTML = app.newSelect(name, options, classes);
```

- **Parameters:**
  - `name` (string, optional): Name attribute for the select element.
  - `options` (Array): Array of objects containing value and label for each option.
  - `classes` (string, optional): CSS classes for the select element.

### newList

- Creates a list element.

```javascript
const listHTML = app.newList(items, ordered, classes);
```

- **Parameters:**
  - `items` (Array): Array of inner HTML content for each list item.
  - `ordered` (boolean): Determines whether the list is ordered (ol) or unordered (ul).
  - `classes` (string, optional): CSS classes for the list.

### newTable

- Creates a table element.

```javascript
const tableHTML = app.newTable(headers, rows, classes);
```

- **Parameters:**
  - `headers` (Array): Array of header titles for the table.
  - `rows` (Array): Array of arrays representing rows and cells in the table.
  - `classes` (string, optional): CSS classes for the table.

---

For more detailed information, please refer to the [API Reference](#api-reference) section.