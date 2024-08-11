export class userManager {
    constructor(app) {
        this.app = app;
        this.data = {};
    }

    async set(userAPIEndpoint) {
        try {
            const response = await fetch(userAPIEndpoint, { method: 'POST' });
            if (!response.ok) throw new Error('Error getting data from API.');
    
            const data = await response.json();
            if (data.UID) {
                this.data = data;
                return data.name;
            } else {
                console.warn('Not logged in. Continuing with no user data.');
                return 'Not logged in. Continuing with no user data.';
            }
        } catch (error) {
            console.error('%c[NEXS.JS] ', 'color: red', error.message);
        }
    }

    setManually(name, UID, pfp){
        this.data = { name, UID, pfp }
    }

    setLocally() {
        const setName = this.app.helper.getCookie('userName');
        const setUID = this.app.helper.getCookie('userUID');
        const setPFP = this.app.helper.getCookie('userPfp');

        if(setName, setPFP, setUID){
            this.setManually(setName, parseInt(setUID, 10), setPFP);
            return;
        }


        const userName = prompt("Enter your name:");
        const userUID = prompt("Enter your UID (random):");
        const userEmail = prompt("Enter your profile picture link:");
    
        if (userName && userUID && userEmail) {
            this.setManually(userName, parseInt(userUID, 10), userEmail);
    
            // Save to cookies for 7 days for testing
            this.app.helper.setCookie('userName', userName, 7);
            this.app.helper.setCookie('userUID', userUID, 7);
            this.app.helper.setCookie('userPfp', userEmail, 7);
    
            alert("User details saved successfully!");
        } else {
            alert("All fields are required!");
        }
    }
}