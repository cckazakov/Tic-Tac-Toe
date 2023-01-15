class Player {
  constructor(id, name, nick, isActive = false) {
    this.id = id;
    this.name = name;
    this.nick = nick;
    this.isActive = isActive;
  }

  computerMove() {
    const tiles = Array.from(document.querySelectorAll('.tile'));

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
  }
}
