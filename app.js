if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js');
    });
}

const startBtn = document.querySelector("#start"),
    stopBtn = document.querySelector("#stop"),
    addBtn = document.querySelector("#add"),
    activityList = document.querySelector("#activityList"),
    caloriesInput = document.querySelector("#calories"),
    distanceInput = document.querySelector("#distance");

let token,
    workout = false;

class UI {
    static showMessage(msg, type, persistent) {
        persistent = (persistent === undefined) ? false : persistent;
        const div = document.createElement('div');
        div.className = `alert alert-${type} mt-3`;
        div.innerHTML = msg;

        const form = document.querySelector("form");
        form.appendChild(div)

        if (!persistent) {
            setTimeout(() => document.querySelector(".alert").remove(), 3000);
        }
    }

    static update() {
        addBtn.disabled = "disabled";

        if (workout) {
            startBtn.style.display = "none";
            stopBtn.style.display = "block";
        } else {
            startBtn.style.display = "block";
            stopBtn.style.display = "none";
        }
    }

    static resetInputs() {
        distanceInput.value = "";
        caloriesInput.value = "";
    }
}

loadEventListeners();
UI.update();

function loadEventListeners() {
    document.addEventListener("DOMContentLoaded", init);
    startBtn.addEventListener("click", startWorkout);
    stopBtn.addEventListener("click", stopWorkout);
    addBtn.addEventListener("click", addWorkout);
}

function startWorkout(e) {
    startTime = new Date();
    console.log("Start to workout", startTime);
    sessionStorage.setItem('startedAt', startTime.toJSON());
    sessionStorage.removeItem('stoppedAt');

    workout = true;
    UI.update();

    e.preventDefault();
}

function stopWorkout(e) {
    stopTime = new Date();
    console.log("Stop to workout", stopTime);
    sessionStorage.setItem('stoppedAt', stopTime.toJSON());

    workout = false;
    UI.update();
    addBtn.disabled = "";

    e.preventDefault();
}

function addWorkout(e) {
    const startedAt = new Date(sessionStorage.getItem("startedAt"));
    const stoppedAt = new Date(sessionStorage.getItem("stoppedAt"));

    const activity = {
        "activityId": parseInt(activityList.value).toString(),
        "manualCalories": parseInt(caloriesInput.value).toString(),
        "startTime": `${startedAt.getHours()}:${startedAt.getMinutes()}:${startedAt.getSeconds()}`,
        "durationMillis": (stoppedAt.getTime() - startedAt.getTime()).toString(),
        "date": `${startedAt.getFullYear()}-${startedAt.getMonth() + 1}-${startedAt.getDate()}`,
        "distance": parseFloat(distanceInput.value).toString(),
    };

    console.log("addWorkout:activity", activity);
    if (isNaN(activity.manualCalories) || isNaN(activity.distance)) {
        UI.showMessage("Veuillez vérifier la distance et le nombre de calories", "danger");
        return;
    }

    const fitbitActivities = `https://api.fitbit.com/1/user/-/activities.json`;
    const formData = new FormData();
    for (k in activity) {
        formData.append(k, activity[k]);
    }

    const req = fitbitRequest(fitbitActivities, "POST", formData);
    fetch(req)
        .then(res => res.json())
        .then(data => {
            UI.showMessage("Activité enregistrée !", "success");
            resetLogger();
            UI.update();
        })
        .catch(err => {
            UI.showMessage(`Erreur lors de l'envoi de l'activité: ${err}`, "danger");
        });
}

function init() {
    token = localStorage.getItem("token");
    if (!token || token == "undefined") {
        fitbitLogin();
        return;
    }

    getActivity();
}

function fitbitLogin() {
    if (document.location.hash == "") {
        const fitbitAuth = "https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=22948L&redirect_uri=https%3A%2F%2Feasyfit.kinobiweb.com%2F&scope=activity%20profile&expires_in=604800";

        startBtn.disabled = "disabled";
        UI.showMessage(`
        Veuillez vous connecter sur <a href="${fitbitAuth}">FitBit</a>`, "info", true);

        return;
    }

    const credentials = (document.location.hash).substr(1).split("&")
        .map(v => v.split("="))
        .reduce((pre, [key, value]) => ({
            ...pre,
            [key]: value
        }), {});

    localStorage.setItem("token", credentials.access_token);
    token = credentials.access_token;

    getActivity();
}

function fitbitRequest(endpoint, method, body) {
    const headers = new Headers();
    headers.append("Authorization", `Bearer ${token}`);
    headers.append("Accept-Locale", "fr_FR");

    return new Request(endpoint, {
        headers,
        method,
        body
    });
}

function getActivity() {
    // Fetch activities from Fitbit
    const req = fitbitRequest("https://api.fitbit.com/1/user/-/activities/recent.json", "GET");
    fetch(req)
        .then(res => res.json())
        .then(activities => {
            activities.forEach(activity => {
                // create option
                const option = document.createElement('option');
                option.value = activity.activityId;
                option.innerText = activity.name;

                // attach option to select
                activityList.appendChild(option);
            });
        })
        .catch(err => {
            UI.showMessage(`Erreur lors de la récupération des activités: ${err}`, "danger");
        });
}

function resetLogger() {
    UI.resetInputs();
    sessionStorage.clear();
}