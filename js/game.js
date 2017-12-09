// 这段代码监听游戏玩家的键盘点击事件并且代表将按键的关键数字送到 Play.handleInput()
document.addEventListener('keyup', (e) => {
    let allowedKeys = {
        13: 'enter',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    // 游戏运行才能移动
    SnakeControl.handleInput(allowedKeys[e.keyCode]);
    // 获胜或失败时按下enter键，游戏重新开始
    //Game.handleEnterInput(allowedKeys[e.keyCode]);
});

/**
* 使用MVC模式来设计程序
*/
// 蛇的数据  M
let SnakeModel = {
  numRows: 6,
  numCols: 5,
  snake: [],
  init () {
    for (row = 0; row < this.numRows; row++) {
        for (col = 0; col < this.numCols; col++) {
          this.snake.push({x: row, y: col});
      }
    }
  }
}

// 控制器  C
let SnakeControl = {
  // 上下左右按键移动蛇的位置
  handleInput (keyCode) {
      switch (keyCode) {
      case 'left':

          break;
      case 'up':

          break;
      case 'right':

          break;
      case 'down':

          break;
      default:
          break;
      }
    },

}

// 视图 V 绘制
let SnakeView = {
  width: 10,
  height: 10,
  row: 0,
  col: 0,
  snakeColor: '#89EA65',
  init () {

  },
  drawSnake() {
    snake.forEach((index, item) => {
      ctx.fillStyle = this.snakeColor;
      ctx.fillRect(item ,this.width, this.height);
    })
  },
  move () {

  }
}
SnakeView.init();
