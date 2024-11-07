document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    const controls = document.createElement('div');
    controls.className = 'controls';
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restartovat hru';
    const moveCounter = document.createElement('div');
    moveCounter.textContent = 'Tahů: 0';
    const playerOnTurn = document.createElement('div');
    playerOnTurn.textContent = 'Na tahu je hráč 1';

    controls.appendChild(restartButton);
    controls.appendChild(moveCounter);
    controls.appendChild(playerOnTurn);
    app.appendChild(controls);

    const board = document.createElement('div');
    board.className = 'board';
    app.appendChild(board);
    
    let moves = 0;
    let currentPlayer = 1;
    let matchesPlayer1 = 0;
    let matchesPlayer2 = 0;
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchedPairs = 0;

    function generateCardImages() {
        const images = ['cat1.webp', 'cat2.webp', 'cat3.webp', 'cat4.webp', 'cat5.webp', 'cat6.webp', 'cat7.webp', 'cat8.webp'];
        const gameValues = images.concat(images);
        return gameValues.sort(() => Math.random() - 0.5);
    }

    setupBoard();

    function setupBoard() {
        board.style.gridTemplateColumns = `repeat(4, 1fr)`;
        board.style.gridTemplateRows = `repeat(4, 1fr)`;
        board.innerHTML = '';
        moves = 0;
        matchedPairs = 0;
        matchesPlayer1 = 0;
        matchesPlayer2 = 0;
        currentPlayer = 1;
        moveCounter.textContent = 'Tahů: 0';
        playerOnTurn.textContent = 'Na tahu je hráč 1';
        lockBoard = false;
        firstCard = null;
        secondCard = null;

        const cardImages = generateCardImages();

        cardImages.forEach(image => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.image = image;
            card.addEventListener('click', flipCard);
            board.appendChild(card);

            const img = document.createElement('img');
            img.src = `images/${image}`;
            img.classList.add('hidden');
            card.appendChild(img);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');
        this.querySelector('img').classList.remove('hidden');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;
        moves++;
        moveCounter.textContent = `Tahů: ${moves}`;

        if (firstCard.dataset.image === secondCard.dataset.image) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matchedPairs++;
            if (currentPlayer === 1) {
                matchesPlayer1++;
            } else {
                matchesPlayer2++;
            }

            if (matchedPairs === 8) { 
                setTimeout(() => {
                    if (matchesPlayer1 > matchesPlayer2) {
                        alert(`Hra skončila! Vyhrává hráč 1 s ${matchesPlayer1} dvojicemi. Celkový počet tahů: ${moves}`);
                    } else if (matchesPlayer2 > matchesPlayer1) {
                        alert(`Hra skončila! Vyhrává hráč 2 s ${matchesPlayer2} dvojicemi. Celkový počet tahů: ${moves}`);
                    } else {
                        alert(`Hra skončila! Remíza - oba hráči mají ${matchesPlayer1} dvojic. Celkový počet tahů: ${moves}`);
                    }
                }, 500);
            }
            resetTurn();
        } else {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard.querySelector('img').classList.add('hidden');
                secondCard.querySelector('img').classList.add('hidden');
                
                currentPlayer = currentPlayer === 1 ? 2 : 1;
                playerOnTurn.textContent = `Na tahu je hráč ${currentPlayer}`;
                
                resetTurn();
            }, 1000);
        }
    }

    function resetTurn() {
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    restartButton.addEventListener('click', setupBoard);
});

