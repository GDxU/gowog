import Phaser from 'phaser';
//import effect from './Shader';

export default class extends Phaser.Sprite {
  constructor ({ game, layer, shaders, blockWidth, blockHeight, numCols, numRows, blocks}) {
    super(game, 0, 0);
    this.graphicBlocks = []; // 1D array storing all blocks
    this.mapBlocks = []; // 2D array of int
    this.rectBlocks = []; // 1D array of rectangle for collision detection

    this.numCols = numCols;
    this.numRows = numRows;
    this.gameWidth = numCols * blockWidth;
    this.gameHeight = numRows * blockHeight;
    this.blockWidth = blockWidth;
    this.blockHeight = blockHeight;

    // Generate map from blocks
    // blocks is 1D array of binary, 0 is empty and 1 is block
    // We need to deserialize blocks
    for (var i = 0; i < this.numRows; i++) {
      this.mapBlocks.push([]);
      for (var j = 0; j < this.numCols; j++) {
        var idx = i * this.numCols + j;
        if (blocks[idx] !== 0) {
          var graphic = game.add.sprite(0, 0, 'wall');
          graphic.width = blockWidth;
          graphic.height = blockHeight;
          graphic.x = blockWidth * j
          graphic.y = blockWidth * i

          this.addChild(graphic);

          //graphic.filters = shaders;

          this.graphicBlocks.push(graphic);
          this.rectBlocks.push(
            new Phaser.Rectangle(blockWidth * j, blockHeight * i, blockWidth, blockHeight)
          );
        }

        this.mapBlocks[i].push(blocks[idx]);
      }
    }

    var boundary = new Phaser.Graphics(this.game, 0, 0);
    boundary.lineStyle(2, 0xFFFFFF);
    boundary.drawRect(0, 0, this.gameWidth, this.gameHeight);
    this.addChild(boundary);
    //boundary.filters = shaders;

    game.add.existing(this);
    layer.add(this);
  }

  isCollide (x, y) {
    let r = Math.floor(y / this.blockHeight);
    let c = Math.floor(x / this.blockWidth);
    if (r < 0 || r >= this.numRows || c < 0 || c >= this.numCols) {
      return false;
    }
    return this.mapBlocks[r][c] !== 0;
  }

  isInMap (x, y) {
    return x >= 0 && x <= this.gameWidth && y >= 0 && y <= this.gameHeight;
  }
}
