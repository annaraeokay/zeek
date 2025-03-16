const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRID_SIZE = 50;
const GRID_WIDTH = 10;
const GRID_HEIGHT = 10;

// Zeek’s image
const zeekImage = new Image();
zeekImage.src = 'zeek.png';
zeekImage.onload = () => console.log('Zeek image loaded!');
zeekImage.onerror = () => console.log('Error loading zeek.png');

// Sound effects
const victorySound = new Audio('victory.mp3');
const thunderSound = new Audio('thunder.mp3');

let zeek = { x: 2, y: 2, message: "Is everything okay at home?", showMessage: false, messageTimer: 0 };
let xUsers = [];
let score = 0;
let level = 1;
let flashTimer = 0;
let flashColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3']; // ROYGBIV
let currentFlashColor = flashColors[0];
let powerUpActive = false;
let powerUpTimer = 0;
let boss = null;
let bossHits = 0;

function spawnXUsers() {
    xUsers = [];
    const spawnCount = 5 + (level - 1) * 3;
    for (let i = 0; i < spawnCount; i++) {
        const x = Math.floor(Math.random() * GRID_WIDTH);
        const y = Math.floor(Math.random() * GRID_HEIGHT);
        if (x !== zeek.x || y !== zeek.y) {
            const isPowerUp = Math.random() < 0.1; // 10% chance for power-up
            xUsers.push({ x, y, asked: false, powerUp: isPowerUp });
        }
    }
    // Spawn boss at level 5+
    if (level >= 5 && !boss) {
        boss = { x: Math.floor(Math.random() * (GRID_WIDTH - 2)), y: Math.floor(Math.random() * (GRID_HEIGHT - 2)), hitsLeft: 3 };
    }
}
spawnXUsers();

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background with level-based color
    ctx.fillStyle = flashTimer > 0 ? currentFlashColor : flashColors[(level - 1) % flashColors.length];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
            ctx.fillStyle = user.powerUp ? '#ff0000' : '#4caf50'; // Red for power-up, green for regular
            ctx.fillRect(user.x * GRID_SIZE, user.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.fillText(user.powerUp ? '⚡' : '𝕏 friend', user.x * GRID_SIZE + 5, user.y * GRID_SIZE + 30);
        } else {
            ctx.fillStyle = '#cccccc';
            ctx.fillRect(user.x * GRID_SIZE, user.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    });

    // Draw Boss
    if (boss) {
        ctx.fillStyle = '#800080'; // Purple boss
        ctx.fillRect(boss.x * GRID_SIZE, boss.y * GRID_SIZE, GRID_SIZE * 2, GRID_SIZE * 2);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.fillText(`Hits: ${boss.hitsLeft}`, boss.x * GRID_SIZE + 10, boss.y * GRID_SIZE + 60);
    }

    // Draw Zeek
    if (zeekImage.complete) {
        ctx.drawImage(zeekImage, zeek.x * GRID_SIZE, zeek.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    } else {
        ctx.fillStyle = '#0288d1';
        ctx.fillRect(zeek.x * GRID_SIZE, zeek.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText('@zeek56923765420', zeek.x * GRID_SIZE + 5, zeek.y * GRID_SIZE + 15);

    // Speech bubble
    if (zeek.showMessage) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(zeek.x * GRID_SIZE + GRID_SIZE, zeek.y * GRID_SIZE - 20, 150, 30);
        ctx.strokeStyle = '#0288d1';
        ctx.strokeRect(zeek.x * GRID_SIZE + GRID_SIZE, zeek.y * GRID_SIZE - 20, 150, 30);
        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.fillText(zeek.message, zeek.x * GRID_SIZE + GRID_SIZE + 5, zeek.y * GRID_SIZE + 2);
    }

    // Cleared message
    if (flashTimer > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(100, 200, 300, 100);
        ctx.fillStyle = '#ffffff';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Level ${level - 1} cleared!`, 250, 230);
        ctx.fillText("You’ve cleared the timeline for now!", 250, 270);
        ctx.textAlign = 'left';
    }

    // Score and Level
    ctx.fillStyle = '#000000';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
    ctx.fillText(`Level: ${level}`, 10, 60);
    if (powerUpActive) {
        ctx.fillText("Power-Up Active!", 10, 90);
    }
}

function checkCollision() {
    xUsers.forEach(user => {
        if (zeek.x === user.x && zeek.y === user.y && !user.asked) {
            zeek.showMessage = true;
            zeek.messageTimer = 60;
            user.asked = true;
            victorySound.play(); // Play victory chime
            score += powerUpActive ? 2 : 1; // Double points if power-up active
            if (user.powerUp) {
                powerUpActive = true;
                powerUpTimer = 600; // 10 seconds at ~60 FPS
            }
            spawnXUser();
            if (score >= 10) { // Trigger every 10 points
                flashTimer = 60;
                currentFlashColor = flashColors[(level - 1) % flashColors.length]; // Match background
                thunderSound.play(); // Play thunder
                level++;
                score = 0;
                spawnXUsers();
            }
        }
    });
    if (boss && zeek.x >= boss.x && zeek.x < boss.x + 2 && zeek.y >= boss.y && zeek.y < boss.y + 2) {
        boss.hitsLeft--;
        victorySound.play();
        if (boss.hitsLeft <= 0) {
            boss = null;
            score += 10; // Bonus for defeating boss
        }
        zeek.x = Math.max(0, Math.min(zeek.x, GRID_WIDTH - 1)); // Bounce back
        zeek.y = Math.max(0, Math.min(zeek.y, GRID_HEIGHT - 1));
    }
}

document.addEventListener('keydown', (event) => {
    if (flashTimer > 0) return;
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

// Touch controls for mobile
canvas.addEventListener('touchstart', (e) => {
    if (flashTimer > 0) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = Math.floor((touch.clientX - rect.left) / GRID_SIZE);
    const touchY = Math.floor((touch.clientY - rect.top) / GRID_SIZE);
    if (touchX < zeek.x && zeek.x > 0) zeek.x--;
    if (touchX > zeek.x && zeek.x < GRID_WIDTH - 1) zeek.x++;
    if (touchY < zeek.y && zeek.y > 0) zeek.y--;
    if (touchY > zeek.y && zeek.y < GRID_HEIGHT - 1) zeek.y++;
    checkCollision();
});

function gameLoop() {
    if (zeek.showMessage) {
        zeek.messageTimer--;
        if (zeek.messageTimer <= 0) zeek.showMessage = false;
    }
    if (flashTimer > 0) {
        flashTimer--;
    }
    if (powerUpTimer > 0) {
        powerUpTimer--;
        if (powerUpTimer <= 0) powerUpActive = false;
    }
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
