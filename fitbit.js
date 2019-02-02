class Fitbit {
    constructor(token) {
        this.token = token;
    }

    // authURI returns the oauth Fitbit URI
    static authURI(protocol, host) {
        const clientId = '22948L';
        const redirectTo = encodeURIComponent(`${protocol}//${host}/`);

        return `https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=${clientId}&redirect_uri=${redirectTo}&scope=activity%20profile&expires_in=604800`;
    }

    // parseCredentials returns the credentials returned by Fitbit
    static parseCredentials(hash) {
        return (hash).substr(1).split("&")
            .map(v => v.split("="))
            .reduce((pre, [key, value]) => ({
                ...pre,
                [key]: value
            }), {});
    }

    // getActivities retrieves the recent Fitbit activities of the user
    async getActivities() {
        const req = this.createRequest("https://api.fitbit.com/1/user/-/activities/recent.json", "GET");
        const res = await fetch(req);
        const data = await res.json();

        return data;
    }

    // addActivity sends an activity to Fitbit
    async addActivity(activity) {
        const formData = new FormData();
        for (const k in activity) {
            formData.append(k, activity[k]);
        }

        const fitbitActivities = `https://api.fitbit.com/1/user/-/activities.json`;
        const req = this.createRequest(fitbitActivities, "POST", formData);
        const res = await fetch(req);
        const data = await res.json();

        return data;
    }

    // createRequest is a helper method to query the Fitbit API
    createRequest(endpoint, method, body) {
        const headers = new Headers();
        headers.append("Authorization", `Bearer ${this.token}`);
        headers.append("Accept-Locale", "fr_FR");

        return new Request(endpoint, {
            headers,
            method,
            body
        });
    }
}