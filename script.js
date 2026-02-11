document.addEventListener('DOMContentLoaded', () => {
    
    /* ------------------------------------------------
       1. PAGE NAVIGATION LOGIC
    ------------------------------------------------ */
    // We attach the function to the window so the HTML buttons can see it
    window.nextPage = function(pageNumber) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show the requested page
        const nextPage = document.getElementById(`page${pageNumber}`);
        if (nextPage) {
            nextPage.classList.add('active');
        } else {
            console.error("Could not find page" + pageNumber);
        }

        // Special celebration on the final page
        if (pageNumber === 4) {
            startCelebration();
        }
    };

    // The "No" button runner
    window.moveButton = function() {
        const noBtn = document.getElementById('noBtn');
        if (!noBtn) return; // Safety check

        const maxWidth = window.innerWidth - 150;
        const maxHeight = window.innerHeight - 100;

        const randomX = Math.floor(Math.random() * maxWidth);
        const randomY = Math.floor(Math.random() * maxHeight);

        noBtn.style.position = 'fixed';
        noBtn.style.left = randomX + 'px';
        noBtn.style.top = randomY + 'px';
    };

    function startCelebration() {
        console.log("Celebration time!");
        // You can add more confetti logic here later if you want
    }


    /* ------------------------------------------------
       2. FALLING ROSES LOGIC
    ------------------------------------------------ */
    const canvas = document.getElementById('roseCanvas');
    
    // SAFETY CHECK: If canvas isn't found, stop here so we don't crash the buttons
    if (!canvas) {
        console.error("Canvas element not found! Check your HTML id='roseCanvas'");
        return;
    }

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
    resize(); // Call it once immediately

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
            this.size = Math.random() * 20 + 20; 
            this.speedY = Math.random() * 2 + 1; 
            this.speedX = Math.random() * 1 - 0.5; 
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
            this.bounced = false; 
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            // Interaction
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) { 
                const angle = Math.atan2(dy, dx);
                const force = (100 - distance) / 10; 
                this.x += Math.cos(angle) * force * 5;
                this.y += Math.sin(angle) * force * 5;
                if (this.bounced) {
                     this.speedY = -5; 
                     this.bounced = false;
                }
            }

            // Floor
            if (this.y + this.size > height) {
                this.y = height - this.size;
                this.speedY *= -0.4; 
                this.speedX *= 0.9; 

                if (Math.abs(this.speedY) < 0.5) {
                    this.speedY = 0;
                    this.speedX = 0;
                    this.rotationSpeed = 0;
                    this.bounced = true;
                }
            } else {
                if (!this.bounced) this.speedY += 0.05;
            }

            // Walls
            if (this.x < 0 || this.x > width) this.speedX *= -1;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.font = `${this.size}px serif`;
            ctx.fillText('🌹', -this.size/2, this.size/2); 
            ctx.restore();
        }
    }

    // Create initial roses
    function initRoses() {
        for (let i = 0; i < 50; i++) {
            roses.push(new Rose());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height); 
        roses.forEach(rose => {
            rose.update();
            rose.draw();
        });
        requestAnimationFrame(animate);
    }

    // Start
    initRoses();
    animate();

    // Add more periodically
    setInterval(() => {
        if (roses.length < 150) { 
            roses.push(new Rose());
        }
    }, 1000);

});
