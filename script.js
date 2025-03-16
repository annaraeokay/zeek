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
    ctx.fillText('@zeek56923765420', zeek.x * GRID_SIZE
