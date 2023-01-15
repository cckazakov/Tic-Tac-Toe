class Game {
  constructor(size, lastSize = 3) {
    this.isGameActive = true;
    this._size = Number(size);
    this.board = new Board(size, lastSize);
    this.currentPlayer = null;
    this.players = this.createPlayers();
    this.winningConditions = this.generateWiningConditions();
  }

  get size() {
    return this._size;
  }

  set size(val) {
    this._size = val;
  }

  get activePlayer() {
    return this.currentPlayer;
  }

  set activePlayer(player) {
    this.currentPlayer = player;
  }

  createPlayers() {
    const player1 = new Player(1, 'Sergey', 'X', true);
    const player2 = new Player(2, 'Andrei', 'O', false);
    const player3 = new Player(3, 'Computer', 'C', false);

    this.activePlayer = player1;

    return [player1, player2, player3];
  }

  changePlayer(reset = false, player) {
    const playerDisplay = document.querySelector('.display-player');
    playerDisplay.classList.remove(`player${this.activePlayer.nick}`);

    let nextPlayer = null;
    if (reset) {
      nextPlayer = this.players[0];
    } else {
      if (player.nick === 'X') {
        nextPlayer = this.players[1];
      } else if (player.nick === 'O') {
        nextPlayer = this.players[2];
      } else {
        nextPlayer = this.players[0];
      }
    }

    playerDisplay.innerText = nextPlayer.name;
    playerDisplay.classList.add(`player${nextPlayer.nick}`);

    this.activePlayer = nextPlayer;

    const activePlayer = this.activePlayer;

    if (this.activePlayer.nick === 'C') {
      activePlayer.computerMove();
    }
  }

  userAction(tile, index) {
    if (this.isValidAction(tile) && this.isGameActive) {
      const activePlayer = this.activePlayer;
      tile.innerText = activePlayer.nick;
      tile.classList.add(`player${activePlayer.nick}`);
      this.board.updateBoard(index, activePlayer.nick);
      this.handleResultValidation();
      this.changePlayer(false, activePlayer);
    }
  }

  isValidAction(tile) {
    if (
      tile.innerText === 'X' ||
      tile.innerText === 'O' ||
      tile.innerText === 'C'
    ) {
      return false;
    }

    return true;
  }

  handleResultValidation() {
    let roundWon = false;
    const activePlayer = this.activePlayer;

    for (let i = 0; i < this.winningConditions.length; i++) {
      const winCondition = this.winningConditions[i];

      let selectedTiles = [];
      for (let x = 0; x < this.size; x++) {
        const a = this.board.boardInfo[winCondition[x]];
        selectedTiles.push(a);
      }

      // Check if all vars are equal to each other.
      const isAnyEmpty = selectedTiles.some((item) => item === '');
      const allSame = selectedTiles.every((item) => item === activePlayer.nick);
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
      this.announce(null, activePlayer)
      this.isGameActive = false;
      return;
    }

    // If no result than announce Tie
    if (!this.board.boardInfo.includes('')) this.announce('tie', null);
  }

  announce(tie, player) {
    const announcer = document.querySelector('.announcer');

    if (player && !tie) {
      announcer.innerHTML = `<span class="player${player.nick}">${player.name}</span> Won`;
    } else {
      announcer.innerText = 'Tie';
    }
    
    announcer.classList.remove('hide');
  };

  generateWiningConditions() {
    let wins = [];

    const gridItems = this.board.boardInfo.map((item, index) => index);
    let rows = [],
      index = 0,
      total = gridItems.length;
    // Generate Row Conditions
    while (index < total) {
      rows.push(gridItems.slice(index, (index += Number(this.size))));
    }

    wins = [...rows];

    // Generate Column Conditions
    const columnConditions = [];

    for (let item = 0; item < this.size; item++) {
      const condition = wins.map((array, i) => array[item]);
      columnConditions.push(condition);
    }

    // Generate Diagnoal Conditions
    const diagonalA = [];
    const diagonalB = [];
    let dA = 0;
    let dB = this.size - 1;

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
    const winningConditions = [...wins];

    return winningConditions;
  }

  resetGame() {
    this.board.resetBoard();
    this.isGameActive = true;
  }
}
