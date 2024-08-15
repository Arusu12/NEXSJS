export class SectionManager {
    constructor(app) {
        this.app = app;
        this.array = [];
    }

    get(name, error = true) {
        const section = this.array.find(s => s.name == name);
        if (section) {
            return section.code;
        } else {
            if (error) {
                console.error('%c[NEXS.JS] ', 'color: red', `Section [${name}] not found.`);
            }
            return null;
        }
    }
    
    getFromLayouts(layoutName, name, error = true) {
        const layout = this.app.layouts.getSections(layoutName);
        if (!layout) {
            if (error) {
                console.error('%c[NEXS.JS] ', 'color: red', `Layout [${layoutName}] not found.`);
            }
            return null;
        }
    
        const section = layout.find(s => s.name === name);
        if (section) {
            return section.code;
        } else {
            if (error) {
                console.error('%c[NEXS.JS] ', 'color: red', `Section [${name}] within layout [${layoutName}] not found.`);
            }
            return null;
        }
    }
    
    getFromBlocks(blockName, name, error = true) {
        const block = this.app.blocks.getSections(blockName);
        if (!block) {
            if (error) {
                console.error('%c[NEXS.JS] ', 'color: red', `Block [${blockName}] not found.`);
            }
            return null;
        }
    
        const section = block.find(s => s.name === name);
        if (section) {
            return section.code;
        } else {
            if (error) {
                console.error('%c[NEXS.JS] ', 'color: red', `Section [${name}] within block [${blockName}] not found.`);
            }
            return null;
        }
    }     

    setDefaultSection(name){
        this.app.sectionToRender = name;
    }

    defineNew(name, code) {
        if (!code) return console.error('%c[NEXS.JS] ', 'color: red', `Can't find section [${name}] on current page!`);
        const section = { name, code, layout: this.app.currentLayout };
        this.array.push(section);
        return section;
    }

    async render(section, block, data) {
        let sectionElement = this.get(section, false) || this.getFromLayouts(this.app.currentLayout, section, false) || this.getFromBlocks(this.app.currentLayout, section, false);

        const blockElement = this.app.blocks.get(block);
        if (!sectionElement) {
            console.error('%c[NEXS.JS] ', 'color: red', `Section [${section}] not found.`);
            return;
        }
        if (!this.app.currentLayout) {
            console.error('%c[NEXS.JS] ', 'color: red', 'Layout needs to be initialized for sections to be available.');
            return;
        }
        if (!blockElement) return;
    
        let renderedBlock = await this.app.helper.renderSyntax(blockElement, { ...data, user: this.app.user.data });
    
        if (sectionElement) {
            const get = sectionElement.getAttribute('onclick')
            if (!get) {
                sectionElement.setAttribute('onclick', '');
            }
            sectionElement.innerHTML = renderedBlock;
        }
        
        app.listener.init();
        return sectionElement;
    }
}