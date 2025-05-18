document.addEventListener('DOMContentLoaded', () => {
    const ball = document.getElementById('ball');
    const gameArea = document.getElementById('game-area');
    const scoreValue = document.getElementById('score-value');
    const startButton = document.getElementById('start-button');
    
    let score = 0;
    let gameActive = false;
    let ballX = 140;
    let ballY = 140;
    let velocityX = 0;
    let velocityY = 0;
    let obstacles = [];
    
    // Request permission for motion sensors
    function requestMotionPermission() {
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission()
                .then(permissionState => {
                    if (permissionState === 'granted') {
                        startGame();
                    }
                })
                .catch(console.error);
        } else {
            startGame();
        }
    }

    function startGame() {
        gameActive = true;
        score = 0;
        scoreValue.textContent = score;
        startButton.style.display = 'none';
        
        // Reset ball position
        ballX = 140;
        ballY = 140;
        updateBallPosition();
        
        // Clear existing obstacles
        obstacles.forEach(obs => obs.element.remove());
        obstacles = [];
        
        // Start creating obstacles
        createObstacle();
        setInterval(createObstacle, 2000);
        
        // Start scoring
        setInterval(() => {
            if (gameActive) {
                score++;
                scoreValue.textContent = score;
            }
        }, 1000);
    }

    function createObstacle() {
        if (!gameActive) return;
        
        const obstacle = document.createElement('div');
        obstacle.className = 'obstacle';
        
        // Random size between 10 and 30 pixels
        const size = Math.random() * 20 + 10;
        obstacle.style.width = size + 'px';
        obstacle.style.height = size + 'px';
        
        // Random position along the edges
        const side = Math.floor(Math.random() * 4);
        let x, y;
        
        switch(side) {
            case 0: // top
                x = Math.random() * 280;
                y = -30;
                break;
            case 1: // right
                x = 330;
                y = Math.random() * 280;
                break;
            case 2: // bottom
                x = Math.random() * 280;
                y = 330;
                break;
            case 3: // left
                x = -30;
                y = Math.random() * 280;
                break;
        }
        
        obstacle.style.left = x + 'px';
        obstacle.style.top = y + 'px';
        gameArea.appendChild(obstacle);
        
        const obstacleObj = {
            element: obstacle,
            x: x,
            y: y,
            size: size
        };
        
        obstacles.push(obstacleObj);
        
        // Move obstacle
        const angle = Math.atan2(140 - y, 140 - x);
        const speed = 2;
        const moveX = Math.cos(angle) * speed;
        const moveY = Math.sin(angle) * speed;
        
        const moveInterval = setInterval(() => {
            if (!gameActive) {
                clearInterval(moveInterval);
                return;
            }
            
            obstacleObj.x += moveX;
            obstacleObj.y += moveY;
            obstacle.style.left = obstacleObj.x + 'px';
            obstacle.style.top = obstacleObj.y + 'px';
            
            // Check collision
            if (checkCollision(obstacleObj)) {
                gameOver();
            }
            
            // Remove obstacle if it's off screen
            if (obstacleObj.x < -50 || obstacleObj.x > 350 || 
                obstacleObj.y < -50 || obstacleObj.y > 350) {
                obstacle.remove();
                obstacles = obstacles.filter(obs => obs !== obstacleObj);
                clearInterval(moveInterval);
            }
        }, 16);
    }

    function checkCollision(obstacle) {
        const ballRadius = 10;
        const centerX = ballX + ballRadius;
        const centerY = ballY + ballRadius;
        const obstacleCenter = {
            x: obstacle.x + obstacle.size / 2,
            y: obstacle.y + obstacle.size / 2
        };
        
        const distance = Math.sqrt(
            Math.pow(centerX - obstacleCenter.x, 2) +
            Math.pow(centerY - obstacleCenter.y, 2)
        );
        
        return distance < (ballRadius + obstacle.size / 2);
    }

    function gameOver() {
        gameActive = false;
        alert(`Game Over! Score: ${score}`);
        startButton.style.display = 'block';
        obstacles.forEach(obs => obs.element.remove());
        obstacles = [];
    }

    function updateBallPosition() {
        // Keep ball within boundaries
        ballX = Math.max(0, Math.min(280, ballX));
        ballY = Math.max(0, Math.min(280, ballY));
        
        ball.style.left = ballX + 'px';
        ball.style.top = ballY + 'px';
    }

    // Handle device motion
    window.addEventListener('devicemotion', (event) => {
        if (!gameActive) return;
        
        // Get acceleration including gravity
        const accelerationX = event.accelerationIncludingGravity.x;
        const accelerationY = event.accelerationIncludingGravity.y;
        
        // Update velocity (with damping)
        velocityX = velocityX * 0.9 - accelerationX * 0.5;
        velocityY = velocityY * 0.9 + accelerationY * 0.5;
        
        // Update position
        ballX += velocityX;
        ballY += velocityY;
        
        updateBallPosition();
    });

    startButton.addEventListener('click', requestMotionPermission);
}); 