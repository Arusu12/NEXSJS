export class EasyBlocks{
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