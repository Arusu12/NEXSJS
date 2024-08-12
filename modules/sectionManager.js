export class SectionManager {
    constructor(app) {
        this.app = app;
        this.array = [];
    }

    get(name) {
        const section = this.array.find(s => s.name == name);
        return section ? section.code : `Section ${name} not found.`;
    }

    setDefaultSectionToRender(name){
        this.app.sectionToRender = name;
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
            const get = sectionElement.getAttribute('onclick')
            if (!get) {
                sectionElement.setAttribute('onclick', '');
            }
            sectionElement.innerHTML = renderedBlock;
        } else {
            console.error('%c[NEXS.JS] ', 'color: red', 'Cannot set innerHTML because section element is null.');
        }
        return sectionElement;
    }
}