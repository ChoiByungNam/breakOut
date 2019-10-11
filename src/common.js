class BreakOut {
  start = false;
  ballRadian = 8;
  x = Math.floor(Math.random() * (canvas.width - this.ballRadian)) + this.ballRadian;
  y = canvas.height - this.ballRadian - 2;
  dx = 4;
  dy = -4;
  paddleWidth = 90;
  paddleHeight = 5;
  paddleLeft = false;
  paddleRight = false;
  paddleX = (canvas.width - this.paddleWidth) / 2;
  paddleCount = 7;
  bricks = [];
  brickWidth = 70;
  brickHeight = 25;
  brickPadding = 8;
  brickOffsetTop = 50;
  brickOffsetLeft = 25;
  brickColCount = 5;
  brickRowCount = 7;
  score = 0;
  lives = 1;
  startTime = Date.now();
  min = 0;
  sec = 0;
  milisec = 0;
  anim;

  constructor(ctx) {
    _this = this;
    this.ctx = canvas.getContext('2d');
    this.drawIntro();

    document.addEventListener('click', e => {
      const { target } = e;
      const actionName = !!target.dataset && target.dataset.action;

      if (actionName === 'reload') {
        this.reload();
      } else if (actionName === 'start') {
        this.start = false;
        this.gameStart();
      }
    });
  }

  init() {
    // bricks 기본 설정
    for (let i = 0; i < this.brickRowCount; i++) {
      this.bricks[i] = [];
      for (let k = 0; k < this.brickColCount; k++) {
        let randomBricks = Math.floor(Math.random() * 2) + 1;

        this.bricks[i][k] = {x: 0, y: 0, status: randomBricks};
      }
    }
    this.draw();
  }
  keyDown() {
    document.addEventListener('keydown', this.keyDownHandler, false);
  }
  keyUp() {
    document.addEventListener('keyup', this.keyUpHandler, false);
  }
  mouseMove() {
    document.addEventListener('mousemove', this.mouseMoveHandler, false);
  }
  keyDownHandler(e) {
    if (e.which == 37) {
      _this.paddleLeft = true;
    } else if (e.which == 39) {
      _this.paddleRight = true;
    } else if (e.which == 107 || e.which == 43) {
      if (_this.paddleWidth < canvas.width) _this.paddleWidth += 200;
    }
  }
  keyUpHandler(e) {
    if (e.which == 37) {
      _this.paddleLeft = false;
    } else if (e.which == 39) {
      _this.paddleRight = false;
    }
  }
  drawIntro() {
    this.ctx.font = '50px malgun gothic';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#000';
    this.ctx.fillText('Break Out', canvas.width / 2, canvas.height / 2 - 20);
    this.ctx.font = '25px malgun gothic';
    this.ctx.fillText('아래 [START] 버튼을 클릭해주세요!', canvas.width / 2, canvas.height / 2 + 20);
  }
  drawBricks() {
    for (let i = 0; i < _this.brickRowCount; i++) {
      for (let k = 0; k < this.brickColCount; k++) {
        let brickX = (i * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
        let brickY = (k * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;

        this.bricks[i][k].x = brickX;
        this.bricks[i][k].y = brickY;

        // status === 1 한방 벽돌 생성, status === 2 두방 벽돌 생성
        if (this.bricks[i][k].status === 1) {
          this.ctx.beginPath();
          this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
          this.ctx.fillStyle = '#c64e2b';
          this.ctx.fill();
        } else if (this.bricks[i][k].status === 2) {
          this.ctx.beginPath();
          this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
          this.ctx.fillStyle = '#aa3c23';
          this.ctx.fill();
          console.log(this.bricks[i][k].status);
        }
      }
    }
  }
  drawBall() {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#e7ad00';
    this.ctx.arc(this.x, this.y, this.ballRadian, 0, Math.PI * 2);
    this.ctx.fill();
  }
  drawPaddle() {
    this.ctx.beginPath();
    this.ctx.fillStyle = '#ab8000';
    this.ctx.fillRect(this.paddleX, canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
    this.ctx.fill();
  }
  draw() {
    _this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    _this.drawBall();
    _this.drawPaddle();
    _this.drawBricks();
    _this.drawScore();
    _this.drawLives();
    _this.drawEnd();

    const nowTime = new Date(Date.now() - _this.startTime);
    _this.min = _this.timeAddZero(nowTime.getMinutes());
    _this.sec = _this.timeAddZero(nowTime.getSeconds());
    _this.milisec = _this.timeAddZero(Math.floor(nowTime.getMilliseconds() / 10));
    // console.log(_this.min, _this.sec, _this.milisec);

    /*
      bricks 충돌감지 제어
      충동감지 어렵다.
      공의 x 좌표는 벽돌의 x 좌표보다 커야 한다.
      공의 x 좌표는 벽돌의 x 좌표 + 가로 길이보다 작아야 한다.
      공의 y 좌표는 벽돌의 y 좌표보다 커야 한다.
      공의 y 좌표는 벽돌의 y 좌표 + 높이보다 작아야 한다.
    */
    for (let i = 0; i < _this.brickRowCount; i++) {
      for (let k = 0; k < _this.brickColCount; k++) {
        let brickCurrent = _this.bricks[i][k];

        if (brickCurrent.status === 1 || brickCurrent.status === 2) {
          let statusNumber = brickCurrent.status === 2 ? 1 : 0;

          if (_this.x > brickCurrent.x - _this.ballRadian && _this.x < brickCurrent.x + _this.brickWidth + _this.ballRadian && _this.y > brickCurrent.y - _this.ballRadian && _this.y < brickCurrent.y + _this.brickHeight + _this.ballRadian) {
            _this.dy = -_this.dy;
            brickCurrent.status = statusNumber;
            _this.score += 100;
            if (_this.score === (_this.brickColCount * _this.brickRowCount) * 100) {
              _this.start = true;
              _this.ctx.clearRect(0, 0, canvas.width, canvas.height);
              _this.ctx.font = '45px malgun gothic';
              _this.ctx.textAlign = 'center';
              _this.ctx.fillStyle = '#000';
              _this.ctx.fillText('Final Time!', canvas.width / 2, canvas.height / 2 - 20);
              _this.ctx.font = '25px malgun gothic';
              _this.ctx.fillText(`${_this.min}:${_this.sec}:${_this.milisec}`, canvas.width / 2, canvas.height / 2 + 20);
              return false;
            }
          }
        }
      }
    }

    // Ball 좌우 제어
    if (_this.x > canvas.width - _this.ballRadian || _this.x < _this.ballRadian) {
      _this.dx = -_this.dx;
      // console.log('X 충돌!');
    }

    // Ball 상하 제어
    if (_this.y < _this.ballRadian) {
      _this.dy = -_this.dy;
      // console.log('Y 충돌!');
    } else if (_this.y > canvas.height - _this.paddleHeight) {
      // console.log('paddle&ball 좌표:', _this.x, _this.paddleX + _this.paddleWidth);
      if (_this.x > _this.paddleX && _this.x < _this.paddleX + _this.paddleWidth) {
        // console.log('야호!');
        _this.dy = -_this.dy;
      } else {
        _this.lives--;
        if (!_this.lives) {
          // console.log('GAME OVER!');
          _this.gameOver();
          return false;
        } else {
          _this.x = canvas.width / 2;
          _this.y = canvas.height - _this.ballRadian;
          _this.dx = 4;
          _this.dy = -4;
          _this.paddleX = (canvas.width - _this.paddleWidth) / 2;
        }
      }
    }

    // Paddle Keyboard 제어
    if (_this.paddleRight) {
      _this.paddleX += _this.paddleCount;
      if (_this.paddleX > canvas.width - _this.paddleWidth) {
        // console.log(canvas.width - _this.paddleWidth);
        _this.paddleX = canvas.width - _this.paddleWidth;
      }
    } else if (_this.paddleLeft) {
      _this.paddleX -= _this.paddleCount;
      if (_this.paddleX < 0) {
        _this.paddleX = 0;
      }
    }

    _this.x += _this.dx;
    _this.y += _this.dy;
    // console.log(_this.x, _this.y);
    _this.anim = window.requestAnimationFrame(_this.draw);
    return _this;
  }
  mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;

    if (relativeX >= 0 && relativeX <= canvas.width) {
      _this.paddleX = relativeX - _this.paddleWidth / 2;
      // 마우스 커서가 캔버스 밖으로 넘어갔을 경우 (paddle 넓이 전체 보여주기)
      // if (relativeX < _this.paddleWidth / 2) {
      //   _this.paddleX = 0;
      // } else if (relativeX > canvas.width - _this.paddleWidth / 2) {
      //   _this.paddleX = canvas.width - _this.paddleWidth;
      // }
    }
  }
  drawScore() {
    this.ctx.font = '20px malgun gothic';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = '#000';
    this.ctx.fillText(`Score : ${this.score}`, this.brickOffsetLeft, 30);
  }
  drawLives() {
    this.ctx.font = '20px malgun gothic';
    this.ctx.textAlign = 'right';
    this.ctx.fillStyle = '#000';
    this.ctx.fillText(`Lives : ${this.lives}`, canvas.width - this.brickOffsetLeft, 30);
  }
  drawEnd() {
    this.ctx.font = '20px malgun gothic';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#000';
    this.ctx.fillText(`Time : ${this.min}:${this.sec}:${this.milisec}`, canvas.width / 2, 30);
  }
  timeAddZero(num) {
    return (num < 10 ? '0'+num : ''+num);
  }
  gameStart() {
    if (!this.start) {
      this.start = false;
      window.cancelAnimationFrame(this.anim);
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.keyDown();
      this.keyUp();
      this.mouseMove();
      this.init();
    }
  }
  gameOver() {
    this.start = true;
    window.cancelAnimationFrame(this.anim);
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.font = '50px malgun gothic';
    this.ctx.textAlign = 'center';
    this.ctx.fillStyle = '#000';
    this.ctx.fillText('실력이 부족하구만~', canvas.width / 2, canvas.height / 2);
  }
  reload() {
    document.location.reload();
  }
}

const canvas = document.getElementById('canvas');
const breakOut = new BreakOut(canvas);