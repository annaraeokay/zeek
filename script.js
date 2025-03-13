// Near the top, after canvas setup
const zeekImage = new Image();
zeekImage.src = 'https://pbs.twimg.com/profile_images/.../zeek_profile.jpg'; // Use the direct URL
// OR if uploading to repo: zeekImage.src = 'zeek.png';

// In the draw() function, replace Zeek's ctx.fillRect line:
function draw() {
    // ... (keep existing grid and X users code) ...

    // Replace this:
    // ctx.fillStyle = '#0288d1';
    // ctx.fillRect(zeek.x * GRID_SIZE, zeek.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    // With this:
    if (zeekImage.complete) { // Ensure image is loaded
        ctx.drawImage(zeekImage, zeek.x * GRID_SIZE, zeek.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    } else {
        ctx.fillStyle = '#0288d1'; // Fallback if image fails
        ctx.fillRect(zeek.x * GRID_SIZE, zeek.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }

    // Keep the text:
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText('@zeek56923765420', zeek.x * GRID_SIZE + 5, zeek.y * GRID_SIZE + 15);

    // ... (rest of draw function) ...
}
