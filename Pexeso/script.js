document.addEventListener('DOMContentLoaded', () => {
    const app = document.getElementById('app');

    const controls = document.createElement('div');
    controls.className = 'controls';
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restartovat hru';
    const moveCounter = document.createElement('div');
    moveCounter.textContent = 'Tahů: 0';
    const playerOnTurn = document.createElement('div');
    playerOnTurn.textContent = 'Na tahu je hráč 1'

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

    function generateCardValues() {
        const values = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const gameValues = values.concat(values);
        return gameValues.sort(() => Math.random() - 0.5);
    }

    const cardValues = generateCardValues();
    setupBoard();

    function setupBoard() {
        board.style.gridTemplateColumns = `repeat(4, 1fr)`;
        board.style.gridTemplateRows = `repeat(4, 1fr)`;
        board.innerHTML = '';
        moves = 0;
        moveCounter.textContent = 'Tahů: 0';
        matchedPairs = 0;
        lockBoard = false;
        firstCard = null;
        secondCard = null;

        cardValues.forEach(value => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.value = value;
            card.addEventListener('click', flipCard);
            board.appendChild(card);
        });
    }

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');
        this.textContent = this.dataset.value;

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;
        moves++;
        moveCounter.textContent = `Tahů: ${moves}`;

        if (firstCard.dataset.value === secondCard.dataset.value) {
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matchedPairs++;
            switch(currentPlayer){
                case 1:
                    matchesPlayer1++;
                    break;
                case 2:
                    matchesPlayer2++;
                    break;
            }
            
            if (matchedPairs === cardValues.length / 2) {
                if (matchesPlayer1 > matchesPlayer2) {
                    setTimeout(() => alert(`Hra skončila! Vyhrává hráč 1 s ${matchesPlayer1} dvojcemi. Celkový počet tahů: ${moves}`), 500);
                }
                if (matchesPlayer2 > matchesPlayer1) {
                    setTimeout(() => alert(`Hra skončila! Vyhrává hráč 2 s ${matchesPlayer2} dvojcemi. Celkový počet tahů: ${moves}`), 500);
                }
                if (matchesPlayer1 == matchesPlayer2) {
                    setTimeout(() => alert(`Hra skončila! Vyhrává hráč 1 i dva se stejným počtem dvojcí a to ${dvojceHrac1}. Celkový počet tahů: ${moves}`), 500);
                }
            }
            resetTurn();
        } else {
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                firstCard.textContent = '';
                secondCard.textContent = '';
                switch (currentPlayer) {
                    case 1:
                        currentPlayer++;
                        break;
                    case 2:
                        currentPlayer--;
                        break;
                }
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