document.addEventListener('DOMContentLoaded', () => {
    const target = document.getElementById('target');
    const gameArea = document.getElementById('game-area');
    const scoreValue = document.getElementById('score-value');
    const timeValue = document.getElementById('time-value');
    
    let score = 0;
    let timeLeft = 30;
    let gameActive = true;

    function getRandomPosition() {
        const maxX = gameArea.clientWidth - target.clientWidth;
        const maxY = gameArea.clientHeight - target.clientHeight;
        
        return {
            x: Math.floor(Math.random() * maxX),
            y: Math.floor(Math.random() * maxY)
        };
    }

    function moveTarget() {
        const pos = getRandomPosition();
        target.style.left = pos.x + 'px';
        target.style.top = pos.y + 'px';
    }

    function updateScore() {
        score += 1;
        scoreValue.textContent = score;
        moveTarget();
    }

    function updateTimer() {
        timeLeft -= 1;
        timeValue.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            gameActive = false;
            alert(`Game Over! Your score: ${score}`);
            // Reset game
            score = 0;
            timeLeft = 30;
            scoreValue.textContent = score;
            timeValue.textContent = timeLeft;
            gameActive = true;
        }
    }

    // Initialize target position
    moveTarget();

    // Start timer
    setInterval(() => {
        if (gameActive) {
            updateTimer();
        }
    }, 1000);

    // Handle target clicks/taps
    target.addEventListener('click', (e) => {
        if (gameActive) {
            e.preventDefault();
            updateScore();
        }
    });

    // Prevent scrolling on iOS when touching the game area
    gameArea.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });
}); 