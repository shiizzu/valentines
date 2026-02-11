/* =========================================
   PART 1: THE BUTTONS (CRITICAL SYSTEM)
   This code runs immediately so buttons always work.
   ========================================= */

// Define the function globally so HTML can find it
window.nextPage = function(pageNumber) {
    // 1. Log to console to prove it's working
    console.log("Switching to page " + pageNumber);

    // 2. Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // 3. Show the requested page
    const nextPage = document.getElementById(`page${pageNumber}`);
    if (nextPage) {
        nextPage.classList.add('active');
    } else {
        console.log("Error: Could not find page" + pageNumber);
    }

    // 4. Celebration for the final page
    if (pageNumber === 4) {
        console.log("She said YES!");
    }
};

// The "Run Away" Button Logic
window.moveButton = function() {
    const noBtn = document.getElementById('noBtn');
    if (!noBtn) return;

    const maxWidth = window.innerWidth - 150;
    const maxHeight = window.innerHeight - 100;

    const randomX = Math.floor(Math.random() * maxWidth);
    const randomY = Math.floor(Math.random() * maxHeight);

    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
};


/* =========================================
   PART 2: THE ROSES (DECORATION SYSTEM)
   Wrapped in a "Try-Catch" block so it can't crash the site.
   ========================================= */

try {
    // Wait for page to load before starting roses
    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('roseCanvas');
        
        // If canvas is missing, stop quietly
        if (!canvas) {
            console.log("Rose canvas not found. Skipping animation.");
            return;
        }

        const ctx = canvas.getContext('2d');
        let width, height;
        let roses = [];

        function resize() {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        }
        window.addEventListener('resize', resize);
        resize();

        let mouseX = 0;
        let mouseY = 0;
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        class Rose {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * -height;
                this.size = Math.random() * 20 + 20;
                this.speedY = Math.random() * 1 + 0.5;
                this.speedX = Math.random() * 1 - 0.5;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 2 - 1;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotationSpeed;

                // Mouse Interaction
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < 100) {
                     const angle = Math.atan2(dy, dx);
                     this.x += Math.cos(angle) * 5;
                     this.y += Math.sin(angle) * 5;
                }

                if (this.y > height) {
                    this.y = -50; // Reset to top
                    this.x = Math.random() * width;
                }
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

        for (let i = 0; i < 50; i++) {
            roses.push(new Rose());
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);
            roses.forEach(rose => {
                rose.update();
                rose.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    });

} catch (error) {
    console.log("Roses failed to load, but buttons are safe!");
    console.error(error);
}
