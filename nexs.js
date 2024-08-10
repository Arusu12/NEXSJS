// NEXS.JS
// Created and updated for applications by Arusu
const animations = ['fadeInFromLeft'];
class NEXSJS {
  constructor() {
    this.initialized = true;
    this.currentLayout = '';
    this.pageLoaderStripe = '';
    this.renderedSection = '';
    this.user = {};
    this.pages = [];
    this.layouts = [];
    this.sections = [];
    this.blocks = [];
  }

  /**
   * Initialize the application with a theme and layout.
   * @param {Object} theme - Theme settings.
   * @param {string} layout - Layout style (row or col).
   */
  init(theme = { bgColor: '#333', bgImageUrl: '', opacity: 0.8 }, layout) {
    this.loadCSS();
    this.loadTheme(theme);
    this.loadApp(layout);
  }

  loadCSS() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'NEXSJS/nexs.css';
    document.head.appendChild(link);
  }

  loadTheme({ bgColor, bgImageUrl, opacity, fontColor }) {
    const root = document.documentElement;
    root.style.setProperty('--bg-color', bgColor || '#333');
    root.style.setProperty('--bg', bgImageUrl ? `url('${bgImageUrl}')` : '');
    root.style.setProperty('--bg-opacity', opacity != null ? 1 - opacity : 0.8);
    root.style.setProperty('--font-color', fontColor || 'black');
    console.log('%c[NEXS.JS] ', 'color: #365BFF', 'Theme Rendered');
  }

  loadApp(layout) {
    const app = document.createElement('div');
    app.id = 'app';
    if (!layout) {
      app.classList.add('col');
      console.error('%c[NEXS.JS] ', 'color: red', 'Application is missing layout property!');
    } else {
      app.classList.add(layout);
    }
    document.body.appendChild(app);
    this.layout = app;
  }

  async setUser(userAPIEndpoint) {
    try {
      const response = await fetch(userAPIEndpoint, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Error getting data from API.');
      }
      const data = await response.json();
      if (data.UID) {
        this.user = data;
        return data.name;
      } else {
        console.warn('Not logged in. Continuing with no user data.');
        return 'Not logged in. Continuing with no user data.';
      }
    } catch (error) {
      console.error('%c[NEXS.JS] ', 'color: red', error.message);
    }
  }

  defineNewPage(page = { link, layout, block, type }) {
    if (!page) {
      console.error('%c[NEXS.JS] ', 'color: red', 'No page defined.');
      return;
    }
    this.pages.push(page)
  }

  async definePagesFromAPI(link) {
    try {
      const response = await fetch(link, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Error getting data from API.');
      }
      const data = await response.json();
      if (data[0]?.link && data[0]?.layout && data[0]?.block && data[0]?.type) {
        this.pages = data;
        return data;
      } else {
        throw new Error('API does not contain page array.');
      }
    } catch (error) {
      console.error('%c[NEXS.JS] ', 'color: red', error.message);
    }
  }

  definePageLoaderStripe(code) {
    this.pageLoaderStripe = code;
  }

  defineNewLayout(name, code) {
    const layout = { name, code };
    this.layouts.push(layout);
    return layout;
  }

  async defineLayoutsFromAPI(link) {
    try {
      const response = await fetch(link, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Error getting data from API.');
      }
      const data = await response.json();
      if (data[0]?.name && data[0]?.code) {
        this.layouts = data;
        return data;
      } else {
        throw new Error('API does not contain layouts array.');
      }
    } catch (error) {
      console.error('%c[NEXS.JS] ', 'color: red', error.message);
    }
  }

  defineNewSection(name, code) {
    const section = { name, code, layout: this.currentLayout };
    this.sections.push(section);
    return section;
  }

  defineBlock(name, code) {
    const block = { name, code };
    this.blocks.push(block);
    return block;
  }

  getLayout(name) {
    const layout = this.layouts.find(s => s.name === name);
    if (!layout) {
      return `Layout ${name} not found.`;
    }
    return layout.code;
  }

  getBlock(name) {
    const block = this.blocks.find(s => s.name === name);
    if (!block) {
      return `Block ${name} not found.`;
    }
    return block.code;
  }

  getSection(name) {
    const section = this.sections.find(s => s.name === name);
    if (!section) {
      return `Section ${name} not found.`;
    }
    return section.code;
  }

  async requestPOST(url) {
    try {
      const response = await fetch(url, { method: 'POST' });
      if (!response.ok) {
        throw new Error('Error getting data from URL.');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('%c[NEXS.JS] ', 'color: red', error.message);
    }
  }

  renderLayout(name) {
    const layout = this.layouts.find(l => l.name === name);
    if (!layout) {
      console.error('%c[NEXS.JS] ', 'color: red', 'Layout not found.');
      return;
    }
    this.layout.innerHTML = layout.code;
    this.currentLayout = name;
    return this.layout;
  }

  renderSection(section, block, data) {
    const sectionElement = this.sections.find(s => s.name === section);
    if (!sectionElement) {
      console.error('%c[NEXS.JS] ', 'color: red', 'Section not found.');
      return;
    }
    if (!this.currentLayout) {
      console.error('%c[NEXS.JS] ', 'color: red', 'Layout needs to be initialized for sections to be available.');
      return;
    }

    const blockElement = this.blocks.find(s => s.name === block);
    if (!blockElement) {
      console.error('%c[NEXS.JS] ', 'color: red', `Block named [${block}] not found.`);
      return;
    }

    let renderedBlock = blockElement.code;

    const combinedData = { ...data, user: this.user };

    renderedBlock = this.renderSyntax(renderedBlock, combinedData);

    sectionElement.code.innerHTML = renderedBlock;
    return sectionElement;
  }

  renderSyntax(template, data) {
    const regex = /\[\*\{([^}]+)\}\*\]/g;

    const renderValue = (key) => {
      const keys = key.split('.');
      let value = data;

      for (const k of keys) {
        if (value[k] !== undefined) {
          value = value[k];
        } else {
          return ''; // Return empty string if key is not found
        }
      }

      if (typeof value === 'object') {
        // Handle arrays and objects
        if (Array.isArray(value)) {
          return value.map(item => JSON.stringify(item)).join(', ');
        }
        return JSON.stringify(value, null, 2);
      }

      return value;
    };

    return template.replace(regex, (match, key) => renderValue(key));
  }

  initListeners(overlay) {
    if (overlay) {
      document.getElementById('overlay').addEventListener('click', (event) => {
        if (event.target.classList.contains('visible')) {
          event.stopPropagation();
          document.getElementById('overlay').innerHTML = '';
          if (this.getSection('navbar').classList.contains('expand')) {
            this.getSection('menu-button').click();
          }
        }
      });
    }
    window.addEventListener('popstate', async () => {
      await this.render(window.location.pathname);
    });
    this.layout.querySelectorAll('a').forEach(a => {
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
          await this.render(href);
        }
      });
    });
  }

  async render(link, renderedSectionName) {
    if (link === '/404' && !this.pages.find(page => page.link === link)) {
      console.error('%c[NEXS.JS] ', 'color: red', 'No 404 Page set!');
      return;
    }
  
    this.renderedSection = renderedSectionName || this.renderedSection;
    if (!this.renderedSection) {
      console.error('%c[NEXS.JS] ', 'color: red', 'Main rendering section is not set.');
      return;
    }
  
    link = link || window.location.pathname;
  
    const match = this.matchDynamicPath(link);
    const page = match ? match.page : null;
  
    if (!page) {
      await this.render('/404');
      return;
    }
  
    if (page.layout !== this.currentLayout) {
      const layout = this.renderLayout(page.layout);
      if (!layout) return;
    }
  
    if (page.type === 'http' || page.type === 'ws') {
      try {
        const response = await fetch(link, { method: 'POST' });
        if (!response.ok) {
          await this.render('/404');
          return;
        }
        const data = await response.json();
        this.renderSection(this.renderedSection, page.block, data);
        return data;
      } catch (error) {
        await this.render('/404');
      }
    } else {
      this.renderSection('content', page.block);
    }
    return this.layout;
  }
  
  matchDynamicPath(link) {
    for (const page of this.pages) {
      const { match, params } = this.pathToRegex(page.link).exec(link);
      if (match) {
        return { page, params };
      }
    }
    return null;
  }
  
  pathToRegex(path) {
    const regexStr = path.replace(/:[^\s/]+/g, '([^\\/]+)');
    const regex = new RegExp(`^${regexStr}$`);
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

  checkInput(value, { defaultValue, valueScope }) {
    if (value === undefined || value === null || value === '') {
      return defaultValue;
    }
    if (valueScope && !valueScope.includes(value)) {
      return defaultValue;
    }
    return value;
  }

  /**
   * Assign animation to a section that runs during update. Only 'fadeInFromLeft' works right now.
   * @param {string} animationName - Name of predefined animation to apply to chosen section.
   */
  animateSection(sectionName, animationName) {
    if (animations.includes(animationName)) {
      const section = this.getSection(sectionName);
      if (section) {
        section.classList.add(animationName);
      } else {
        console.log('Section for animation does not exist!')
      }
    } else {
      console.log('Animation not available!')
    }
  }
  interactiveNavigation(sectionName, blockClassName, highlightColor) {
    function manageNav(open, nav_list, items){
      nav_list.forEach(i =>{
          i.classList.remove('active')
      })
      document.querySelector('div.user-section#'+ open.getAttribute('section')).classList.remove('hide-section')
      open.classList.add('active')
  }
  
  document.querySelectorAll('.user-sections div').forEach(a =>{
      a.addEventListener('click', ()=>{
          manageNav(a, document.querySelectorAll('.user-sections div'), document.querySelectorAll('div.user-section'))
      })
  })
  manageNav(document.querySelector('.user-sections div'), document.querySelectorAll('.user-sections div'), document.querySelectorAll('div.user-section'))
  }

  waitAndGo(funct, ms) {
    setTimeout(funct, ms);
  }
  /**
   * Creates an anchor tag.
   * @param {string} url - The URL for the anchor tag.
   * @param {string} value - The display text for the anchor tag.
   * @param {string} classes - The CSS classes for the anchor tag.
   * @returns {string} The generated anchor tag HTML.
   */
  newLink(url, value, classes) {
    return `<a ${url ? `href="${url}"` : ''} ${classes ? `class="${classes}"` : ''}>${value}</a>`;
  }

  /**
   * Creates multiple anchor tags.
   * @param {Array} links - An array of objects containing URL and body text for each link.
   * @param {string} classes - The CSS classes for the anchor tags.
   * @returns {string} The generated anchor tags HTML.
   */
  newLinks(links, classes) {
    return links.map(a => this.newLink(a.url, a.body, classes)).join('\n');
  }

  /**
   * Creates an input field.
   * @param {string} type - The type of the input field.
   * @param {string} name - The name attribute for the input field.
   * @param {string} classes - The CSS classes for the input field.
   * @param {string} placeholder - The placeholder text for the input field.
   * @param {string} value - The value attribute for the input field.
   * @returns {string} The generated input field HTML.
   */
  newInput(type, name, classes, placeholder, value) {
    return `<input ${type ? `type="${type}"` : ''} ${name ? `name="${name}"` : ''} ${classes ? `class="${classes}"` : ''} ${placeholder ? `placeholder="${placeholder}"` : ''} ${value ? `value="${value}"` : ''}>`;
  }

  /**
   * Creates an image tag.
   * @param {string} url - The URL for the image source.
   * @param {string} classes - The CSS classes for the image.
   * @param {string} alt - The alt text for the image.
   * @returns {string} The generated image tag HTML.
   */
  newImage(url, classes, alt) {
    return `<img ${url ? `src="${url}"` : ''} ${classes ? `class="${classes}"` : ''} ${alt ? `alt="${alt}"` : ''}>`;
  }

  /**
   * Creates a block element.
   * @param {string} tag - The HTML tag for the block element.
   * @param {string} value - The inner HTML content of the block element.
   * @param {string} classes - The CSS classes for the block element.
   * @returns {string} The generated block element HTML.
   */
  newBlock(tag, value, classes) {
    return `<${tag} ${classes ? `class="${classes}"` : ''}>${value}</${tag}>`;
  }

  /**
   * Creates multiple block elements.
   * @param {Array} values - An array of inner HTML content for each block element.
   * @param {string} tag - The HTML tag for the block elements.
   * @param {string} classes - The CSS classes for the block elements.
   * @returns {string} The generated block elements HTML.
   */
  newBlocks(values, tag, classes) {
    return values.map(a => this.newBlock(tag, a, classes)).join('\n');
  }

  /**
   * Creates a button element.
   * @param {string} type - The type attribute for the button.
   * @param {string} value - The display text for the button.
   * @param {string} classes - The CSS classes for the button.
   * @returns {string} The generated button element HTML.
   */
  newButton(type, value, classes) {
    return `<button ${type ? `type="${type}"` : ''} ${classes ? `class="${classes}"` : ''}>${value}</button>`;
  }

  /**
   * Creates multiple button elements.
   * @param {Array} buttons - An array of objects containing type and body text for each button.
   * @param {string} classes - The CSS classes for the button elements.
   * @returns {string} The generated button elements HTML.
   */
  newButtons(buttons, classes) {
    return buttons.map(b => this.newButton(b.type, b.body, classes)).join('\n');
  }

  /**
   * Creates a textarea element.
   * @param {string} name - The name attribute for the textarea.
   * @param {string} classes - The CSS classes for the textarea.
   * @param {string} placeholder - The placeholder text for the textarea.
   * @param {string} value - The inner HTML content for the textarea.
   * @returns {string} The generated textarea element HTML.
   */
  newTextarea(name, classes, placeholder, value) {
    return `<textarea ${name ? `name="${name}"` : ''} ${classes ? `class="${classes}"` : ''} ${placeholder ? `placeholder="${placeholder}"` : ''}>${value ? `${value}` : ''}</textarea>`;
  }

  /**
   * Creates a form element.
   * @param {string} action - The action attribute for the form.
   * @param {string} method - The method attribute for the form.
   * @param {string} classes - The CSS classes for the form.
   * @param {string} content - The inner HTML content of the form.
   * @returns {string} The generated form element HTML.
   */
  newForm(action, method, classes, content) {
    return `<form ${action ? `action="${action}"` : ''} ${method ? `method="${method}"` : ''} ${classes ? `class="${classes}"` : ''}>${content}</form>`;
  }

  /**
   * Creates a select dropdown element.
   * @param {string} name - The name attribute for the select element.
   * @param {Array} options - An array of objects containing value and label for each option.
   * @param {string} classes - The CSS classes for the select element.
   * @returns {string} The generated select dropdown HTML.
   */
  newSelect(name, options, classes) {
    return `<select ${name ? `name="${name}"` : ''} ${classes ? `class="${classes}"` : ''}>
      ${options.map(option => `<option value="${option.value}">${option.label}</option>`).join('\n')}
    </select>`;
  }

  /**
   * Creates a list element.
   * @param {Array} items - An array of inner HTML content for each list item.
   * @param {boolean} ordered - Determines whether the list is ordered (ol) or unordered (ul).
   * @param {string} classes - The CSS classes for the list.
   * @returns {string} The generated list element HTML.
   */
  newList(items, ordered, classes) {
    const tag = ordered ? 'ol' : 'ul';
    return `<${tag} ${classes ? `class="${classes}"` : ''}>
      ${items.map(item => `<li>${item}</li>`).join('\n')}
    </${tag}>`;
  }

  /**
   * Creates a table element.
   * @param {Array} headers - An array of header titles for the table.
   * @param {Array} rows - An array of arrays representing rows and cells in the table.
   * @param {string} classes - The CSS classes for the table.
   * @returns {string} The generated table element HTML.
   */
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