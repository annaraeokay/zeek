const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRID_SIZE = 50; // 50x50 squares
const GRID_WIDTH = 10; // 10x10 grid
const GRID_HEIGHT = 10;

// Zeek’s image
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
            ctx.fillStyle = '#4caf50'; // Green with "𝕏 friend"
            ctx.fillRect(user.x * GRID_SIZE, user.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.fillText('𝕏 friend', user.x * GRID_SIZE + 5, user
