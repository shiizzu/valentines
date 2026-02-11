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
    setInterval(createHeart, 300);
}

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = Math.random() * 3 + 2 + "s";
    document.body.appendChild(heart);
    setTimeout(() => {
        heart.remove();
    }, 5000);
}