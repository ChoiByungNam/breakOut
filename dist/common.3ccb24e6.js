// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"common.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BreakOut =
/*#__PURE__*/
function () {
  function BreakOut(ctx) {
    var _this2 = this;

    _classCallCheck(this, BreakOut);

    this.start = false;
    this.ballRadian = 8;
    this.x = Math.floor(Math.random() * (canvas.width - this.ballRadian)) + this.ballRadian;
    this.y = canvas.height - this.ballRadian - 2;
    this.dx = 4;
    this.dy = -4;
    this.paddleWidth = 90;
    this.paddleHeight = 5;
    this.paddleLeft = false;
    this.paddleRight = false;
    this.paddleX = (canvas.width - this.paddleWidth) / 2;
    this.paddleCount = 7;
    this.bricks = [];
    this.brickWidth = 70;
    this.brickHeight = 25;
    this.brickPadding = 8;
    this.brickOffsetTop = 50;
    this.brickOffsetLeft = 25;
    this.brickColCount = 5;
    this.brickRowCount = 7;
    this.score = 0;
    this.lives = 1;
    this.startTime = Date.now();
    this.min = 0;
    this.sec = 0;
    this.milisec = 0;
    _this = this;
    this.ctx = canvas.getContext('2d');
    this.drawIntro();
    document.addEventListener('click', function (e) {
      var target = e.target;
      var actionName = !!target.dataset && target.dataset.action;

      if (actionName === 'reload') {
        _this2.reload();
      } else if (actionName === 'start') {
        _this2.start = false;

        _this2.gameStart();
      }
    });
  }

  _createClass(BreakOut, [{
    key: "init",
    value: function init() {
      // bricks 기본 설정
      for (var i = 0; i < this.brickRowCount; i++) {
        this.bricks[i] = [];

        for (var k = 0; k < this.brickColCount; k++) {
          var randomBricks = Math.floor(Math.random() * 2) + 1;
          this.bricks[i][k] = {
            x: 0,
            y: 0,
            status: randomBricks
          };
        }
      }

      this.draw();
    }
  }, {
    key: "keyDown",
    value: function keyDown() {
      document.addEventListener('keydown', this.keyDownHandler, false);
    }
  }, {
    key: "keyUp",
    value: function keyUp() {
      document.addEventListener('keyup', this.keyUpHandler, false);
    }
  }, {
    key: "mouseMove",
    value: function mouseMove() {
      document.addEventListener('mousemove', this.mouseMoveHandler, false);
    }
  }, {
    key: "keyDownHandler",
    value: function keyDownHandler(e) {
      if (e.which == 37) {
        _this.paddleLeft = true;
      } else if (e.which == 39) {
        _this.paddleRight = true;
      } else if (e.which == 107 || e.which == 43) {
        if (_this.paddleWidth < canvas.width) _this.paddleWidth += 200;
      }
    }
  }, {
    key: "keyUpHandler",
    value: function keyUpHandler(e) {
      if (e.which == 37) {
        _this.paddleLeft = false;
      } else if (e.which == 39) {
        _this.paddleRight = false;
      }
    }
  }, {
    key: "drawIntro",
    value: function drawIntro() {
      this.ctx.font = '50px malgun gothic';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#000';
      this.ctx.fillText('Break Out', canvas.width / 2, canvas.height / 2 - 20);
      this.ctx.font = '25px malgun gothic';
      this.ctx.fillText('아래 [START] 버튼을 클릭해주세요!', canvas.width / 2, canvas.height / 2 + 20);
    }
  }, {
    key: "drawBricks",
    value: function drawBricks() {
      for (var i = 0; i < _this.brickRowCount; i++) {
        for (var k = 0; k < this.brickColCount; k++) {
          var brickX = i * (this.brickWidth + this.brickPadding) + this.brickOffsetLeft;
          var brickY = k * (this.brickHeight + this.brickPadding) + this.brickOffsetTop;
          this.bricks[i][k].x = brickX;
          this.bricks[i][k].y = brickY; // status === 1 한방 벽돌 생성, status === 2 두방 벽돌 생성

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
  }, {
    key: "drawBall",
    value: function drawBall() {
      this.ctx.beginPath();
      this.ctx.fillStyle = '#e7ad00';
      this.ctx.arc(this.x, this.y, this.ballRadian, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }, {
    key: "drawPaddle",
    value: function drawPaddle() {
      this.ctx.beginPath();
      this.ctx.fillStyle = '#ab8000';
      this.ctx.fillRect(this.paddleX, canvas.height - this.paddleHeight, this.paddleWidth, this.paddleHeight);
      this.ctx.fill();
    }
  }, {
    key: "draw",
    value: function draw() {
      _this.ctx.clearRect(0, 0, canvas.width, canvas.height);

      _this.drawBall();

      _this.drawPaddle();

      _this.drawBricks();

      _this.drawScore();

      _this.drawLives();

      _this.drawEnd();

      var nowTime = new Date(Date.now() - _this.startTime);
      _this.min = _this.timeAddZero(nowTime.getMinutes());
      _this.sec = _this.timeAddZero(nowTime.getSeconds());
      _this.milisec = _this.timeAddZero(Math.floor(nowTime.getMilliseconds() / 10)); // console.log(_this.min, _this.sec, _this.milisec);

      /*
        bricks 충돌감지 제어
        충동감지 어렵다.
        공의 x 좌표는 벽돌의 x 좌표보다 커야 한다.
        공의 x 좌표는 벽돌의 x 좌표 + 가로 길이보다 작아야 한다.
        공의 y 좌표는 벽돌의 y 좌표보다 커야 한다.
        공의 y 좌표는 벽돌의 y 좌표 + 높이보다 작아야 한다.
      */

      for (var i = 0; i < _this.brickRowCount; i++) {
        for (var k = 0; k < _this.brickColCount; k++) {
          var brickCurrent = _this.bricks[i][k];

          if (brickCurrent.status === 1 || brickCurrent.status === 2) {
            var statusNumber = brickCurrent.status === 2 ? 1 : 0;

            if (_this.x > brickCurrent.x - _this.ballRadian && _this.x < brickCurrent.x + _this.brickWidth + _this.ballRadian && _this.y > brickCurrent.y - _this.ballRadian && _this.y < brickCurrent.y + _this.brickHeight + _this.ballRadian) {
              _this.dy = -_this.dy;
              brickCurrent.status = statusNumber;
              _this.score += 100;

              if (_this.score === _this.brickColCount * _this.brickRowCount * 100) {
                _this.start = true;

                _this.ctx.clearRect(0, 0, canvas.width, canvas.height);

                _this.ctx.font = '45px malgun gothic';
                _this.ctx.textAlign = 'center';
                _this.ctx.fillStyle = '#000';

                _this.ctx.fillText('Final Time!', canvas.width / 2, canvas.height / 2 - 20);

                _this.ctx.font = '25px malgun gothic';

                _this.ctx.fillText("".concat(_this.min, ":").concat(_this.sec, ":").concat(_this.milisec), canvas.width / 2, canvas.height / 2 + 20);

                return false;
              }
            }
          }
        }
      } // Ball 좌우 제어


      if (_this.x > canvas.width - _this.ballRadian || _this.x < _this.ballRadian) {
        _this.dx = -_this.dx; // console.log('X 충돌!');
      } // Ball 상하 제어


      if (_this.y < _this.ballRadian) {
        _this.dy = -_this.dy; // console.log('Y 충돌!');
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
      } // Paddle Keyboard 제어


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
      _this.y += _this.dy; // console.log(_this.x, _this.y);

      _this.anim = window.requestAnimationFrame(_this.draw);
      return _this;
    }
  }, {
    key: "mouseMoveHandler",
    value: function mouseMoveHandler(e) {
      var relativeX = e.clientX - canvas.offsetLeft;

      if (relativeX >= 0 && relativeX <= canvas.width) {
        _this.paddleX = relativeX - _this.paddleWidth / 2; // 마우스 커서가 캔버스 밖으로 넘어갔을 경우 (paddle 넓이 전체 보여주기)
        // if (relativeX < _this.paddleWidth / 2) {
        //   _this.paddleX = 0;
        // } else if (relativeX > canvas.width - _this.paddleWidth / 2) {
        //   _this.paddleX = canvas.width - _this.paddleWidth;
        // }
      }
    }
  }, {
    key: "drawScore",
    value: function drawScore() {
      this.ctx.font = '20px malgun gothic';
      this.ctx.textAlign = 'left';
      this.ctx.fillStyle = '#000';
      this.ctx.fillText("Score : ".concat(this.score), this.brickOffsetLeft, 30);
    }
  }, {
    key: "drawLives",
    value: function drawLives() {
      this.ctx.font = '20px malgun gothic';
      this.ctx.textAlign = 'right';
      this.ctx.fillStyle = '#000';
      this.ctx.fillText("Lives : ".concat(this.lives), canvas.width - this.brickOffsetLeft, 30);
    }
  }, {
    key: "drawEnd",
    value: function drawEnd() {
      this.ctx.font = '20px malgun gothic';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#000';
      this.ctx.fillText("Time : ".concat(this.min, ":").concat(this.sec, ":").concat(this.milisec), canvas.width / 2, 30);
    }
  }, {
    key: "timeAddZero",
    value: function timeAddZero(num) {
      return num < 10 ? '0' + num : '' + num;
    }
  }, {
    key: "gameStart",
    value: function gameStart() {
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
  }, {
    key: "gameOver",
    value: function gameOver() {
      this.start = true;
      window.cancelAnimationFrame(this.anim);
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.ctx.font = '50px malgun gothic';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#000';
      this.ctx.fillText('실력이 부족하구만~', canvas.width / 2, canvas.height / 2);
    }
  }, {
    key: "reload",
    value: function reload() {
      document.location.reload();
    }
  }]);

  return BreakOut;
}();

var canvas = document.getElementById('canvas');
var breakOut = new BreakOut(canvas);
},{}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "57117" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","common.js"], null)
//# sourceMappingURL=/common.3ccb24e6.js.map