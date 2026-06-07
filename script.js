let selectedMood = "";
let latestScore = 0;

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo(0, 0);
}

function chooseMood(mood) {
  selectedMood = mood;
  document.getElementById("moodText").innerText = "Your mood today: " + mood;

  let advice = "";
  if (mood.includes("Happy")) advice = "Great! Keep your positive energy and share it with others.";
  else if (mood.includes("Normal")) advice = "That is okay. Try doing one small thing that makes you feel better.";
  else if (mood.includes("Sad")) advice = "It is okay to feel sad. Try writing your feelings or talking to someone you trust.";
  else if (mood.includes("Angry")) advice = "Take a short break. Breathe slowly before you react.";
  else if (mood.includes("Tired")) advice = "Rest is important. Drink water and try to sleep earlier tonight.";
  else if (mood.includes("Anxious")) advice = "Try the breathing exercise and remind yourself that you are not alone.";

  document.getElementById("moodAdvice").innerText = advice;
}

function calculateResult() {
  let score = 0;

  for (let i = 1; i <= 5; i++) {
    const answer = document.querySelector('input[name="q' + i + '"]:checked');
    if (!answer) {
      alert("Please answer all stress quiz questions.");
      showPage("quiz");
      return;
    }
    score += Number(answer.value);
  }

  latestScore = score;

  let level = "";
  let advice = "";
  let color = "";
  let support = "";

  if (score <= 3) {
    level = "Low Stress";
    advice = "You are doing well. Keep going and take care of yourself.";
    color = "#c8e6c9";
    support = "Keep a healthy routine and continue checking your mood.";
  } else if (score <= 6) {
    level = "Medium Stress";
    advice = "Take a short break, drink water, listen to music, or go outside for a walk.";
    color = "#fff59d";
    support = "Try the breathing exercise. If stress continues, talk to someone you trust.";
  } else {
    level = "High Stress";
    advice = "Try deep breathing and talk to a trusted friend, teacher, family member, or counselor.";
    color = "#ffcdd2";
    support = "Please check the Help section. If you feel unsafe, call emergency support immediately.";
  }

  const journal = document.getElementById("journalText").value;
  const grateful = document.getElementById("gratefulText").value;
  const goals = document.querySelectorAll(".goal:checked").length;
  const percentage = score * 10;

  document.getElementById("progressBar").style.width = percentage + "%";
  document.getElementById("progressBar").innerText = percentage + "%";

  const resultBox = document.getElementById("resultBox");
  resultBox.style.background = color;
  resultBox.innerHTML = `
    <p><strong>Mood:</strong> ${selectedMood || "Not selected"}</p>
    <p><strong>Stress Score:</strong> ${score} / 10</p>
    <p><strong>Stress Level:</strong> ${level}</p>
    <p><strong>Advice:</strong> ${advice}</p>
    <p><strong>Support Reminder:</strong> ${support}</p>
    <p><strong>Journal:</strong> ${journal || "No journal written."}</p>
    <p><strong>Grateful For:</strong> ${grateful || "Not written."}</p>
    <p><strong>Goals Completed:</strong> ${goals} / 5</p>
  `;

  updateStatistics(score);
  showPage("result");
}

function updateStatistics(score) {
  const percentage = score * 10;
  document.getElementById("statsMood").innerText = "Mood: " + (selectedMood || "Not selected");
  document.getElementById("statsScore").innerText = "Stress Score: " + score + " / 10";
  document.getElementById("statsBar").style.width = percentage + "%";
  document.getElementById("statsBar").innerText = percentage + "%";
}

function submitFeedback() {
  const feedback = document.getElementById("feedbackText").value;
  const box = document.getElementById("feedbackResult");

  if (feedback.trim() === "") {
    alert("Please write your feedback first.");
    return;
  }

  box.classList.remove("hidden");
  box.innerHTML = `<h3>Thank you for your feedback!</h3><p>Your feedback: ${feedback}</p>`;
  document.getElementById("feedbackText").value = "";
}

function restart() {
  location.reload();
}
