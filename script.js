const GIPHY_API_KEY = "i7DN7Y5grWRR8hTP53hOgF2KEboVz7v6"; // Votre clé API
const gifTags = ["unluck", "loser", "fail", "oops", "bad luck", "defeat"]; // Liste de tags pour les GIFs
const defaultGifs = [
    "https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif",
    "https://media.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.gif",
    "https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif"
];

// Fonction pour obtenir un GIF aléatoire depuis Giphy
async function fetchRandomGif() {
    try {
        // Choisir un tag aléatoire dans la liste
        const randomTag = gifTags[Math.floor(Math.random() * gifTags.length)];
        const response = await fetch(`https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=${randomTag}&rating=g`);
        if (!response.ok) throw new Error("Erreur lors de la récupération du GIF.");
        const data = await response.json();
        return data.data.images.original.url; // URL du GIF
    } catch (error) {
        console.error("Erreur :", error);
        return defaultGifs[Math.floor(Math.random() * defaultGifs.length)]; // GIF par défaut
    }
}

// Charger un GIF dès le chargement de la page
window.onload = async function () {
    const gif = document.getElementById("animationGif");
    const gifUrl = await fetchRandomGif();
    gif.src = gifUrl; // Charge un GIF initial
};

async function startAnimation(participants, winnerDiv, gif, callback) {
    let dotCount = 0;

    // Fonction pour changer les points et le GIF
    async function updateDotsAndGif() {
        dotCount = (dotCount + 1) % 4; // Points défilants
        const dots = ".".repeat(dotCount); // ".", "..", "...", "...."
        winnerDiv.textContent = dots;

        // Obtenir un nouveau GIF uniquement si les points atteignent "...."
        if (dotCount === 3) {
            const gifUrl = await fetchRandomGif();
            gif.src = gifUrl;
        }
    }

    // Lancer le changement à intervalles réguliers
    const interval = setInterval(updateDotsAndGif, 500); // Change toutes les 500ms

    // Arrêter l'animation après 2 secondes
    setTimeout(() => {
        clearInterval(interval);
        callback();
    }, 2000);
}

function getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

document.getElementById("drawButton").addEventListener("click", async function () {
    const input = document.getElementById("participantInput").value.trim();
    const participants = input.split("\n").filter(name => name.trim() !== "");

    if (participants.length < 2) {
        document.getElementById("winner").textContent = "Veuillez entrer au moins 2 participants.";
        return;
    }

    const winnerDiv = document.getElementById("winner");
    const gif = document.getElementById("animationGif");

    // Lancer l'animation
    await startAnimation(participants, winnerDiv, gif, () => {
        const winner = participants[Math.floor(Math.random() * participants.length)];
        winnerDiv.textContent = `Désolé ${winner}, c'est à toi !`;
        winnerDiv.style.color = getRandomColor();
    });
});
