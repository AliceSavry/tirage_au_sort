const GIPHY_API_KEY = "i7DN7Y5grWRR8hTP53hOgF2KEboVz7v6";
const gifTags = ["unluck", "loser", "fail", "oops", "bad luck", "defeat"];
const defaultGifs = [
    "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
    "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
    "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif"
];
const scores = {};

// Récupérer un GIF aléatoire
async function fetchRandomGif() {
    try {
        const randomTag = gifTags[Math.floor(Math.random() * gifTags.length)];
        const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=${randomTag}&rating=g`);
        if (!response.ok) throw new Error("Erreur API.");
        const data = await response.json();
        return data.data.images.original.url;
    } catch {
        return defaultGifs[Math.floor(Math.random() * defaultGifs.length)];
    }
}

// Charger un GIF initial
window.onload = async function () {
    const gif = document.getElementById("animationGif");
    gif.src = await fetchRandomGif();
};

// Déplacer l'icône animée
const movingIcon = document.getElementById("movingIcon");

function moveIconRandomly() {
    const x = Math.random() * (window.innerWidth - movingIcon.offsetWidth);
    const y = Math.random() * (window.innerHeight - movingIcon.offsetHeight);
    movingIcon.style.transform = `translate(${x}px, ${y}px)`;
}

setInterval(moveIconRandomly, 2000);

// Lancer l'animation
async function startAnimation(participants, winnerDiv, gif, callback) {
    let dotCount = 0;
    const interval = setInterval(() => {
        dotCount = (dotCount + 1) % 4;
        winnerDiv.textContent = ".".repeat(dotCount);
    }, 500);

    setTimeout(async () => {
        clearInterval(interval);
        const gifUrl = await fetchRandomGif();
        gif.src = gifUrl;
        callback();
    }, 2000);
}

// Ajouter au scoreboard
function updateScore(winner) {
    if (!scores[winner]) scores[winner] = 0;
    scores[winner]++;
    const scoreList = document.getElementById("scoreList");
    scoreList.innerHTML = Object.entries(scores)
        .map(([name, score]) => `<li>${name}: ${score} points</li>`)
        .join("");
}

// Ajouter à l'historique
function addToHistory(winner) {
    const historyList = document.getElementById("historyList");
    const newEntry = document.createElement("li");
    newEntry.innerHTML = `<i class="fas fa-sad-tear"></i> Désolé ${winner}, c'était ton tour !`;
    historyList.appendChild(newEntry);
}

// Feux d'artifice
function launchFireworks() {
    const container = document.getElementById("fireworksCanvas");
    const fireworks = new Fireworks(container, { autoresize: true });
    fireworks.start();
    setTimeout(() => fireworks.stop(), 3000);
}

// Bouton de tirage
document.getElementById("drawButton").addEventListener("click", async function () {
    const input = document.getElementById("participantInput").value.trim();
    const participants = input.split("\n").filter((name) => name.trim() !== "");

    if (participants.length < 2) {
        document.getElementById("winner").textContent = "Veuillez entrer au moins 2 participants.";
        return;
    }

    const winnerDiv = document.getElementById("winner");
    const gif = document.getElementById("animationGif");

    await startAnimation(participants, winnerDiv, gif, () => {
        const winner = participants[Math.floor(Math.random() * participants.length)];
        winnerDiv.textContent = `Désolé ${winner}, c'est à toi !`;
        updateScore(winner);
        addToHistory(winner);
        launchFireworks();
    });
});
