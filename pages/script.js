document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const loginForm = document.getElementById('loginForm');
    const nameInput = document.getElementById('name');
    const startGameButton = document.getElementById('startGame');
    const endScreen = document.getElementById('endScreen');
    const finalScore = document.getElementById('finalScore');
    const highscoresList = document.getElementById('highscoresList');
    const restartGameButton = document.getElementById('restartGame')

    let canvasWidth = window.innerWidth * 0.8;
    let canvasHeight = window.innerHeight * 0.8;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;



    let bird = {
        sprite: document.getElementById('Bird'),
        x: 50,
        y: 150,
        width: 14,
        height: 10,
        gravity: 0.5,
        lift: -10,
        velocity: 0
    };

    // Initial Values
    let pipes = [];
    let frame = 0;
    let score = 0;
    let gameOver = false;
    const pipeGap = 200;
    const pipeWidth = 40;

    function drawBird() {
        ctx.drawImage(bird.sprite, bird.x, bird.y);
    }

    function drawPipes() {
        ctx.fillStyle = 'green';
        pipes.forEach(pipe => {
            ctx.fillRect(pipe.x, pipe.y, pipeWidth, pipe.height);
            ctx.fillRect(pipe.x, pipe.y + pipe.height + pipeGap, pipeWidth, canvas.height - (pipe.y + pipe.height + pipeGap));
        });
    }

    function update() {
        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.height / 2 > canvas.height) {
            gameOver = true;
            showEndScreen();
        }
        
        if (bird.y - bird.height / 2 < 0) {
            gameOver = true;
            showEndScreen();
        }

        // All Pipes are moved to the left
        pipes.forEach(pipe => {
            pipe.x -= 2;
        });

        pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);


        //Every 90th frame a new pipe is created
        if (frame % 90 === 0) {
            let pipeHeight = Math.floor(Math.random() * (canvas.height / 2));
            pipes.push({ x: canvas.width, y: 0, width: pipeWidth, height: pipeHeight });
        }

        pipes.forEach(pipe => {
            if (bird.x > pipe.x && bird.x < pipe.x + pipeWidth) {
                if (bird.y < pipe.height || bird.y + bird.height > pipe.height + pipeGap) {
                    gameOver = true;
                    showEndScreen();
                } 
                else if (!pipe.passed) {
                    // Der Vogel ist erfolgreich zwischen den Rohren durchgeflogen
                    pipe.passed = true; // Markiere das Rohr als passiert, um mehrfache Inkremente zu verhindern
                    score++;
                }
            }
        });

        frame++;
    }

    function showHighscoreForm() {
        highscoreForm.style.display = 'flex';
    }

    function showEndScreen() {
        finalScore.textContent = `Dein Score: ${score}`;
        saveHighscore(playerName, score).then(() => {
            fetchHighscores().then(highscores => {
                highscoresList.innerHTML = highscores.map(highscore => `<li>${highscore.name}: ${highscore.score}</li>`).join('');
                endScreen.style.display = 'flex';
            });
        });
    }

    function reset() {
        bird.y = 150;
        bird.velocity = 0;
        pipes = [];
        frame = 0;
        score = 0;
    }

    function draw() {
        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight * 0.8;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBird();
        drawPipes();
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.fillText(`Score: ${score}`, 10, 25);
    }
    
    // Classical Game Loop
    function gameLoop() {
        if (!gameOver) {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
    }

    // Move Bird up if mouse clicked in canvas
    canvas.addEventListener('click',  () => {
        bird.velocity = bird.lift;
    });
    
    // Move Bird up if Space is pressed
    window.addEventListener('keypress',  (e) => {
        if (e.key === " ") {
            bird.velocity = bird.lift;
        }
    });
    
    // If windows is resizing, the window is newly drawn
    window.addEventListener('resize', () => {
        draw();
    })

    startGameButton.addEventListener('click', function() {
        playerName = nameInput.value;
        if (playerName) {
            loginForm.style.display = 'none';
            canvas.style.display = 'block';
            gameLoop();
        }
    });

    restartGameButton.addEventListener('click', function() {
        bird.y = 150;
        bird.velocity = 0;
        score = 0;
        gameOver = false;
        endScreen.style.display = 'none';
        reset();
        gameLoop();
    });

    function saveHighscore(name, score) {
        return fetch('/highscores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, score: score })
        }).then(response => response.json());
    }

    function fetchHighscores() {
        return fetch('/highscores')
            .then(response => response.json());
    }

    loginForm.style.display = 'flex';
});
