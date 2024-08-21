const pacman = document.getElementById('pacman');
const ghost = document.getElementById('ghost');
const gameArea = document.getElementById('gameArea');
const walls = document.querySelectorAll('.wall');
const stepSize = 10;
let posX = 10;
let posY = 10;
let gameRunning = true;

// Ghost movement speed
const ghostSpeed = 2;

document.addEventListener('keydown', (event) => {
    if (!gameRunning) return;

    const key = event.key;
    let nextX = posX;
    let nextY = posY;

    switch(key) {
        case 'ArrowUp':
            nextY -= stepSize;
            break;
        case 'ArrowDown':
            nextY += stepSize;
            break;
        case 'ArrowLeft':
            nextX -= stepSize;
            break;
        case 'ArrowRight':
            nextX += stepSize;
            break;
    }

    // Check for collision with walls and game area boundaries
    if (!isColliding(nextX, nextY, pacman.clientWidth, pacman.clientHeight) &&
        isWithinBounds(nextX, nextY, pacman.clientWidth, pacman.clientHeight)) {
        posX = nextX;
        posY = nextY;
    }

    pacman.style.top = posY + 'px';
    pacman.style.left = posX + 'px';
});

// Ghost follows Pac-Man
function moveGhost() {
    if (!gameRunning) return;

    let ghostX = ghost.offsetLeft;
    let ghostY = ghost.offsetTop;
    let nextGhostX = ghostX;
    let nextGhostY = ghostY;

    if (ghostX < posX) {
        nextGhostX += ghostSpeed;
    } else if (ghostX > posX) {
        nextGhostX -= ghostSpeed;
    }

    if (ghostY < posY) {
        nextGhostY += ghostSpeed;
    } else if (ghostY > posY) {
        nextGhostY -= ghostSpeed;
    }

    // Check for collision with walls and game area boundaries
    if (!isColliding(nextGhostX, nextGhostY, ghost.clientWidth, ghost.clientHeight) &&
        isWithinBounds(nextGhostX, nextGhostY, ghost.clientWidth, ghost.clientHeight)) {
        ghost.style.left = nextGhostX + 'px';
        ghost.style.top = nextGhostY + 'px';
    }

    // Check if the ghost catches Pac-Man
    if (isColliding(nextGhostX, nextGhostY, ghost.clientWidth, ghost.clientHeight, true)) {
        gameOver();
        return;
    }

    requestAnimationFrame(moveGhost);
}

moveGhost();

// Collision detection function
function isColliding(nextX, nextY, width, height, checkPacman = false) {
    for (let wall of walls) {
        const wallRect = wall.getBoundingClientRect();
        const nextRect = {
            left: nextX + gameArea.offsetLeft,
            top: nextY + gameArea.offsetTop,
            right: nextX + width + gameArea.offsetLeft,
            bottom: nextY + height + gameArea.offsetTop,
        };

        if (nextRect.right > wallRect.left &&
            nextRect.left < wallRect.right &&
            nextRect.bottom > wallRect.top &&
            nextRect.top < wallRect.bottom) {
            return true;
        }
    }

    // Check if the ghost collides with Pac-Man
    if (checkPacman) {
        const pacmanRect = pacman.getBoundingClientRect();
        const nextGhostRect = {
            left: nextX + gameArea.offsetLeft,
            top: nextY + gameArea.offsetTop,
            right: nextX + width + gameArea.offsetLeft,
            bottom: nextY + height + gameArea.offsetTop,
        };

        if (nextGhostRect.right > pacmanRect.left &&
            nextGhostRect.left < pacmanRect.right &&
            nextGhostRect.bottom > pacmanRect.top &&
            nextGhostRect.top < pacmanRect.bottom) {
            return true;
        }
    }

    return false;
}

// Boundary check function
function isWithinBounds(nextX, nextY, width, height) {
    return (
        nextX >= 0 &&
        nextY >= 0 &&
        nextX + width <= gameArea.clientWidth &&
        nextY + height <= gameArea.clientHeight
    );
}

// Game Over function
function gameOver() {
    gameRunning = false;
    alert('Game Over! The ghost caught Pac-Man.');
}
