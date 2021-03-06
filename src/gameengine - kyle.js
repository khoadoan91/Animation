function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
     
    var wallCurrent = Date.now(),
        wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000,
        gameDelta = Math.min(wallDelta, this.maxStep);
    
    this.wallLastTimestamp = wallCurrent;
    this.gameTime += gameDelta;
    return gameDelta;
};

var KEY_CODES = {
    65 : 'a',
    68 : 'd',
    87 : 'w',
    74 : 'j'
};

function GameEngine(ctx) {
    this.levels = [];
    this.currentLevel = 0;
    this.ctx = ctx;
    this.click = null;
    this.camera = null;
    this.keyStatus = {};
    this.keysDown = false;
    this.isRunning = false;
    // this.isPlay = null;
}

GameEngine.prototype = {
    init : function (camera) {
        this.camera = camera;
        for (var code in KEY_CODES) {
            if (KEY_CODES.hasOwnProperty(code)) {
                this.keyStatus[KEY_CODES[code]] = false;
            }
        }
        this.startInput();
        this.timer = new Timer();
    },

    start : function () {
        this.levels[this.currentLevel].switchAndPlayMusic();
        var that = this;
        (function gameLoop() {
            that.loop();
            that.isPlay = window.requestAnimationFrame(gameLoop, that.ctx.canvas);
            // that.isPlay();
        })();
    },

    startInput : function () {
        var that = this;
        var getXandY = function (e) {
            var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
            var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
            return { x: x, y: y };
        }
        this.ctx.canvas.addEventListener("keydown", function (event) {
            if (KEY_CODES[event.keyCode]) {
                that.keyStatus[KEY_CODES[event.keyCode]] = true;
                that.keysDown = true;
                event.preventDefault();
            }
        }, false);
        this.ctx.canvas.addEventListener("keyup", function (event) {
            if (KEY_CODES[event.keyCode]) {
                that.keyStatus[KEY_CODES[event.keyCode]] = false;
                that.keysDown = false;
                for (var code in KEY_CODES) {
                    if (KEY_CODES.hasOwnProperty(code) && that.keyStatus[KEY_CODES[code]]) {
                        that.keysDown = true;
                    }
                }
                event.preventDefault();
            }
        }, false);
        this.ctx.canvas.addEventListener("click", function (event) {
            that.click = getXandY(event);
        }, false);
    },

    addLevel : function (entity) {
        this.levels.push(entity);
    },

    draw : function () { 
        var i;
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.save();
        this.levels[this.currentLevel].draw(this.ctx, this.camera.viewportRect, this.clockTick);
        this.ctx.restore();
    },

    update : function () {
        if (!this.levels[this.currentLevel].isWin) {
            this.levels[this.currentLevel].update(this.clockTick);
        } else {
            // this.currentLevel += 1;
            // if (this.currentLevel === this.levels.length) { // finish the last level.
            //     // TODO stop the request animation frame.
            //     // REMIND draw the last screen before stop.
            // }
        }
        this.camera.update();
    },

    loop : function () {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();
    }
};