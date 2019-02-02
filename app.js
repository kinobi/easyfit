if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js');
    });
}

const ui = new UI(), 
    activityList = document.querySelector("#activityList"),
    caloriesInput = document.querySelector("#calories"),
    distanceInput = document.querySelector("#distance");

let fitbit,
    token;

loadEventListeners();
ui.update(false);

function loadEventListeners() {
    document.addEventListener("DOMContentLoaded", init);
    document.querySelector("#start").addEventListener("click", startWorkout);
    document.querySelector("#stop").addEventListener("click", stopWorkout);
    document.querySelector("#add").addEventListener("click", addWorkout);
}

function init() {
    token = localStorage.getItem("token");
    if (!token || token == "undefined") {
        fitbitLogin();
        return;
    }

    fitbit = new Fitbit(token);
    getActivity();
}

function startWorkout(e) {
    startTime = new Date();
    console.log("Start to workout", startTime);
    sessionStorage.setItem('startedAt', startTime.toJSON());
    sessionStorage.removeItem('stoppedAt');

    ui.update(true);

    e.preventDefault();
}

function stopWorkout(e) {
    stopTime = new Date();
    console.log("Stop to workout", stopTime);
    sessionStorage.setItem('stoppedAt', stopTime.toJSON());

    ui.update(false, true);

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

    if (isNaN(activity.manualCalories) || isNaN(activity.distance)) {
        ui.showMessage("Veuillez vérifier la distance et le nombre de calories", "danger");
        return;
    }

    fitbit.addActivity(activity)
        .then(data => {
            ui.showMessage("Activité enregistrée !", "success");
            resetLogger();
            ui.update(false);
        })
        .catch(err => {
            ui.showMessage(`Erreur lors de l'envoi de l'activité: ${err}`, "danger");
        });
}

function fitbitLogin() {
    const parsedUrl = new URL(window.location.href);
    if (parsedUrl.hash == "") {
        const fitbitAuth = Fitbit.authURI(parsedUrl.protocol, parsedUrl.host);

        ui.lock();
        ui.showMessage(`
        Veuillez vous connecter sur <a href="${fitbitAuth}">FitBit</a>`, "info", true);

        return;
    }

    const credentials = Fitbit.parseCredentials(parsedUrl.hash);
    localStorage.setItem("token", credentials.access_token);
    token = credentials.access_token;
    init();
    ui.showMessage('Vous êtes connecté avec Fitbit !', 'success');
}

// Fetch activities from Fitbit
function getActivity() {
    fitbit.getActivities()
        .then(activities => ui.populateActivityList(activities))
        .catch(err => {
            ui.showMessage(`Erreur lors de la récupération des activités: ${err}`, "danger");
            fitbitLogin()
        });
}

function resetLogger() {
    ui.resetInputs();
    sessionStorage.clear();
}