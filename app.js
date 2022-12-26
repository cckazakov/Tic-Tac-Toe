window.addEventListener('DOMContentLoaded', () => {
  /*
    On Window Load. We have to do following things:

    1: By Default Render 3x3 Grid with Tiles
    2: Set Players
    3: Set Winning Conditions
  */

  // Grid Tiles
  let tiles = [];
  
  // Name of player whose turn is now
  const playerDisplay = document.querySelector('.display-player');
  
  // Reset Game
  const resetButton = document.querySelector('#reset');
  
  // Announce Game with Winning Player name / Tie
  const announcer = document.querySelector('.announcer');

  // Default Grid Size (3x3) will be handled later dynamically on user selection
  let size = 3;

  // Default Current Container
  let currentContainer = 3;

  // Array for board for selected tiles.
  let board = [];

  // Current Player who will start the game
  let currentPlayer = 'X';

  // By Default game is active till someone wins / Tie
  let isGameActive = true;

  // Players Constants to match winning.
  const PLAYERX_WON = 'PLAYERX_WON';
  const PLAYERO_WON = 'PLAYERO_WON';
  const PLAYERC_WON = 'PLAYERC_WON';
  const TIE = 'TIE';

  // Winning Conditions
  let winningConditions = [];

  // Initialize game
  initGame();

  function initGame() {
    // Set Board

    const grid = getGrid();

    board.length = 0;
    board.length = grid;
    board = board.fill('');

    setGrid();
    generateWiningConditions();
  }

  // Set Our game Grid of specified size default will be (3x3)

  function setGrid() {
    // Set HTML Grid

    const grid = getGrid();

    const container = document.getElementById('container');
    while (container.firstChild) {
      container.firstChild.remove();
    }

    container.classList.remove(`container-${currentContainer}`);
    container.classList.add(`container-${size}`);

    // Set Current Container
    currentContainer = size;

    for (let box = 0; box < grid; box++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');

      container.append(tile);
    }

    setGridTiles(); 
  }

  // Get our Game Grid
  function getGrid() {
    const grid = size * size;

    return grid;
  }

  // Set Tiles in Grid Dynamically
  function setGridTiles() {
    tiles = Array.from(document.querySelectorAll('.tile'));
    tiles.forEach((tile, index) => {
      tile.addEventListener('click', () => {
        userAction(tile, index);
      });
    });
  }

  // Generate Wining Conditions of game for Win.
  function generateWiningConditions() {
    let wins = [];

    const gridItems = board.map((item, index) => index);
    let rows = [],
      index = 0,
      total = gridItems.length;
    // Generate Row Conditions
    while (index < total) {
      rows.push(gridItems.slice(index, (index += Number(currentContainer))));
    }

    wins = [...rows];

    // Generate Column Conditions
    const columnConditions = [];

    for (let item = 0; item < currentContainer; item++) {
      const condition = wins.map((array, i) => array[item]);
      columnConditions.push(condition);
    }

    // Generate Diagnoal Conditions
    const diagonalA = [];
    const diagonalB = [];
    let dA = 0;
    let dB = currentContainer - 1;

    for (let row = 0; row < wins.length; row++) {
      const rowArray = wins[row];

      const firstIndex = rowArray[dA];
      const lastIndex = rowArray[dB];

      diagonalA.push(firstIndex);
      diagonalB.push(lastIndex);

      dA++;
      dB--;
    }

    wins.push(diagonalA);
    wins.push(diagonalB);

    columnConditions.forEach((condition) => {
      wins.push(condition);
    });

    // Combine all conditions
    winningConditions = [...wins];
  }

  // Validate the Result on selecting each tile.
  function handleResultValidation() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
      const winCondition = winningConditions[i];

      let selectedTiles = [];
      for (let x = 0; x < currentContainer; x++) {
        const a = board[winCondition[x]];
        selectedTiles.push(a);
      }

      // Check if all vars are equal to each other.
      const isAnyEmpty = selectedTiles.some((item) => item === '');
      const allSame = selectedTiles.every((item) => item === currentPlayer);
      if (isAnyEmpty) {
        continue;
      }
      if (!isAnyEmpty && allSame) {
        roundWon = true;
        break;
      }
    }

    // If round won announce winner.
    if (roundWon) {
      if (currentPlayer === 'X') {
        announce(PLAYERX_WON);
      } else if (currentPlayer === 'O') {
        announce(PLAYERO_WON);
      } else {
        announce(PLAYERC_WON);
      }
      isGameActive = false;
      return;
    }

    // If no result than announce Tie
    if (!board.includes('')) announce(TIE);
  }

  // Announce result
  const announce = (type) => {
    switch (type) {
      case PLAYERO_WON:
        announcer.innerHTML = '<span class="playerO">Andrei</span> Won';
        break;
      case PLAYERX_WON:
        announcer.innerHTML = '<span class="playerX">Sergey</span> Won';
        break;
      case PLAYERC_WON:
        announcer.innerHTML = '<span class="playerC">Computer</span> Won';
        break;
      case TIE:
        announcer.innerText = 'Tie';
    }
    announcer.classList.remove('hide');
  };

  // Check if the user called valid action.
  const isValidAction = (tile) => {
    if (
      tile.innerText === 'X' ||
      tile.innerText === 'O' ||
      tile.innerText === 'C'
    ) {
      return false;
    }

    return true;
  };

  // Update Board after any selection.
  const updateBoard = (index) => {
    board[index] = currentPlayer;
  };

  // Change player for next turn.
  const changePlayer = (reset = false) => {
    playerDisplay.classList.remove(`player${currentPlayer}`);
    if (reset) {
      setPlayer('X');
    } else if (currentPlayer === 'X') {
      setPlayer('O');
    } else if (currentPlayer === 'O') {
      setPlayer('C');
    } else {
      setPlayer('X');
    }
  };

  // Set Next Player
  const setPlayer = (player) => {
    currentPlayer = player;
    if (currentPlayer === 'X') {
      playerDisplay.innerText = 'Sergey';
    } else if (currentPlayer === 'O') {
      playerDisplay.innerText = 'Andrei';
    } else {
      playerDisplay.innerText = 'Computer';
    }
    playerDisplay.classList.add(`player${currentPlayer}`);

    // Select Random Tile for Computer's Tuen
    if (currentPlayer === 'C') {
      setRandomTile();
    }
  };

  // Select Random Tile for Selection automatically on computer's turn. A delay for 1s is added.
  const setRandomTile = () => {
    const emptyTiles = tiles.filter((tile, index) => {
      if (tile.innerText === '') {
        return index;
      }
    });

    if (emptyTiles && emptyTiles.length) {
      const min = 0;
      const max = emptyTiles.length - 1;

      const selectedTile = Math.floor(Math.random() * (max - min)) + min;

      setTimeout(() => {
        emptyTiles[selectedTile].click();
      }, 1000);
    }
  };

  // Handle user user click on tile selection.
  const userAction = (tile, index) => {
    if (isValidAction(tile) && isGameActive) {
      tile.innerText = currentPlayer;
      tile.classList.add(`player${currentPlayer}`);
      updateBoard(index);
      handleResultValidation();
      changePlayer();
    }
  };

  // Reset Game
  const resetBoard = () => {
    announcer.classList.add('hide');

    changePlayer(true);

    tiles.forEach((tile) => {
      tile.innerText = '';
      tile.classList.remove('playerX');
      tile.classList.remove('playerO');
      tile.classList.remove('playerC');
    });

    initGame();
    isGameActive = true;
  };

  resetButton.addEventListener('click', resetBoard);

  const gridSize = document.getElementById('gridSize');

  // Handle Grid selection
  gridSize.addEventListener('change', (e) => {
    size = e.target.value;

    resetBoard();
  });
});
