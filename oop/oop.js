window.addEventListener('DOMContentLoaded', () => {
  /*
      On Window Load. We have to do following things:
  
      1: By Default Render 3x3 Grid with Tiles
      2: Set Players
      3: Set Winning Conditions
    */

  // Reset Game
  const resetButton = document.querySelector('#reset');

  // Announce Game with Winning Player name / Tie
  const announcer = document.querySelector('.announcer');

  // Default Grid Size (3x3) will be handled later dynamically on user selection
  let size = 3;
  let lastSize = 3;

  let game = new Game(size);
  refresh();

  // Reset Game
  const resetBoard = () => {
    announcer.classList.add('hide');

    game.changePlayer(true);
    game.resetGame(lastSize);

    game = new Game(size, lastSize);
    refresh();
  };

  function refresh() {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    tiles.forEach((tile, index) => {
      tile.addEventListener('click', () => {
        game.userAction(tile, index);
      });
    });
  }

  resetButton.addEventListener('click', resetBoard);

  const gridSize = document.getElementById('gridSize');

  // Handle Grid selection
  gridSize.addEventListener('change', (e) => {
    lastSize = size;
    size = e.target.value;
    resetBoard();
  });
});
