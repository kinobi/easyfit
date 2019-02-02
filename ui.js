class UI {
    constructor() {
        this.form = document.querySelector("form");
        this.startBtn = document.querySelector("#start");
        this.stopBtn = document.querySelector("#stop");
        this.addBtn = document.querySelector("#add");
        this.activityList = document.querySelector("#activityList");
        this.caloriesInput = document.querySelector("#calories");
        this.distanceInput = document.querySelector("#distance");
    }

    showMessage(msg, type, persistent) {
        persistent = (persistent === undefined) ? false : persistent;
        const div = document.createElement('div');
        div.className = `alert alert-${type} mt-3`;
        div.innerHTML = msg;

        this.form.appendChild(div)

        if (!persistent) {
            setTimeout(() => document.querySelector(".alert").remove(), 3000);
        }
    }

    update(isWorkout, unlockAdd) {
        if (isWorkout) {
            this.startBtn.style.display = "none";
            this.stopBtn.style.display = "block";
        } else {
            this.startBtn.style.display = "block";
            this.stopBtn.style.display = "none";
        }

        if(unlockAdd === true) {
            this.addBtn.disabled = "";
        } else {
            this.addBtn.disabled = "disabled";
        }
    }

    lock(){
        this.startBtn.setAttribute('disabled', 'disabled');
        this.activityList.setAttribute('disabled', 'disabled');
        this.distanceInput.setAttribute('disabled', 'disabled');
        this.caloriesInput.setAttribute('disabled', 'disabled');
    }

    populateActivityList(activities) {
        activities.forEach(activity => {
            // create option
            const option = document.createElement('option');
            option.value = activity.activityId;
            option.innerText = activity.name;

            // attach option to select
            this.activityList.appendChild(option);
        });
    }

    resetInputs() {
        distanceInput.value = "";
        caloriesInput.value = "";
    }
}