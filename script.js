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

// Animation de confettis
function launchConfetti() {
    const count = 200;
    const defaults = {
        origin: { y: 0.7 },
        zIndex: 1500
    };

    function fire(particleRatio, opts) {
        confetti({
            ...defaults,
            ...opts,
            particleCount: Math.floor(count * particleRatio),
            scalar: 1.2,
            spread: 100,
            startVelocity: 55,
        });
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}

// Charger un GIF initial
window.onload = async function () {
    const gif = document.getElementById("animationGif");
    gif.src = await fetchRandomGif();
    setupDinoEscape();
};

// Gestion de la fuite du dinosaure
function setupDinoEscape() {
    const movingIcon = document.getElementById("movingIcon");
    const escapeDistance = 150; // Distance augmentée
    let isEscaping = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    document.addEventListener('mousemove', (e) => {
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        
        if (isEscaping) return;

        const dinoRect = movingIcon.getBoundingClientRect();
        const dinoCenterX = dinoRect.left + dinoRect.width / 2;
        const dinoCenterY = dinoRect.top + dinoRect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(e.clientX - dinoCenterX, 2) + 
            Math.pow(e.clientY - dinoCenterY, 2)
        );

        if (distance < escapeDistance) {
            isEscaping = true;
            
            // Calculer la direction opposée à la souris avec plus d'amplitude
            const angle = Math.atan2(dinoCenterY - e.clientY, dinoCenterX - e.clientX);
            const escapeX = Math.cos(angle) * window.innerWidth * 0.4;
            const escapeY = Math.sin(angle) * window.innerHeight * 0.4;
            
            // Ajouter une position aléatoire pour plus de naturel
            const randomX = (Math.random() - 0.5) * 150;
            const randomY = (Math.random() - 0.5) * 150;
            
            // Position d'échappement finale
            const newX = Math.min(Math.max(50, dinoCenterX + escapeX + randomX), window.innerWidth - dinoRect.width - 50);
            const newY = Math.min(Math.max(50, dinoCenterY + escapeY + randomY), window.innerHeight - dinoRect.height - 50);
            
            // Appliquer la transformation avec animation
            movingIcon.style.transform = `translate(${newX}px, ${newY}px)`;
            
            // Réinitialiser après l'animation
            setTimeout(() => {
                isEscaping = false;
            }, 800);
        }
    });
}

// Déplacer l'icône animée (mouvement aléatoire périodique)
const movingIcon = document.getElementById("movingIcon");

function moveIconRandomly() {
    if (!document.hidden) {  // Ne bouge que si la page est visible
        const dinoRect = movingIcon.getBoundingClientRect();
        const margin = 50;  // Marge pour éviter les bords
        const x = Math.random() * (window.innerWidth - dinoRect.width - margin * 2) + margin;
        const y = Math.random() * (window.innerHeight - dinoRect.height - margin * 2) + margin;
        movingIcon.style.transform = `translate(${x}px, ${y}px)`;
    }
}

setInterval(moveIconRandomly, 3000);  // Intervalle augmenté pour des mouvements plus espacés

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

// Liste de phrases moqueuses
const mockingPhrases = [
    "Alors {name}, on n'a pas de chance aujourd'hui ? 😏",
    "Félicitations {name} ! Tu es l'heureux(se) perdant(e) ! 🎉",
    "La roue du destin a parlé, {name}... Et elle ne t'aime pas ! 😈",
    "Oups {name}, le dinosaure t'a choisi(e) ! 🦖",
    "Pas de bol {name}, c'est ton tour de briller... ou pas ! ✨",
    "Hey {name} ! Tu viens de gagner... le droit de perdre ! 🎯",
    "Le karma a frappé, et c'est tombé sur toi, {name} ! 🎲",
    "{name}, tu es l'élu(e)... des malchanceux ! 🍀",
    "Tiens tiens tiens, {name}... Quelle surprise ! 😎",
    "Le sort en est jeté, {name}, et il n'est pas en ta faveur ! 🎭",
    "Bravo {name}, tu as gagné le gros lot... de la malchance ! 🎪",
    "{name}, prépare-toi à briller... de désespoir ! ⭐",
    "Le destin a parlé, {name}, et il est mort de rire ! 😂",
    "Tadaaa {name} ! C'est ton moment de... gloire ? 🌟",
    "Allez {name}, montre-nous ce que tu as dans le ventre ! 💪"
];

// Fonction pour obtenir une phrase aléatoire
function getRandomMockingPhrase(name) {
    const randomPhrase = mockingPhrases[Math.floor(Math.random() * mockingPhrases.length)];
    return randomPhrase.replace('{name}', name);
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
        winnerDiv.textContent = getRandomMockingPhrase(winner);
        updateScore(winner);
        addToHistory(winner);
        launchFireworks();
        launchConfetti();
    });
});

// Mise à jour de la fonction addToHistory pour utiliser aussi les phrases moqueuses
function addToHistory(winner) {
    const historyList = document.getElementById("historyList");
    const newEntry = document.createElement("li");
    newEntry.innerHTML = `<i class="fas fa-skull"></i> ${getRandomMockingPhrase(winner)}`;
    historyList.appendChild(newEntry);
}

function faireTirage() {
    const textarea = document.getElementById('participants');
    const resultDiv = document.getElementById('result');
    const dino = document.getElementById('dino');
    
    // Récupérer et nettoyer la liste des participants
    let participants = textarea.value
        .split('\n')
        .map(name => name.trim())
        .filter(name => name.length > 0);
    
    if (participants.length === 0) {
        alert('Veuillez entrer au moins un participant !');
        return;
    }

    // Cacher le résultat précédent
    resultDiv.classList.add('hidden');
    resultDiv.classList.remove('visible');
    
    // Animation du dino
    dino.classList.add('running');
    
    // Effet de tirage au sort
    let shuffleCount = 0;
    const maxShuffles = 20;
    const shuffleInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * participants.length);
        resultDiv.textContent = participants[randomIndex];
        shuffleCount++;
        
        if (shuffleCount >= maxShuffles) {
            clearInterval(shuffleInterval);
            
            // Arrêter l'animation du dino
            setTimeout(() => {
                dino.classList.remove('running');
                resultDiv.classList.remove('hidden');
                resultDiv.classList.add('visible', 'shake');
                
                // Retirer l'animation de shake après qu'elle soit terminée
                setTimeout(() => {
                    resultDiv.classList.remove('shake');
                }, 500);
            }, 500);
        }
    }, 100);
}
