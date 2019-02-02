class Storage {
    static getToken() {
        try {
            const now = new Date();
            const data = JSON.parse(localStorage.getItem("token"));
            if(now.getTime() - 60 * 60 * 1000 > data.validity) {
                return null;
            }

            return data.token;
        } catch(err) {
            return null;
        }
    }

    static setToken(credentials) {
        const now = new Date();
        const token = {
            "token": credentials.access_token,
            "validity": parseInt(credentials.expires_in) + now.getTime()
        };
        localStorage.setItem("token", JSON.stringify(token));

        return token.token;
    }

    static getActivities() {
        try {
            const data = JSON.parse(localStorage.getItem("activities"));
            return data;
        } catch (err) {
            return null;
        }
    }

    static setActivities(activities) {
        localStorage.setItem('activities', JSON.stringify(activities));
    }
}