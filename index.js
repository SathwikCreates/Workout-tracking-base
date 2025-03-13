const form = document.querySelector("form");
const pushupsInput = document.querySelector("#pushups");
const crunchesInput = document.querySelector("#crunches");
const totalPushupsEl = document.querySelector("#totalPushups");
const totalCrunchesEl = document.querySelector("#totalCrunches");
const historyList = document.querySelector("#history");
const reset = document.querySelector("#reset");

// Timer elements
const timerDisplay = document.getElementById("timerDisplay");
const startStopBtn = document.getElementById("startStopBtn");
const resetBtn = document.getElementById("resetBtn");

// Timer variables
let timerInterval;
let isRunning = false;
let seconds = 0;
let minutes = 0;

// Load history from localStorage
const history = JSON.parse(localStorage.getItem("WorkoutHistory")) || [];

// Calculate totals
function calculateTotals() {
  const pushupsTotal =
    history.reduce((acc, curr) => acc + curr.pushups, 0) || 0;
  const crunchesTotal =
    history.reduce((acc, curr) => acc + curr.crunches, 0) || 0;

  totalPushupsEl.textContent = pushupsTotal;
  totalCrunchesEl.textContent = crunchesTotal;
}

// Display exercise history
function renderHistory() {
  if (history.length === 0) {
    historyList.innerHTML = "<li>No entries yet.</li>";
    return;
  }

  historyList.innerHTML = "";
  history.forEach((entry) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${entry.date}: Push-ups: <b>${entry.pushups}</b>, Crunches: <b>${entry.crunches}</b>
    `;
    historyList.appendChild(li);
  });
}

// Save data in localStorage
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const pushups = parseInt(pushupsInput.value);
  const crunches = parseInt(crunchesInput.value);

  if (isNaN(pushups) || pushups < 0 || isNaN(crunches) || crunches < 0) {
    alert("Please enter valid numbers!");
    return;
  }

  const newEntry = {
    date: new Date().toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    }),
    pushups,
    crunches,
  };

  history.push(newEntry);
  localStorage.setItem("WorkoutHistory", JSON.stringify(history));

  pushupsInput.value = "";
  crunchesInput.value = "";

  renderHistory();
  calculateTotals();
});

// Reset history
reset.addEventListener("click", () => {
  localStorage.removeItem("WorkoutHistory");
  history.length = 0; // Clear history array
  renderHistory();
  calculateTotals();
});

// Timer functionality
startStopBtn.addEventListener("click", () => {
  if (isRunning) {
    clearInterval(timerInterval);
    startStopBtn.textContent = "Start";
  } else {
    timerInterval = setInterval(() => {
      seconds++;
      if (seconds === 60) {
        seconds = 0;
        minutes++;
      }
      timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(
        seconds
      ).padStart(2, "0")}`;
    }, 1000);
    startStopBtn.textContent = "Stop";
  }
  isRunning = !isRunning;
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timerDisplay.textContent = "00:00";
  seconds = 0;
  minutes = 0;
  isRunning = false;
  startStopBtn.textContent = "Start";
});

renderHistory();
calculateTotals();
