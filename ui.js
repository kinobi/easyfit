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