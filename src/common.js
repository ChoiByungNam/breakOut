'use strict';

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
  lives = 2;
  startTime = Date.now();
  min = 0;
  sec = 0;
  milisec = 0;
  anim;
  statusTypeCount;

  drawTitle = '50px malgun gothic';
  drawText = '25px malgun gothic';
  drawAlign = 'center';
  drawColor = '#000';

  constructor(ctx) {
    this.ctx = canvas.getContext('2d');
    this.init();
    this.drawIntro();

    document.addEventListener('click', e => {
      const { target } = e;
      const actionName = !!target.dataset && target.dataset.action;

      if (actionName === 'reload') {
        this.reload();
      } else if (actionName === 'start') {
        this.gameStart();
      }
    });
  }

  init() {
    // bricks 기본 설
    for (let i = 0; i < this.brickRowCount; i++) {
      this.bricks[i] = [];
      for (let k = 0; k < this.brickColCount; k++) {
        let randomBricks = Math.floor(Math.random() * 2) + 1;

        this.bricks[i][k] = {x: 0, y: 0, status: randomBricks};

        let statusType = this.bricks.map(col => col.filter(block => block.status === 2));

        this.statusTypeCount = 0;
        statusType.forEach(arr => {
          this.statusTypeCount += arr.length;
        });
        // console.log('개수:' + this.statusTypeCount, '뿌려진값:' + randomBricks);
      }
    }
    this.keyDown();
    this.keyUp();
    this.mouseMove();
  }
  keyDown() {
    document.addEventListener('keydown', this.keyDownHandler.bind(this), false);
  }
  keyUp() {
    document.addEventListener('keyup', this.keyUpHandler.bind(this), false);
  }
  mouseMove() {
    document.addEventListener('mousemove', this.mouseMoveHandler.bind(this), false);
  }
  keyDownHandler(e) {
    if (e.which == 37) {
      this.paddleLeft = true;
    } else if (e.which == 39) {
      this.paddleRight = true;
    } else if (e.which == 107 || e.which == 43) {
      if (this.paddleWidth < canvas.width) this.paddleWidth += 200;
    }
  }
  keyUpHandler(e) {
    if (e.which == 37) {
      this.paddleLeft = false;
    } else if (e.which == 39) {
      this.paddleRight = false;
    }
  }
  drawIntro() {
    this.ctx.font = this.drawTitle;
    this.ctx.textAlign = this.drawAlign;
    this.ctx.fillStyle = this.drawColor;
    this.ctx.fillText('Break Out', canvas.width / 2, canvas.height / 2 - 20);
    this.ctx.font = this.drawText;
    this.ctx.fillText('아래 [START] 버튼을 클릭해주세요!', canvas.width / 2, canvas.height / 2 + 20);
  }
  drawBricks() {
    for (let i = 0; i < this.brickRowCount; i++) {
      for (let k = 0; k < this.brickColCount; k++) {
        let brickX = (i * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
        let brickY = (k * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;

        this.bricks[i][k].x = brickX;
        this.bricks[i][k].y = brickY;

        // status === 1 한방 벽돌 생성, status === 2 두방 벽돌 생성
        if (this.bricks[i][k].status) {
          this.ctx.beginPath();
          this.ctx.rect(brickX, brickY, this.brickWidth, this.brickHeight);
          this.bricks[i][k].status === 1 ? this.ctx.fillStyle = '#c64e2b' : this.ctx.fillStyle = '#aa3c23';
          this.ctx.fill();
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
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.drawBall();
    this.drawPaddle();
    this.drawBricks();
    this.drawScore();
    this.drawLives();
    this.drawEnd();

    const nowTime = new Date(Date.now() - this.startTime);
    this.min = this.timeAddZero(nowTime.getMinutes());
    this.sec = this.timeAddZero(nowTime.getSeconds());
    this.milisec = this.timeAddZero(Math.floor(nowTime.getMilliseconds() / 10));
    // console.log(this.min, this.sec, this.milisec);

    this.start = true;

    /*
      bricks 충돌감지 제어
      충동감지 어렵다.
      공의 x 좌표는 벽돌의 x 좌표보다 커야 한다.
      공의 x 좌표는 벽돌의 x 좌표 + 가로 길이보다 작아야 한다.
      공의 y 좌표는 벽돌의 y 좌표보다 커야 한다.
      공의 y 좌표는 벽돌의 y 좌표 + 높이보다 작아야 한다.
    */
    for (let i = 0; i < this.brickRowCount; i++) {
      for (let k = 0; k < this.brickColCount; k++) {
        let brickCurrent = this.bricks[i][k];

        if (brickCurrent.status === 1 || brickCurrent.status === 2) {
          let statusNum = brickCurrent.status === 2 ? 1 : 0;

          if (this.x > brickCurrent.x - this.ballRadian && this.x < brickCurrent.x + this.brickWidth + this.ballRadian && this.y > brickCurrent.y - this.ballRadian && this.y < brickCurrent.y + this.brickHeight + this.ballRadian) {
            brickCurrent.status = statusNum;
            this.dy = -this.dy;
            this.score += 100;

            if (this.score === (this.brickColCount * this.brickRowCount + this.statusTypeCount) * 100) {
              document.getElementById('btnControl').style.display = 'none';
              this.ctx.clearRect(0, 0, canvas.width, canvas.height);
              this.ctx.font = '45px malgun gothic';
              this.ctx.textAlign = this.drawAlign;
              this.ctx.fillStyle = this.drawColor;
              this.ctx.fillText('Final Time!', canvas.width / 2, canvas.height / 2 - 20);
              this.ctx.font = this.drawText;
              this.ctx.fillText(`${this.min}:${this.sec}:${this.milisec}`, canvas.width / 2, canvas.height / 2 + 20);
              return false;
            }
            // console.log('scroe: ' + this.score, 'total: ' + (this.brickColCount * this.brickRowCount + this.statusTypeCount) * 100);
          }
        }
      }
    }

    // Ball 좌우 제어
    if (this.x > canvas.width - this.ballRadian || this.x < this.ballRadian) {
      this.dx = -this.dx;
      // console.log('X 충돌!');
    }

    // Ball 상하 제어
    if (this.y < this.ballRadian) {
      this.dy = -this.dy;
      // console.log('Y 충돌!');
    } else if (this.y > canvas.height - this.paddleHeight) {
      // console.log('paddle&ball 좌표:', this.x, this.paddleX + this.paddleWidth);
      if (this.x > this.paddleX && this.x < this.paddleX + this.paddleWidth) {
        // console.log('야호!');
        this.dy = -this.dy;
      } else {
        this.lives--;
        if (!this.lives) {
          // console.log('GAME OVER!');
          this.gameOver();
          return false;
        } else {
          this.x = canvas.width / 2;
          this.y = canvas.height - this.ballRadian;
          this.dx = 4;
          this.dy = -4;
          this.paddleX = (canvas.width - this.paddleWidth) / 2;
        }
      }
    }

    // Paddle Keyboard 제어
    if (this.paddleRight) {
      this.paddleX += this.paddleCount;
      if (this.paddleX > canvas.width - this.paddleWidth) {
        // console.log(canvas.width - this.paddleWidth);
        this.paddleX = canvas.width - this.paddleWidth;
      }
    } else if (this.paddleLeft) {
      this.paddleX -= this.paddleCount;
      if (this.paddleX < 0) {
        this.paddleX = 0;
      }
    }

    this.x += this.dx;
    this.y += this.dy;
    // console.log(this.x, this.y);
    this.anim = window.requestAnimationFrame(this.draw.bind(this));
  }
  mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.offsetLeft;

    if (relativeX >= 0 && relativeX <= canvas.width) {
      this.paddleX = relativeX - this.paddleWidth / 2;
      // 마우스 커서가 캔버스 밖으로 넘어갔을 경우 (paddle 넓이 전체 보여주기)
      // if (relativeX < this.paddleWidth / 2) {
      //   this.paddleX = 0;
      // } else if (relativeX > canvas.width - this.paddleWidth / 2) {
      //   this.paddleX = canvas.width - this.paddleWidth;
      // }
    }
  }
  drawScore() {
    this.ctx.font = '20px malgun gothic';
    this.ctx.textAlign = 'left';
    this.ctx.fillStyle = this.drawColor;
    this.ctx.fillText(`Score : ${this.score}`, this.brickOffsetLeft, 30);
  }
  drawLives() {
    this.ctx.font = '20px malgun gothic';
    this.ctx.textAlign = 'right';
    this.ctx.fillStyle = this.drawColor;
    this.ctx.fillText(`Lives : ${this.lives}`, canvas.width - this.brickOffsetLeft, 30);
  }
  drawEnd() {
    this.ctx.font = '20px malgun gothic';
    this.ctx.textAlign = this.drawAlign;
    this.ctx.fillStyle = this.drawColor;
    this.ctx.fillText(`Time : ${this.min}:${this.sec}:${this.milisec}`, canvas.width / 2, 30);
  }
  timeAddZero(num) {
    return (num < 10 ? '0'+num : ''+num);
  }
  gameStart() {
    if (!this.start) {
      document.getElementById('btnControl').innerHTML = 'STOP';
      window.cancelAnimationFrame(this.anim);
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.draw();
    } else {
      this.start = false;
      document.getElementById('btnControl').innerHTML = 'START';
      window.cancelAnimationFrame(this.anim);
    }
  }
  gameOver() {
    document.getElementById('btnControl').style.display = 'none';
    window.cancelAnimationFrame(this.anim);
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.font = this.drawTitle;
    this.ctx.textAlign = this.drawAlign;
    this.ctx.fillStyle = this.drawColor;
    this.ctx.fillText('실력이 부족하구만~', canvas.width / 2, canvas.height / 2);
  }
  reload() {
    document.location.reload();
  }
}

const canvas = document.getElementById('canvas');
const breakOut = new BreakOut(canvas);