let selectedMood = "";
let currentLanguage = "en";
let moodChart;

const questions = [
  "I feel tired today.",
  "I feel nervous or worried.",
  "I cannot focus well.",
  "I feel pressure from school or life.",
  "I did not sleep well.",
  "I feel lonely today.",
  "I have too many things to do.",
  "I feel hard to relax."
];

const quotes = [
  "Small steps still move you forward.",
  "Your feelings are valid.",
  "Rest is productive too.",
  "You do not have to handle everything alone.",
  "One calm breath can restart your mind."
];

window.onload = function () {
  buildQuiz();
  loadChart();
  loadFeedback();
};

function buildQuiz() {
  const quizBox = document.getElementById("quizBox");
  quizBox.innerHTML = "";

  questions.forEach((q, index) => {
    quizBox.innerHTML += `
      <div class="question">
        <p>${index + 1}. ${q}</p>
        <label><input type="radio" name="q${index}" value="0"> No</label>
        <label><input type="radio" name="q${index}" value="1"> A little</label>
        <label><input type="radio" name="q${index}" value="2"> Yes</label>
      </div>
    `;
  });
}

function chooseMood(mood) {
  selectedMood = mood;
  let advice = "";

  if (mood.includes("Happy")) advice = "Great! Keep your positive energy and share it with others.";
  else if (mood.includes("Normal")) advice = "That is okay. Try doing one small thing that makes you feel better.";
  else if (mood.includes("Sad")) advice = "It is okay to feel sad. Try writing your feelings or talking to someone you trust.";
  else if (mood.includes("Angry")) advice = "Take a short break. Breathe slowly before you react.";
  else if (mood.includes("Tired")) advice = "Rest is important. Drink water and try to sleep earlier tonight.";
  else if (mood.includes("Anxious")) advice = "Try the breathing exercise and remind yourself that you are not alone.";

  document.getElementById("moodAdvice").innerHTML = `<strong>Your mood today:</strong> ${mood}<br>${advice}`;
}

function calculateResult() {
  let score = 0;
  const maxScore = questions.length * 2;

  for (let i = 0; i < questions.length; i++) {
    const answer = document.querySelector(`input[name="q${i}"]:checked`);
    if (!answer) {
      alert("Please answer all stress quiz questions.");
      return;
    }
    score += Number(answer.value);
  }

  let level, advice, color, badge;
  if (score <= 5) {
    level = "Low Stress";
    advice = "You are doing well. Keep a healthy routine and continue checking your mood.";
    color = "#c8e6c9";
    badge = "Calm Starter Badge 🟢";
  } else if (score <= 10) {
    level = "Medium Stress";
    advice = "Take a short break, drink water, listen to music, or go outside for a walk.";
    color = "#fff59d";
    badge = "Self-Care Badge 🟡";
  } else {
    level = "High Stress";
    advice = "Try deep breathing and talk to a trusted friend, teacher, family member, or counselor.";
    color = "#ffcdd2";
    badge = "Support Seeker Badge 🔴";
  }

  const percentage = Math.round((score / maxScore) * 100);
  document.getElementById("progressBar").style.width = percentage + "%";
  document.getElementById("progressBar").innerText = percentage + "%";

  const journal = document.getElementById("journalText").value || "No journal written.";
  const grateful = document.getElementById("gratefulText").value || "Not written.";

  const resultBox = document.getElementById("resultBox");
  resultBox.style.background = color;
  resultBox.innerHTML = `
    <p><strong>Mood:</strong> ${selectedMood || "Not selected"}</p>
    <p><strong>Stress Score:</strong> ${score} / ${maxScore}</p>
    <p><strong>Stress Level:</strong> ${level}</p>
    <p><strong>Advice:</strong> ${advice}</p>
    <p><strong>Journal:</strong> ${journal}</p>
    <p><strong>Grateful For:</strong> ${grateful}</p>
    <p><strong>Achievement:</strong> ${badge}</p>
  `;

  saveHistory(score);
  loadChart();
  location.href = "#result";
}

function saveHistory(score) {
  const history = JSON.parse(localStorage.getItem("moodHistory")) || [];
  const date = new Date().toLocaleDateString();
  history.push({ date, score, mood: selectedMood || "Not selected" });
  localStorage.setItem("moodHistory", JSON.stringify(history.slice(-10)));
}

function loadChart() {
  const history = JSON.parse(localStorage.getItem("moodHistory")) || [];
  const labels = history.map(item => item.date);
  const scores = history.map(item => item.score);
  const ctx = document.getElementById("moodChart");

  if (!ctx) return;
  if (moodChart) moodChart.destroy();

  moodChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Stress Score",
        data: scores,
        borderWidth: 3,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true, max: 16 } }
    }
  });
}

function clearHistory() {
  localStorage.removeItem("moodHistory");
  loadChart();
}

function resetToday() {
  location.reload();
}

function playMusic() {
  document.getElementById("relaxMusic").play();
}

function stopMusic() {
  const music = document.getElementById("relaxMusic");
  music.pause();
  music.currentTime = 0;
}

function newQuote() {
  const random = Math.floor(Math.random() * quotes.length);
  document.getElementById("quoteBox").innerText = quotes[random];
}

function saveFeedback() {
  const name = document.getElementById("feedbackName").value || "Anonymous";
  const text = document.getElementById("feedbackText").value;
  if (!text.trim()) {
    alert("Please write your feedback first.");
    return;
  }

  const feedback = JSON.parse(localStorage.getItem("feedback")) || [];
  feedback.push({ name, text });
  localStorage.setItem("feedback", JSON.stringify(feedback));
  document.getElementById("feedbackText").value = "";
  loadFeedback();
}

function loadFeedback() {
  const list = document.getElementById("feedbackList");
  const feedback = JSON.parse(localStorage.getItem("feedback")) || [];
  list.innerHTML = "";
  feedback.forEach(item => {
    list.innerHTML += `<div class="feedback-item"><strong>${item.name}:</strong> ${item.text}</div>`;
  });
}

document.getElementById("darkModeBtn").addEventListener("click", function () {
  document.body.classList.toggle("dark");
});

document.getElementById("languageBtn").addEventListener("click", function () {
  currentLanguage = currentLanguage === "en" ? "zh" : "en";
  document.querySelectorAll("[data-en]").forEach(el => {
    el.innerText = el.getAttribute(`data-${currentLanguage}`);
  });
  this.innerText = currentLanguage === "en" ? "中文" : "English";
});
