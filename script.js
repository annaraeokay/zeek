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
    const
