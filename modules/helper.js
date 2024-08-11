export class NEXS_Helper{
    constructor(instance) {
        this.app = instance;
    }

    matchDynamicPath(link) {
        for (const page of this.app.pages.array) {
            const { match, params } = this.pathToRegex(page.link).exec(link);
            if (match) {
                return { page, params };
            }
        }
        return null;
    }
    
    pathToRegex(path) {
        const regexStr = path.replace(/:[^\s/]+/g, '([^\\/]+)');
        const regex = new RegExp(`^${regexStr}\\/?$`);
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

    waitAndGo(funct, ms) {
        setTimeout(funct, ms);
    }

    goBack() {
        window.history.back();
    }

    checkInput(value, { defaultValue, valueScope }) {
        if (value === undefined || value === null || value === '') return defaultValue;
        if (valueScope && !valueScope.includes(value)) return defaultValue;
        return value;
    }

    async renderSyntax(template, data) {
        const regex = /\@\{\{([^}]+)\}\}/g;
    
        const renderValue = (key) => {
            const keys = key.split('.');
            let value = data;
    
            for (const k of keys) {
                value = value[k] !== undefined ? value[k] : '';
            }
    
            if (typeof value === 'object') {
                return Array.isArray(value) ? value.map(item => JSON.stringify(item)).join(', ') : JSON.stringify(value, null, 2);
            }
            return value;
        };
    
        return template.replace(regex, (match, key) => renderValue(key));
    }

    setCookie(name, value, days) {
        let expires = "";
        if (days) {
            let date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    getCookie(name) {
        let nameEQ = name + "=";
        let cookiesArray = document.cookie.split(';');
        for (let i = 0; i < cookiesArray.length; i++) {
            let cookie = cookiesArray[i].trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length);
            }
        }
        return null;
    }
}