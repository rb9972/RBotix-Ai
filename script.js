// --- MATRIX BACKGROUND ---
const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth; 
canvas.height = window.innerHeight;
const chars = "010101"; 
const drops = Array(Math.floor(canvas.width/16)).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0F0"; 
    ctx.font = "15px monospace";
    drops.forEach((y, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * 16, y * 16);
        if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}
setInterval(drawMatrix, 35);

// --- APP LOGIC ---
const AI_NAME = "RBotix"; 
let userName = "";
let chatHistory = [];

function login() {
    const nameField = document.getElementById('username').value;
    if(!nameField) {
        alert("Enter your name to access the portal!");
        return;
    }
    userName = nameField;
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('chatRoom').style.display = 'flex';
    document.getElementById('welcomeUser').innerText = `USER: ${userName.toUpperCase()}`;
    addMessage(`[SYSTEM]: Identity verified. Welcome, ${userName}.`, "ai");
}

async function processChat() {
    const inputField = document.getElementById('userMsgInput');
    const status = document.getElementById('typingStatus');
    const message = inputField.value.trim();

    if (!message) return;

    addMessage(`${userName}: ${message}`, "user");
    inputField.value = ""; 
    status.innerText = "THINKING...";

    try {
        // This calls the hidden file in your /api/ folder
        const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                message: message,
                history: chatHistory 
            })
        });

        const data = await response.json();
        if (data.reply) {
            addMessage(`${AI_NAME}: ${data.reply}`, "ai"); 
            chatHistory.push({ role: "user", content: message });
            chatHistory.push({ role: "assistant", content: data.reply });
        }
    } catch (error) {
        addMessage(`[SYSTEM ERROR]: Secure link lost.`, "ai");
    } finally {
        status.innerText = "IDLE";
    }
}

function addMessage(text, sender) {
    const chatBox = document.getElementById('chatBox');
    const div = document.createElement('div');
    div.className = `message ${sender}`;
    div.innerText = text; 
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleKeyPress(e) { if (e.key === 'Enter') processChat(); }

function selfDestruct() { 
    chatHistory = [];
    document.getElementById('chatBox').innerHTML = '<div class="message ai">[DATA WIPE SUCCESSFUL]</div>'; 
}