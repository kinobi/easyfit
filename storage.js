class Storage {
    static getActivities() {
        const data = localStorage.getItem('activities');
        if (!data) {
            return null;
        }

        return JSON.parse(data);
    }

    static setActivities(activities) {
        localStorage.setItem('activities', JSON.stringify(activities));
    }
}