const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRID_SIZE = 50;
const GRID_WIDTH = 10;
const GRID_HEIGHT = 9;

// Zeek’s image
const zeekImage = new Image();
zeekImage.src = 'zeek.png';
zeekImage.onload = () => console.log('Zeek image loaded!');
zeekImage.onerror = () => console.log('Error loading zeek.png');

// Sound effects
const victorySound = new Audio('victory.mp3'); // MP3
const thunderSound = new Audio('thunder.wav'); // WAV

let zeek = { x: 2, y: 1, message: "Is everything okay at home?", showMessage: false, messageTimer: 0 };
let xUsers = [];
let score = 0;
let level = 1;
let flashTimer = 0;
let flashColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#9400d3'];
let currentFlashColor = flashColors[0];
let powerUpActive = false;
let powerUpTimer = 0;
let boss = null;

function spawnXUsers() {
    xUsers = [];
    const spawnCount = Math.min(5 + (level - 1) * 3, GRID_WIDTH * GRID_HEIGHT - 1);
    console.log(`Spawning ${spawnCount} X friends for Level ${level}`);
    for (let i = 0; i < spawnCount; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * GRID_WIDTH);
            y = Math.floor(Math.random() * GRID_HEIGHT) + 1;
        } while ((x === zeek.x && y === zeek.y) || xUsers.some(u => u.x === x && u.y === y));
        const isPowerUp = Math.random() < 0.1;
        xUsers.push({ x, y, asked: false, powerUp: isPowerUp });
    }
    if (level >= 5 && !boss) {
        let bx, by;
        do {
            bx = Math.floor(Math.random() * (GRID_WIDTH - 2));
            by = Math.floor(Math.random() * (GRID_HEIGHT - 2)) + 1;
        } while (xUsers.some(u => u.x === bx && u.y === by));
        boss = { x: bx, y: by, hitsLeft: 3 };
    }
}
spawnXUsers();

function spawnXUser() {
    let x, y;
    do {
        x = Math.floor(Math.random() * GRID_WIDTH);
        y = Math.floor(Math.random() * GRID_HEIGHT) + 1;
    } while ((x === zeek.x && y === zeek.y) || xUsers.some(u => u.x === x && u.y === y));
    const isPowerUp = Math.random() < 0.1;
    xUsers.push({ x, y, asked: false, powerUp: isPowerUp });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background with level-based color
    ctx.fillStyle = flashTimer > 0 ? currentFlashColor : flashColors[(level - 1) % flashColors.length];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid (below banner)
    ctx.strokeStyle = '#b0bec5';
    for (let i = 0; i <= GRID_WIDTH; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, GRID_SIZE);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= GRID_HEIGHT; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (i + 1) * GRID_SIZE);
        ctx.lineTo(canvas.width, (i + 1) * GRID_SIZE);
        ctx.stroke();
    }

    // Draw X users
    xUsers.forEach(user => {
        if (!user.asked) {
            ctx.fillStyle = user.powerUp ? '#ff69b4' : '#000000';
            ctx.fillRect(user.x * GRID_SIZE, user.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            ctx.fillStyle = '#ffffff';
            ctx.font = user.powerUp ? '24px Arial' : '12px Arial';
            ctx.fillText(user.powerUp ? '🏠' : 'X friend', user.x * GRID_SIZE + (user.powerUp ? 10 : 5), user.y * GRID_SIZE + (user.powerUp ? 35 : 30));
        } else {
            ctx.fillStyle = '#cccccc';
            ctx.fillRect(user.x * GRID_SIZE, user.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        }
    });

    // Draw Boss
    if (boss) {
        ctx.fillStyle = '#800080';
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

    // Username banner
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, GRID_SIZE);
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('@zeek56923765420', 10, 35);

    // Speech bubble (longer)
    if (zeek.showMessage) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(zeek.x * GRID_SIZE + GRID_SIZE, zeek.y * GRID_SIZE - 20, 200, 30); // 200px wide
        ctx.strokeStyle = '#0288d1';
        ctx.strokeRect(zeek.x * GRID_SIZE + GRID_SIZE, zeek.y * GRID_SIZE - 20, 200, 30);
        ctx.fillStyle = '#000000';
        ctx.font = '14px Arial';
        ctx.fillText(zeek.message, zeek.x * GRID_SIZE + GRID_SIZE + 5, zeek.y * GRID_SIZE + 2);
    }

    // Cleared message (wider)
    if (flashTimer > 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(75, 200, 350, 100); // 350px wide
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
    ctx.fillText(`Score: ${score}`, 10, 80);
    ctx.fillText(`Level: ${level}`, 10, 110);
    if (powerUpActive) {
        ctx.fillText("Power-Up Active!", 10, 140);
    }
}

function checkCollision() {
    xUsers.forEach(user => {
        if (zeek.x === user.x && zeek.y === user.y && !user.asked) {
            zeek.showMessage = true;
            zeek.messageTimer = 60;
            user.asked = true;
            try { victorySound.play(); } catch (e) { console.log("Victory sound failed:", e); }
            score += powerUpActive ? 2 : 1;
            if (user.powerUp) {
                powerUpActive = true;
                powerUpTimer = 600;
            }
            spawnXUser();
            if (score >= 10) {
                flashTimer = 60;
                currentFlashColor = flashColors[(level - 1) % flashColors.length];
                try { thunderSound.play(); } catch (e) { console.log("Thunder sound failed:", e); }
                level++;
                score = 0;
                spawnXUsers();
            }
        }
    });
    if (boss && zeek.x >= boss.x && zeek.x < boss.x + 2 && zeek.y >= boss.y && zeek.y < boss.y + 2) {
        boss.hitsLeft--;
        try { victorySound.play(); } catch (e) { console.log("Victory sound failed:", e); }
        if (boss.hitsLeft <= 0) {
            boss = null;
            score += 10;
        }
        zeek.x = Math.max(0, Math.min(zeek.x, GRID_WIDTH - 1));
        zeek.y = Math.max(1, Math.min(zeek.y, GRID_HEIGHT));
    }
}

document.addEventListener('keydown', (event) => {
    if (flashTimer > 0) return;
    let moved = false;
    switch (event.key) {
        case 'ArrowUp':
            if (zeek.y > 1) { zeek.y--; moved = true; }
            break;
        case 'ArrowDown':
            if (zeek.y < GRID_HEIGHT) { zeek.y++; moved = true; }
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
    if (touchY < zeek.y && zeek.y > 1) zeek.y--;
    if (touchY > zeek.y && zeek.y < GRID_HEIGHT) zeek.y++;
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
