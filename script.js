/* ------------------------------------------------
   PAGE NAVIGATION & BUTTON LOGIC
------------------------------------------------ */
function nextPage(pageNumber) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    const nextPage = document.getElementById(`page${pageNumber}`);
    if (nextPage) {
        nextPage.classList.add('active');
    }

    if (pageNumber === 4) {
        // Just for fun, add extra confetti on the last page
        startCelebration();
    }
}

function moveButton() {
    const noBtn = document.getElementById('noBtn');
    const maxWidth = window.innerWidth - 150;
    const maxHeight = window.innerHeight - 100;

    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);

    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}

function startCelebration() {
    // You can add extra effects here if you want
    console.log("Celebration!");
}


/* ------------------------------------------------
   FALLING ROSES LOGIC (CANVAS)
------------------------------------------------ */
const canvas = document.getElementById('roseCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let roses = [];

// Resize canvas to fill screen
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);
resize();

// Mouse tracking
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

class Rose {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * -height; // Start above screen
        this.size = Math.random() * 20 + 20; // Size between 20px and 40px
        this.speedY = Math.random() * 2 + 1; // Falling speed
        this.speedX = Math.random() * 1 - 0.5; // Drift left/right
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 2 - 1;
        this.bounced = false; // Has it hit the bottom?
    }

    update() {
        // Apply Gravity
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;

        // MOUSE INTERACTION (Kick the roses)
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) { // If mouse is close (100px)
            const angle = Math.atan2(dy, dx);
            const force = (100 - distance) / 10; // Stronger force if closer
            this.x += Math.cos(angle) * force * 5;
            this.y += Math.sin(angle) * force * 5;
            // Wake up if it was resting
            if (this.bounced) {
                 this.speedY = -5; // Jump up
                 this.bounced = false;
            }
        }

        // FLOOR COLLISION (Pile up)
        if (this.y + this.size > height) {
            this.y = height - this.size;
            this.speedY *= -0.4; // Bounce effect
            this.speedX *= 0.9; // Friction

            // If moving very slowly, stop completely to simulate piling
            if (Math.abs(this.speedY) < 0.5) {
                this.speedY = 0;
                this.speedX = 0;
                this.rotationSpeed = 0;
                this.bounced = true;
            }
        } else {
            // Gravity accelerates falling
            if (!this.bounced) {
                this.speedY += 0.05;
            }
        }

        // Wall Collision (Bounce off sides)
        if (this.x < 0 || this.x > width) {
            this.speedX *= -1;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.font = `${this.size}px serif`;
        ctx.fillText('🌹', -this.size/2, this.size/2); // Draw rose centered
        ctx.restore();
    }
}

// Create 50 roses
function initRoses() {
    for (let i = 0; i < 50; i++) {
        roses.push(new Rose());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height); // Clear screen
    
    roses.forEach(rose => {
        rose.update();
        rose.draw();
    });

    requestAnimationFrame(animate);
}

// Start the animation
initRoses();
animate();

// Add more roses periodically
setInterval(() => {
    if (roses.length < 150) { // Limit to 150 roses so it doesn't lag
        roses.push(new Rose());
    }
}, 1000);
