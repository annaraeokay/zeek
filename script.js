const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Full-screen canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const GRID_SIZE = Math.min(canvas.width / GRID_WIDTH, canvas.height / GRID_HEIGHT);

// Zeek’s image
const zeekImage = new Image();
zeekImage.src = 'zeek.png'; // Assumes zeek.png is in the repo root

let zeek = { x: 2, y: 2, message: "Is everything okay at home?", showMessage: false, messageTimer: 0 };
let xUsers = [];
let score = 0;

function spawnXUser() {
    const x = Math.floor(Math.random() * GRID_WIDTH);
    const y
