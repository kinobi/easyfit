class Fitbit {
    constructor(token) {
        this.token = token;
    }

    async getActivities() {
        const req = this.createRequest("https://api.fitbit.com/1/user/-/activities/recent.json", "GET");
        const res = await fetch(req);
        const data = await res.json();

        return data;
    }

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