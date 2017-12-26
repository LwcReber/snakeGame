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
  addSnakeS: false, // 是否增加蛇的长度，依据：是否吃了食物
  snake: [],
  init () {
    this.snake.length = 0;
    // 第一个元素是尾部
    for (row = 0; row < this.numRows; row++) {
        this.snake.push({x: row, y: 10});
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
    // 判断是否吃了食物
    if(SnakeControl.newFood.x == newHead.x && SnakeControl.newFood.y == newHead.y) {
      this.addSnakeS = true;
    } else {
      this.addSnakeS = false;
    }
    if (SnakeControl.checkCollisions(newHead, this.snake)) {
      // 添加蛇头部
      this.snake.push(newHead);
      // 清除画布
      SnakeControl.clearTail(this.snake[0]);

      // 移除蛇尾部
      // 如果是吃了食物就不去掉尾部
      if(this.addSnakeS == false) {
        this.snake.shift();
      } else {
        SnakeControl.createFoodS = true;
        // 重新创建食物
        SnakeControl.createFood();
      }
    }
    // 游戏是否结束
    // if(!SnakeControl.gameStartS) {
    //
    // }
  },
  // 随机产生一个食物
  randomFood () {
    let newFood = {x: '', y : ''};
    let isOkFood = true;
    while (isOkFood) {
      newFood.x = Math.floor(Math.random() * (SnakeControl.foodMaxW));
      newFood.y = Math.floor(Math.random() * (SnakeControl.foodMaxH));
      // 不相等的情况下再次创建食物坐标
      this.snake.forEach((item,index) => {
        if(newFood.x != item.x && newFood.y != item.y) {
          isOkFood = false;
        }
      });
    }
    return newFood;
  }
}

// 控制器  C
let SnakeControl = {
  speed: 500,
  curDirect: '', // 记录当前方向
  gameStartS:  '', // 游戏开始状态
  createFoodS: '', // 生成食物的状态
  foodMaxW: '', // 食物的最大横坐标
  foodMaxH: '', // 食物的最大纵坐标
  newFood: '', // 记录model产生的食物坐标
  timer: '',
  init () {
    this.curDirect = 'right';
    clearTimeout(this.timer);
    this.foodMaxW = ctx.canvas.width / SnakeView.width;
    this.foodMaxH = ctx.canvas.height / SnakeView.height;
    SnakeModel.init();
    this.move();
  },
  changeDifficulty (t) {
    var index = t.selectedIndex;
    var val = t.options[index].value;
    this.speed = val;
    this.gameStart();
  },
  selectEvent () {
    console.log(event);
    if(event.keyCode == 38 ||event.keyCode == 40){
      //使HTML元素原来默认的事件失效
        event.returnValue=false;
        return false;
    }
  },
  gameStart () {
    // 清除画布
    SnakeView.clearCanvas();
    console.log(111);
    this.curDirect = 'right';
    this.gameStartS = true;
    this.createFoodS = true;
    this.init();
    SnakeView.init();
    this.createFood();
  },
  // 上下左右按键移动蛇的位置
  handleInput (keyCode) {
      switch (keyCode) {
      case 'left':
         if(this.curDirect == 'right' || this.curDirect == 'left') return;
          this.curDirect = keyCode;
          break;
      case 'up':
          if(this.curDirect == 'down' || this.curDirect == 'up') return;
          this.curDirect = keyCode;
          break;
      case 'right':
         if(this.curDirect == 'left' || this.curDirect == 'right') return;
          this.curDirect = keyCode;
          break;
      case 'down':
         if(this.curDirect == 'up' || this.curDirect == 'down') return;
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
         if(this.gameStartS == true) {
          SnakeModel.snakeMove(this.curDirect);
          SnakeView.drawSnake();
        } else {
          clearTimeout(this.timer);
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
    // 边界检测
    if (newHead.x == 50 || newHead.x < 0 ||  newHead.y < 0 || newHead.y == 50) {
      this.handleGameLost();
      return false;
    }
    // 遍历蛇的坐标，与蛇头作对比，如果蛇头与蛇身坐标相等即为碰撞
    snake.forEach((item,index) => {
      if(index == length - 1) return;
      if(newHead.x == item.x && newHead.y == item.y) {
        this.handleGameLost();
        return false;
      }
    });
    return true;
  },
  handleGameLost () {
    alert('游戏失败');
    this.gameStartS = false;
    // 清除画布
    SnakeView.clearCanvas();
  },
  createFood () {
    // 游戏开始马上生成食物，蛇吃了食物后，马上生成食物
    if(this.createFoodS) {
      this.newFood = SnakeModel.randomFood();
      SnakeView.drawFood(this.newFood);
      // 生成一次食物后，关闭生成，等到蛇吃了食物才能重新生成
     this.createFoodS = false;
    }
  }
}

// 视图 V 绘制
let SnakeView = {
  width: 10, // 单个方块的宽度
  height: 10, // 单个方块的高度
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
  drawFood (food) {
    ctx.fillStyle = this.snakeColor;
    ctx.fillRect(food.x * this.width, food.y * this.height, this.width, this.height);
  },
  clearTail (tail) {
    ctx.clearRect(tail.x * this.width, tail.y * this.height, this.width, this.height);
  },
  clearCanvas (snake) {
    ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
  }
}
