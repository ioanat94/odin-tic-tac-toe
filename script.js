var domElements = (function() {
    let squareList = Array.from(document.getElementsByClassName('game-square'));
    let currentPlayer = document.getElementById('current-player');
    let resetButton = document.getElementById('reset-button');

    return {
        squareList: squareList,
        currentPlayer: currentPlayer,
        resetButton: resetButton
    };
})();

const Player = function(sign) {
    this.sign = sign;
    this.choices = [];
}

var gameBoard = (function() {
    let board = ['', '', '', '', '', '', '', '', ''];

    function populateBoard() {
        for (let i = 0; i < domElements.squareList.length; i++) {
            domElements.squareList[i].textContent = board[i];
        };
    }

    function resetGame() {
        for (let i = 0; i < board.length; i++) {
            board[i] = '';
        };
    }

    return {
        populateBoard: populateBoard,
        resetGame: resetGame,
        board: board
      };
})();

var displayController = (function() {
    function setChoice(index, sign) {
        if (gameBoard.board[index] == '') {
            gameBoard.board[index] = sign;
            gameBoard.populateBoard();
        };
    };

    return {
        setChoice: setChoice
    };
})();

var gameController = (function() {
    let playerX = new Player('X');
    let playerO = new Player('O');
    let round = 1;
    let isOver = false;
    const winConditions = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];

    (function playRound() {
        for (let i = 0; i < domElements.squareList.length; i++) {
            domElements.squareList[i].addEventListener('click', function() {
                if (!isOver && gameBoard.board[i] == '') {
                    if (round % 2 == 0) {
                        displayController.setChoice(i, playerO.sign);
                        playerO.choices.push(i);
                        domElements.currentPlayer.textContent = `Player ${playerX.sign}'s turn`;
                    } else {
                        displayController.setChoice(i, playerX.sign);
                        playerX.choices.push(i);
                        domElements.currentPlayer.textContent = `Player ${playerO.sign}'s turn`;
                    }
                    round++;
                    checkResult();
                }
            });
        };
    })();

    let checkResult = function() {
        if (round == 10) {
            domElements.currentPlayer.textContent = 'It\'s a draw!';
            isOver = true;
        }

        for (let i = 0; i < winConditions.length; i++) {
            if (winConditions[i].every(r => playerO.choices.includes(r))) {
                domElements.currentPlayer.textContent = 'Player O wins!';
                isOver = true;
            } else if (winConditions[i].every(r => playerX.choices.includes(r))) {
                domElements.currentPlayer.textContent = 'Player X wins!';
                isOver = true;
            }
        }
    };

    let resetGame = function() {
        round = 1;
        isOver = false;
        playerX.choices = [];
        playerO.choices = [];
    }

    domElements.resetButton.addEventListener('click', function() {
        gameBoard.resetGame();
        gameBoard.populateBoard();
        resetGame();
        domElements.currentPlayer.textContent = `Player ${playerX.sign}'s turn`;
    });
})();