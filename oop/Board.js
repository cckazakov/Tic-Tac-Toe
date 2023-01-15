class Board {
  constructor(size, lastSize) {
    this._size = size * 1;
    this.currentContainer = lastSize * 1;
    this.grid = this.getGrid(size);
    this.board = this.createBoard();
    this.tiles = [];
  }

  getGrid() {
    const size = this.size;
    if (!size) {
      return 9;
    }
    return Number(size) * Number(size);
  }

  setGrid() {
    // Set HTML Grid

    const grid = this.getGrid();

    const container = document.getElementById('container');
    while (container.firstChild) {
      container.firstChild.remove();
    }

    container.classList.remove(`container-${this.container}`);
    container.classList.add(`container-${this.size}`);

    // Set Current Container
    this.container = this.size;

    for (let box = 0; box < grid; box++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');

      container.append(tile);
    }

    this.setGridTiles()
  }

  setGridTiles() {
    this.tiles = Array.from(document.querySelectorAll('.tile'));
    this.gridTiles = this.tiles
  }

  get gridTiles() {
    return this.tiles;
  }

  set gridTiles(val) {
    this.tiles = [...val];
  }

  get size() {
    return Number(this._size);
  }

  set size(val) {
    this._size = val * 1;
  }

  get container() {
    return this.currentContainer * 1;
  }

  set container(val) {
    this.currentContainer = val * 1;
  }

  createBoard() {
    let board = []
    board.length = this.getGrid();
    board = board.fill('');

    this.setGrid();

    return board;
  }

  get boardInfo() {
    return this.board;
  }

  updateBoard(index, player) {
    this.board[index] = player;
  }

  resetBoard() {
    this.tiles.forEach((tile) => {
      tile.innerText = '';
      tile.classList.remove('playerX');
      tile.classList.remove('playerO');
      tile.classList.remove('playerC');
    });
  }
}
