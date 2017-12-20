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
    this.snake.length = 0;
    // 第一个元素是尾部
    for (row = 0; row < this.numRows; row++) {
        this.snake.push({x: row, y: 0});
    }
  },
  snakeMove (direction) {
    let length = this.snake.length;
    let newHead = this.snake[length - 1];
    switch (direction) {
      case 'left':
          newHead = { x: this.snake[length - 1].x - 1, y: this.snake[length - 1].y }
          break;
      case 'up':
          newHead = { x: this.snake[length - 1].x, y: this.snake[length - 1].y - 1 }
          break;
      case 'right':
          newHead = { x: this.snake[length - 1].x + 1, y: this.snake[length - 1].y }
          break;
      case 'down':
          newHead = { x: this.snake[length - 1].x, y: this.snake[length - 1].y + 1}
          break;
      default:
          break;
    }
    if (SnakeControl.checkCollisions(newHead, this.snake)) {
      // 添加蛇头部
      this.snake.push(newHead);
      // 清除画布
      SnakeControl.clearTail(this.snake[0]);
      // 移除蛇尾部
      this.snake.shift();
    }
    // 游戏是否结束
    if(!SnakeControl.gameStartS) {
      SnakeControl.gameStart();
    }
  }
}

// 控制器  C
let SnakeControl = {
  speed: 300,
  curDirect: 'right', // 记录当前方向
  gameStartS:  true, // 游戏开始状态
  timer: '',
  init () {
    clearTimeout(this.timer);
    SnakeModel.init();
    this.move();
  },
  gameStart () {
    this.gameStartS = true;
    this.init();
    SnakeView.init();
  },
  // 上下左右按键移动蛇的位置
  handleInput (keyCode) {
      switch (keyCode) {
      case 'left':
          // if(this.curDirect == 'right' || this.curDirect == 'left') return;
          this.curDirect = keyCode;
          break;
      case 'up':
          //if(this.curDirect == 'down' || this.curDirect == 'up') return;
          this.curDirect = keyCode;
          break;
      case 'right':
        //  if(this.curDirect == 'left' || this.curDirect == 'right') return;
          this.curDirect = keyCode;
          break;
      case 'down':
        //  if(this.curDirect == 'up' || this.curDirect == 'down') return;
          this.curDirect = keyCode;
          break;
      default:
          break;
      }
  },
  getSnake () {
    return SnakeModel.snake;
  },
  move () {
    this.timer = setInterval(() => {
      SnakeModel.snakeMove(this.curDirect);
      if(this.gameStartS == true) {
        SnakeView.drawSnake();
      }
    }, this.speed);
  },
  clearTail (tail) {
    SnakeView.clearTail(tail)
  },
  // 检测是否碰撞
  checkCollisions (newHead, oldSNake) {
    let snake = oldSNake;
    let length = oldSNake.length;
    // 遍历蛇的坐标，与蛇头作对比，如果蛇头与蛇身坐标相等即为碰撞
    snake.forEach((item,index) => {
      if(index == length-1) return;
      if(newHead.x == item.x && newHead.y == item.y) {
        alert('游戏失败');
        this.gameStartS = false;
        // 清除画布
        SnakeView.clearCanvas();
        return false;
      }
    });
    return true;
  }
}

// 视图 V 绘制
let SnakeView = {
  width: 10,
  height: 10,
  row: 0,
  col: 0,
  snakeColor: '#89EA65',
  snakeArr: [],
  init () {
    this.snakeArr = SnakeControl.getSnake();
    this.drawSnake();
  },
  drawSnake() {
    this.snakeArr.forEach((item, index) => {
      ctx.fillStyle = this.snakeColor;
      ctx.fillRect(item.x * this.width, item.y * this.height, this.width, this.height);
    });
  },
  clearTail (tail) {
    ctx.clearRect(tail.x * this.width, tail.y * this.height, this.width, this.height);
  },
  clearCanvas (snake) {
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  }
}
SnakeControl.gameStart();
