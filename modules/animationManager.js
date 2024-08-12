export class Animate{
    constructor(app) {
        this.app = app;
        this.availableAnimations = []
    }
    
    section(sectionName, animationName) {
        if (this.availableAnimations.includes(animationName)) {
            const section = this.app.sections.get(sectionName);
            if (section) {
                section.classList.add(animation);
            } else {
                console.error('%c[NEXS.JS] ', 'color: red', 'Section picked for animation does not exist!');
            }
        } else {
            console.error('%c[NEXS.JS] ', 'color: red', `Animation ${animationName} not available!`);
        }
    }
}