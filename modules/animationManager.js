export class Animate{
    constructor(app) {
        this.app = app;
        this.availableAnimations = []
    }
    
    section(section, animation) {
        if (this.availableAnimations.includes(animation)) {
            const section = this.app.sections.get(section);
            if (section) {
                section.classList.add(animation);
            } else {
                console.log('Section for animation does not exist!');
            }
        } else {
            console.log('Animation not available!');
        }
    }
}