const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Full-screen canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const GRID_SIZE = Math.min(canvas.width / GRID_WIDTH, canvas.height / GRID_HEIGHT);

// Zeek’s image with debug logs
const zeekImage = new Image();
zeekImage.src = 'zeek.png';
zeekImage.onload = () => console.log('Zeek image loaded!');
zeekImage.onerror = () => console.log('Error loading zeek.png');

let zeek = { x: 2, y: 2, message: "Is everything okay at home?", showMessage: false, messageTimer: 0 };
let xUsers = [];
let score = 0;

function spawnXUser() {
    const x = Math.floor(Math.random() * GRID_WIDTH);
    const y = Math.floor(Math.random() * GRID_HEIGHT);
    if (x !== zeek.x || y !== zeek.y) {
        xUsers.push({ x, y, asked: false });
    }
}
for (let i = 0; i < 5; i++) spawnXUser();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#b0bec5';
    for (let i = 0; i <= GRID_WIDTH; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= GRID_HEIGHT; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
    }

    // Draw X users
    xUsers.forEach(user => {
        if (!user.asked) {
            ctx.fillStyle = '#4caf50';
        } else {
            ctx.fillStyle = '#cccccc';
        }
        ctx.fillRect(user.x * GRID_SIZE, user.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        ctx.fillStyle = '#ffffff';
        ctx.font = `${GRID_SIZE * 0.3}px Arial`;
        ctx.fillText('X', user.x * GRID_SIZE + GRID_SIZE * 0.4, user.y * GRID_SIZE + GRID_SIZE * 0.6);
    });

    // Draw Zeek with his image
    if (zeekImage.complete) {
        ctx.drawImage(zeekImage, zeek.x * GRID_SIZE, zeek.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    } else {
        ctx.fillStyle = '#0288d1'; // Fallback blue square
        ctx.fillRect(zeek.x * GRID_SIZE, zeek.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = `${GRID_SIZE * 0.3}px Arial`;
    ctx.fillText('@zeek56923765420', zeek.x * GRID_SIZE + 5, zeek.y * GRID_SIZE + GRID_SIZE * 0.3);

    // Speech bubble
    if (zeek.showMessage) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(zeek.x * GRID_SIZE + GRID_SIZE, zeek.y * GRID_SIZE - GRID_SIZE * 0.5, GRID_SIZE * 3, GRID_SIZE * 0.6);
        ctx.strokeStyle = '#0288d1';
        ctx.strokeRect(zeek.x * GRID_SIZE + GRID_SIZE, zeek.y * GRID_SIZE - GRID_SIZE * 0.5, GRID_SIZE * 3, GRID_SIZE * 0.6);
        ctx.fillStyle = '#000000';
        ctx.font = `${GRID_SIZE * 0.3}px Arial`;
        ctx.fillText(zeek.message, zeek.x * GRID_SIZE + GRID_SIZE + 5, zeek.y * GRID_SIZE - GRID_SIZE * 0.1);
    }

    // Score
    ctx.fillStyle = '#000000';
    ctx.font = `${GRID_SIZE * 0.5}px Arial`;
    ctx.fillText(`Score: ${score}`, 10, GRID_SIZE);
}

function checkCollision() {
    xUsers.forEach(user => {
        if (zeek.x === user.x && zeek.y === user.y && !user.asked) {
            zeek.showMessage = true;
            zeek.messageTimer = 60;
            user.asked = true;
            score++;
            spawnXUser();
        }
    });
}

document.addEventListener('keydown', (event) => {
    let moved = false;
    switch (event.key) {
        case 'ArrowUp':
            if (zeek.y > 0) { zeek.y--; moved = true; }
            break;
        case 'ArrowDown':
            if (zeek.y < GRID_HEIGHT - 1) { zeek.y++; moved = true; }
            break;
        case 'ArrowLeft':
            if (zeek.x > 0) { zeek.x--; moved = true; }
            break;
        case 'ArrowRight':
            if (zeek.x < GRID_WIDTH - 1) { zeek.x++; moved = true; }
            break;
    }
    if (moved) {
        checkCollision();
    }
});

function gameLoop() {
    if (zeek.showMessage) {
        zeek.messageTimer--;
        if (zeek.messageTimer <= 0) zeek.showMessage = false;
    }
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
const zeekImage = new Image();
zeekImage.src = 'zeek.png';
zeekImage.onload = () => console.log('Zeek image loaded!');
zeekImage.onerror = () => console.log('Error loading zeek.png');
