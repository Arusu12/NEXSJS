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

    lookupFromLayouts(name, error = true) {
        for (const layout of this.app.layouts.array) {
            const section = this.app.layouts.getSections(layout.name).find(s => s.name === name);
            if (section) {
                return section.code;
            }
        }
    
        if (error) {
            console.error('%c[NEXS.JS] ', 'color: red', `Section [${name}] not found in any layout.`);
        }
        return null;
    }
    
    lookupFromBlocks(name, error = true) {
        for (const block of this.app.blocks.array) {
            const section = this.app.blocks.getSections(block.name).find(s => s.name === name);
            if (section) {
                return section.code;
            }
        }
    
        if (error) {
            console.error('%c[NEXS.JS] ', 'color: red', `Section [${name}] not found in any block.`);
        }
        return null;
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
        let sectionElement = this.get(section, false) || this.lookupFromLayouts(section, false) || this.lookupFromBlocks(section, false);

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
        } else {
            console.error('%c[NEXS.JS] ', 'color: red', 'Cannot set innerHTML because section element is null.');
        }
        return sectionElement;
    }
}