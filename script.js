document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let canvasWidth = window.innerWidth * 0.8;
    let canvasHeight = window.innerHeight * 0.8;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let bird = {
        x: 50,
        y: 150,
        width: 15,
        height: 15,
        gravity: 0.5,
        lift: -10,
        velocity: 0
    };

    let pipes = [];
    let frame = 0;
    let score = 0;
    const pipeGap = 200;
    const pipeWidth = 40;

    function drawBird() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
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

        if (bird.y + bird.height > canvas.height) {
            bird.y = canvas.height - bird.height;
            bird.velocity = 0;
        }

        pipes.forEach(pipe => {
            pipe.x -= 2;
        });

        pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);

        if (frame % 90 === 0) {
            let pipeHeight = Math.floor(Math.random() * (canvas.height / 2));
            pipes.push({ x: canvas.width, y: 0, width: pipeWidth, height: pipeHeight });
        }

        /*pipes.forEach(pipe => {
            if (bird.x < pipe.x + pipeWidth && bird.x + bird.width > pipe.x &&
                (bird.y < pipe.y + pipe.height || bird.y + bird.height > pipe.y + pipe.height + pipeGap)) {
                reset();
            }
        });*/

        pipes.forEach(pipe => {
            if (bird.x > pipe.x && bird.x < pipe.x + pipeWidth) {
                if (bird.y < pipe.height || bird.y + bird.height > pipe.height + pipeGap) {
                    reset();
                } else if (!pipe.passed) {
                    // Der Vogel ist erfolgreich zwischen den Rohren durchgeflogen
                    pipe.passed = true; // Markiere das Rohr als passiert, um mehrfache Inkremente zu verhindern
                    score++;
                }
            }
        });

        if (frame % 90 === 0) {
            //score++;
        }

        frame++;
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

    function gameLoop() {
        update();
        draw();
        requestAnimationFrame(gameLoop);
    }

    canvas.addEventListener('click', () => {
        bird.velocity = bird.lift;
    });

    window.addEventListener('resize', () => {
        draw();
    })

    gameLoop();
});
