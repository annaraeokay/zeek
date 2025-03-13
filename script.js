// Draw X users
xUsers.forEach(user => {
    if (!user.asked) {
        ctx.fillStyle = '#4caf50'; // Green with "𝕏 friend"
        ctx.fillRect(user.x * GRID_SIZE, user.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.fillText('𝕏 friend', user.x * GRID_SIZE + 5, user.y * GRID_SIZE + 30);
    } else {
        ctx.fillStyle = '#cccccc'; // Gray with no text
        ctx.fillRect(user.x * GRID_SIZE, user.y * GRID_SIZE, GRID_SIZE, GRID_SIZE);
    }
});
