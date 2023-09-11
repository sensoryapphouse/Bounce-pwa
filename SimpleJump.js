function SimpleJump() {
    this._levelSettings = null;
    this._canvas = null;
    this._stage = null;
    this._background = null;
    this._startView = null;
    this._gameView = null;
    this._endView = null;
}

var theWidth = 1000;
var playerSize = 1;
var lastOne = false;
var bgd;
var img;
var lastX;
var lastY;
var leftDown = false;
var rightDown = false;
var timeDown;
var xDown;
var gameIndex;
var rocking;
var skew = false;
var jumpTicker = null;
var cameraListener = null;
var firstBounce = true;
var lbl;
var startThat;
var initThat;
var endThat;
var playerSpeed = 1;
var playerWon = false;

function doSettings() {
    playerSpeed = 0.5 + (speed.value - 1) / 5;
    switch (gameIndex) {
        case 0:
            switch (parseInt(player.value)) {
                case 1:
                    playerSize = .2;
                    break;
                case 2:
                    playerSize = .35;
                    break;
                case 3:
                    playerSize = .5;
                    break;
                case 4:
                    playerSize = .75;
                    break;
                case 5:
                    playerSize = 1;
                    break;
            }
            PlayerSettings.prototype.playerWidth = playerSize * theWidth / 10;
            PlayerSettings.prototype.playerHeight = PlayerSettings.prototype.playerWidth;
            switch (parseInt(platform.value)) {
                case 1:
                    PlatformSettings.prototype.platformWidth = 50;
                    break;
                case 2:
                    PlatformSettings.prototype.platformWidth = 75;
                    break;
                case 3:
                    PlatformSettings.prototype.platformWidth = 100;
                    break;
                case 4:
                    PlatformSettings.prototype.platformWidth = 200;
                    break;
                case 5:
                    PlatformSettings.prototype.platformWidth = 300;
                    break;
            }
            break;
        case 1:
        case 2:
        case 3:
            switch (parseInt(player.value)) {
                case 1:
                    playerSize = .5;
                    break;
                case 2:
                    playerSize = .75;
                    break;
                case 3:
                    playerSize = 1;
                    break;
                case 4:
                    playerSize = 1.25;
                    break;
                case 5:
                    playerSize = 1.75;
                    break;
            }
            PlayerSettings.prototype.playerWidth = playerSize * theWidth / 10;
            switch (parseInt(platform.value)) {
                case 1:
                    PlatformSettings.prototype.platformWidth = 75;
                    break;
                case 2:
                    PlatformSettings.prototype.platformWidth = 100;
                    break;
                case 3:
                    PlatformSettings.prototype.platformWidth = 150;
                    break;
                case 4:
                    PlatformSettings.prototype.platformWidth = 200;
                    break;
                case 5:
                    PlatformSettings.prototype.platformWidth = 300;
                    break;
            }
            break;
    }
}

function flipCanvas(doIt) {
    if (doIt)
        document.getElementById("canvas").style["-webkit-transform"] = "scaleY(-1)"; // PB flip canvas
    else
        document.getElementById("canvas").style["-webkit-transform"] = "scaleY(1)"; // PB flip canvas
}

SimpleJump.prototype.init = function () {
    var that = this;
    initThat = this;
    this._levelSettings = new simplejump.game.LevelSettings();
    this._canvas = document.getElementById("canvas");
    this._canvas.width = this._levelSettings.levelWidth;
    this._canvas.height = window.innerHeight;
    this._canvas.style.marginLeft = 0; //(window.innerWidth / 2 - this._canvas.width / 2).toString() + "px";
    this._stage = new createjs.Stage("canvas");
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addListener(this._stage);
    switch (gameIndex) {
        case 0:
            this._background = new createjs.Shape();
            this._background.graphics.beginFill(this._levelSettings.levelColor);
            this._background.graphics.drawRect(0, 0, this._levelSettings.levelWidth, this._canvas.height);
            this._stage.addChild(this._background);
            rocking = 0;
            break;
        case 1:
            bgd = new createjs.Bitmap("images/jungle.jpg"); // PB change background
            bgd.scaleX = 1;
            bgd.scaleY = 1;
            bgd.crossOrigin = "Anonymous";
            this._stage.addChild(bgd);
            rocking = 1;
            break;
        case 2:
            bgd = new createjs.Bitmap("images/pond.jpg"); // PB change background
            bgd.scaleX = 1;
            bgd.scaleY = 1;
            bgd.crossOrigin = "Anonymous";
            this._stage.addChild(bgd);
            rocking = 3;
            break;
        case 3:
            bgd = new createjs.Bitmap("images/space.jpg"); // PB change background
            bgd.scaleX = 1;
            bgd.scaleY = 1;
            bgd.crossOrigin = "Anonymous";
            this._stage.addChild(bgd);
            rocking = 5;
            break;
    }
    doSettings();

    this._startView = new simplejump.view.StartView(this._stage);
    this._gameView = new simplejump.view.GameView(this._stage);

    this._endView = new simplejump.view.EndView(this._stage);
    this._startView.getEventManager().addListener(this._startView.PLAY_CLICKED, function () {
        that._showGameView();
    });
    this._gameView.getEventManager().addListener(this._gameView.GAME_OVER, function () {
        that._endView.setResult(that._gameView.getPlayerWon(), that._gameView.getFinalScore());
        that._showEndView();
    });
    this._endView.getEventManager().addListener(this._endView.BACK_TO_START_CLICKED, function () {
        that._showStartView();
        countTmr();
        //        home.hidden = true;
    });
    this._showStartView();
};


SimpleJump.prototype.init2 = function () {
    var that = initThat;

    switch (gameIndex) {
        case 0:
            initThat._background = new createjs.Shape();
            initThat._background.graphics.beginFill(initThat._levelSettings.levelColor);
            initThat._background.graphics.drawRect(0, 0, initThat._levelSettings.levelWidth, initThat._canvas.height);
            initThat._stage.addChild(initThat._background);
            rocking = 0;
            break;
        case 1:
            bgd = new createjs.Bitmap("images/jungle.jpg"); // PB change background
            bgd.scaleX = 1;
            bgd.scaleY = 1;
            bgd.crossOrigin = "Anonymous";
            initThat._stage.addChild(bgd);
            rocking = 2;
            break;
        case 2:
            bgd = new createjs.Bitmap("images/pond.jpg"); // PB change background
            bgd.scaleX = 1;
            bgd.scaleY = 1;
            bgd.crossOrigin = "Anonymous";
            initThat._stage.addChild(bgd);
            rocking = 3;
            break;
        case 3:
            bgd = new createjs.Bitmap("images/space.jpg"); // PB change background
            bgd.scaleX = 1;
            bgd.scaleY = 1;
            bgd.crossOrigin = "Anonymous";
            initThat._stage.addChild(bgd);
            rocking = 5;
            break;
    }
    doSettings();
    initThat._showStartView();
    countTmr();
};

SimpleJump.prototype._showStartView = function () {
    this._stage.removeChild(this._endView);
    this._stage.enableMouseOver(20);
    this._stage.addChild(this._startView);
    firstBounce = true;
};

SimpleJump.prototype._showGameView = function () {
    try {
        bgd.y = 0; // PB reset background scroll
    } catch (e) {};
    this._stage.removeChild(this._startView);
    this._stage.enableMouseOver(0);
    this._stage.addChild(this._gameView);
    this._gameView.startGame();
    if (gameIndex < 2)
        flipCanvas(false);
    else flipCanvas(true);
};

SimpleJump.prototype._showEndView = function () {
    flipCanvas(false);
    this._stage.removeChild(this._gameView);
    this._stage.enableMouseOver(20);
    this._stage.addChild(this._endView);
};
window.simplejump = window.simplejump || {};
window.simplejump.SimpleJump = function () {
    return new SimpleJump();
};
//window.onload = function () {
//    new SimpleJump().init();
//};


function PlayerSettings() {}
PlayerSettings.prototype.jumpDuration = 2000; // 2000 PB
PlayerSettings.prototype.jumpHeight = 200; // 200 PB
PlayerSettings.prototype.jumpDistance = 200; // 200 PB
PlayerSettings.prototype.playerWidth = playerSize * theWidth / 10; // 20 is better PB
PlayerSettings.prototype.playerHeight = 50;
PlayerSettings.prototype.playerColor = "#FFFF00"; //"#000000";
PlayerSettings.prototype.maximumDistance = theWidth; // 500 PB
window.simplejump = window.simplejump || {};
window.simplejump.game = window.simplejump.game || {};
window.simplejump.game.PlayerSettings = function () {
    return new PlayerSettings();
};


function PlayerMove(fromX, toX, fromY, toY) {
    this.fromX = fromX;
    this.toX = toX;
    this.fromY = fromY;
    this.toY = toY;
}
window.simplejump = window.simplejump || {};
window.simplejump.game = window.simplejump.game || {};
window.simplejump.game.PlayerMove = function (fromX, toX, fromY, toY) {
    return new PlayerMove(fromX, toX, fromY, toY);
};

function Player(playerSettings) {
    var that = this;
    this._playerSettings = playerSettings;
    this._eventManager = new simplejump.EventManager();
    this._jumpStartTime = 0;
    this._jumpStartY = 0;
    this._up = false;
    leftDown = false;
    rightDown = false;
    timeDown = 0;
    xDown = 0;
    this._lastPlayerMove = null;
    this.initialize();
    this.drawPlayer();
    //    window.onkeydown = function (event) {
    //        that._handleKeyDown(event);
    //    };
    //    window.onkeyup = function (event) {
    //        that._handleKeyUp(event);
    //    };
}
Player.prototype = new createjs.Container();
Player.prototype.PLAYER_MOVED = "playerMoved";
Player.prototype.PLAYER_FALLING = "playerFalling";
Player.prototype.JUMP_COMPLETE = "jumpComplete";
Player.prototype.drawPlayer = function () {
    this.removeAllChildren();
    switch (gameIndex) {
        case 0:
            var shape = new createjs.Shape();
            shape.graphics.beginFill(this._playerSettings.playerColor);
            shape.graphics.drawRect(0, 0, this._playerSettings.playerWidth, this._playerSettings.playerHeight);
            shape.shadow = new createjs.Shadow("#FFFFFF", 0, -5, 5);
            this.addChild(shape);
            break;
        case 1:
            img = new createjs.Bitmap("images/monkey.png");
            img.scaleX = PlayerSettings.prototype.playerWidth / 480;
            img.scaleY = playerSize * .15;
            img.crossOrigin = "Anonymous";
            img.shadow = new createjs.Shadow("#8F4F00", 0, 2, 3);
            this.addChild(img);
            break;
        case 2:
            img = new createjs.Bitmap("images/frog.png");
            //img = new createjs.Text("qa", "135px Verdana", "#00FF00");
            img.scaleX = PlayerSettings.prototype.playerWidth / 480;
            img.scaleY = playerSize * .15;
            img.crossOrigin = "Anonymous";
            //img.shadow = new createjs.Shadow("#008F00", 0, -5, 10);
            img.shadow = new createjs.Shadow("#008F00", 0, -5, 10);
            this.addChild(img);
            break;
        case 3:
            img = new createjs.Bitmap("images/ufo.png");
            img.scaleX = PlayerSettings.prototype.playerWidth / 480;
            img.scaleY = playerSize * .25;
            img.crossOrigin = "Anonymous";
            img.shadow = new createjs.Shadow("#FFFFFF", 0, -5, 10);
            this.addChild(img);
            break;
    }
};

Player.prototype.jump = function () {
    this._jumpStartY = this.y;
    this._up = true;
    this._jumpStartTime = createjs.Ticker.getTime();
    createjs.Ticker.addListener(this);
};

Player.prototype.stopJump = function () {
    createjs.Ticker.removeListener(this);
};

Player.prototype.getLastPlayerMove = function () {
    return this._lastPlayerMove;
};

Player.prototype.getEventManager = function () {
    return this._eventManager;
};

Player.prototype.getPlayerSettings = function () {
    return this._playerSettings;
};

Player.prototype.cleanup = function () {
    createjs.Ticker.removeListener(this);
    //    window.onkeydown = null;
    //    window.onkeyup = null;
};


Player.prototype.tick = function () {
    var jumpComplete, currentTime, time, newX;
    //   img.x += 2.5 - Math.random() * 5;
    jumpComplete = false;
    currentTime = createjs.Ticker.getTime();
    time = (currentTime - this._jumpStartTime) * playerSpeed;
    lastX = this.x;
    lastY = this.y;
    if (leftDown) { // PB
        if (skew)
            this.skewX = 5;
    } else if (rightDown) {
        if (skew)
            this.skewX = -5;
    } else {
        this.skewX = 0;
    }
    if (rocking > 0)
        this.rotation = Math.sin(currentTime / 200) * rocking; // PB wobble flying saucer
    if (time < this._playerSettings.jumpDuration) {
        if (this._up) {
            if (time >= this._playerSettings.jumpDuration / 2) {
                this.y = this._jumpStartY + this._playerSettings.jumpHeight;
                this._up = !this._up;
            }
        }
        // Simple jump animation based on a quad ease
        if (this._up) {
            this.y = this._jumpStartY + this._quadEaseOut(time, 0, this._playerSettings.jumpHeight, this._playerSettings.jumpDuration / 2);
        } else {
            this.y = (this._jumpStartY + this._playerSettings.jumpHeight) - this._quadEaseIn(time - this._playerSettings.jumpDuration / 2, 0, this._playerSettings.jumpHeight, this._playerSettings.jumpDuration / 2);
        }
    } else {
        this.y = this._jumpStartY;
        this._up = !this._up;
        this._jumpStartTime = createjs.Ticker.getTime();
        jumpComplete = true;
    }
    // HANDLE KEYBOARD MOVE
    if (rightDown) {
        time = currentTime - timeDown;
        newX = (time * this._playerSettings.jumpDistance) / this._playerSettings.jumpDuration + xDown;
        if (newX + this._playerSettings.playerWidth >= this._playerSettings.maximumDistance) {
            newX = this._playerSettings.maximumDistance - this._playerSettings.playerWidth;
        }
        this.x = newX;
    }
    if (leftDown) {
        time = currentTime - timeDown;
        newX = xDown - (time * this._playerSettings.jumpDistance) / this._playerSettings.jumpDuration;
        if (newX <= 0) {
            newX = 0;
        }
        this.x = newX;
    }
    // DISPATCH EVENTS
    this._lastPlayerMove = new simplejump.game.PlayerMove(lastX, this.x, lastY, this.y);
    this._eventManager.dispatchEvent(this.PLAYER_MOVED);
    if (!this._up)
        this._eventManager.dispatchEvent(this.PLAYER_FALLING);
    if (jumpComplete) {
        this._eventManager.dispatchEvent(this.JUMP_COMPLETE);
    }
};

Player.prototype._quadEaseIn = function (t, b, c, d) {
    return c * (t /= d) * t + b;
};

Player.prototype._quadEaseOut = function (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
};

Player.prototype.goRight = function () {
    leftDown = false;
    rightDown = true;
    timeDown = createjs.Ticker.getTime();
    xDown = lastX;
};

Player.prototype.goLeft = function () {
    leftDown = true;
    rightDown = false;
    timeDown = createjs.Ticker.getTime();
    xDown = lastX;
};

Player.prototype.stopRight = function () {
    rightDown = false;
};

Player.prototype.stopLeft = function () {
    leftDown = false;
};

//Player.prototype._handleKeyDown = function (event) {
//    // right
//    if (event.keyCode === 39) {
//        if (!rightDown) {
//            Player.prototype.goRight();
//        }
//    }
//    // left
//    if (event.keyCode === 37) {
//        if (!leftDown) {
//            Player.prototype.goLeft();
//        }
//    }
//};

//Player.prototype._handleKeyUp = function (event) {
//    // right
//    if (event.keyCode === 39) {
//        Player.prototype.stopRight();
//    }
//    // left
//    if (event.keyCode === 37) {
//        Player.prototype.stopLeft();
//    }
//};
window.simplejump = window.simplejump || {};
window.simplejump.game = window.simplejump.game || {};
window.simplejump.game.Player = function (playerSettings) {
    return new Player(playerSettings);
};

function PlatformSettings() {}

PlatformSettings.prototype.platformWidth = 200; // 100 PB
PlatformSettings.prototype.platformHeight = -4; // 4 PB
PlatformSettings.prototype.platformColor = "#FFFFFF", //"#6b8e23";
    window.simplejump = window.simplejump || {};
window.simplejump.game = window.simplejump.game || {};
window.simplejump.game.PlatformSettings = function () {
    return new PlatformSettings();
};


function Platform(platformSettings) {
    this._platformSettings = platformSettings;
    this.initialize();
    this.drawPlatform();
}
Platform.prototype = new createjs.Container();
Platform.prototype.drawPlatform = function () {
    this.removeAllChildren();
    if (lastOne || gameIndex == 0) { // PB
        var shape = new createjs.Shape();
        shape.shadow = new createjs.Shadow("#FFFFFF", 0, 5, 10);
        shape.graphics.beginFill(this._platformSettings.platformColor);
        shape.graphics.drawRect(0, 0, this._platformSettings.platformWidth, this._platformSettings.platformHeight * 2);
        this.addChild(shape);
    } else {
        switch (gameIndex) {
            case 1:
                var img = new createjs.Bitmap("images/branch.png");
                img.shadow = new createjs.Shadow("#000000", 0, 5, 10);
                img.scaleX = this._platformSettings.platformWidth / 500;
                img.scaleY = -.15;
                img.crossOrigin = "Anonymous";
                this.addChild(img);
                break;
            case 2:
                var img = new createjs.Bitmap("images/lillypad.png");
                img.shadow = new createjs.Shadow("#FFFFFF", 0, 5, 10);
                img.scaleX = this._platformSettings.platformWidth / 500;
                img.scaleY = -.15;
                img.crossOrigin = "Anonymous";
                this.addChild(img);
                break;
            case 3:
                var img = new createjs.Bitmap("images/cloud.png");
                img.shadow = new createjs.Shadow("#FFFFFF", 0, 5, 10);
                img.scaleX = this._platformSettings.platformWidth / 500;
                img.scaleY = -.15;
                img.crossOrigin = "Anonymous";
                this.addChild(img);
                break;
        }
    }
};
Platform.prototype.checkInteresects = function (player) {
    var playerMove, A, B, E, F;
    playerMove = player.getLastPlayerMove();
    A = new createjs.Point(Math.round(this.x), Math.round(this.y + this._platformSettings.platformHeight));
    B = new createjs.Point(Math.round(this.x + this._platformSettings.platformWidth), Math.round(this.y + this._platformSettings.platformHeight));
    E = new createjs.Point(Math.round(playerMove.fromX), Math.round(playerMove.fromY));
    F = new createjs.Point(Math.round(playerMove.toX), Math.round(playerMove.toY));
    if (this._lineIntersectLine(A, B, E, F)) {
        return true;
    }
    E = new createjs.Point(Math.round(playerMove.fromX + player.getPlayerSettings().playerWidth), Math.round(playerMove.fromY));
    F = new createjs.Point(Math.round(playerMove.toX + player.getPlayerSettings().playerWidth), Math.round(playerMove.toY));
    if (this._lineIntersectLine(A, B, E, F)) {
        return true;
    }
    E = new createjs.Point(Math.round(playerMove.fromX + player.getPlayerSettings().playerWidth / 2), Math.round(playerMove.fromY));
    F = new createjs.Point(Math.round(playerMove.toX + player.getPlayerSettings().playerWidth / 2), Math.round(playerMove.toY));
    if (this._lineIntersectLine(A, B, E, F)) {
        return true;
    }
    return false;
};
Platform.prototype._lineIntersectLine = function (A, B, E, F) {
    var ip, a1, a2, b1, b2, c1, c2, denom;
    a1 = B.y - A.y;
    b1 = A.x - B.x;
    c1 = B.x * A.y - A.x * B.y;
    a2 = F.y - E.y;
    b2 = E.x - F.x;
    c2 = F.x * E.y - E.x * F.y;
    denom = a1 * b2 - a2 * b1;
    if (denom === 0) {
        return false;
    }
    ip = new createjs.Point();
    ip.x = (b1 * c2 - b2 * c1) / denom;
    ip.y = (a2 * c1 - a1 * c2) / denom;
    if (Math.pow(ip.x - B.x, 2) + Math.pow(ip.y - B.y, 2) > Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2)) {
        return false;
    }
    if (Math.pow(ip.x - A.x, 2) + Math.pow(ip.y - A.y, 2) > Math.pow(A.x - B.x, 2) + Math.pow(A.y - B.y, 2)) {
        return false;
    }

    if (Math.pow(ip.x - F.x, 2) + Math.pow(ip.y - F.y, 2) > Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2)) {
        return false;
    }
    if (Math.pow(ip.x - E.x, 2) + Math.pow(ip.y - E.y, 2) > Math.pow(E.x - F.x, 2) + Math.pow(E.y - F.y, 2)) {
        return false;
    }
    return true;
};
window.simplejump = window.simplejump || {};
window.simplejump.game = window.simplejump.game || {};
window.simplejump.game.Platform = function (platformSettings) {
    return new Platform(platformSettings);
};


function LevelSettings() {}
LevelSettings.prototype.levelWidth = theWidth; // 500 PB
LevelSettings.prototype.levelHeight = 3000; // 3000 PB
LevelSettings.prototype.levelColor = "#000080"; //"#e0ffff";
LevelSettings.prototype.platformScorePoints = 10;
window.simplejump = window.simplejump || {};
window.simplejump.game = window.simplejump.game || {};
window.simplejump.game.LevelSettings = function () {
    return new LevelSettings();
};

function Level(levelSettings, playerSettings, platformSettings) {
    this._eventManager = new simplejump.EventManager();
    this._levelSettings = levelSettings;
    this._playerSettings = playerSettings;
    this._platformSettings = platformSettings;
    this._platforms = [];
    this._player = null;
    this._cameraStartY = 0;
    this._cameraEndY = 0;
    this._cameraStartTime = 0;
    this._playerWon = false;
    this._lastPlatform = null;
    this._score = 0;
    this.initialize();
    this._generatePlatforms();
    this._addPlayer();
}
Level.prototype = new createjs.Container();
Level.prototype.GAME_OVER = "gameOver";
Level.prototype.SCORE_CHANGE = "scoreChange";
Level.prototype.getPlayerWon = function () {
    return this._playerWon;
};
Level.prototype.getScore = function () {
    return this._score;
};
Level.prototype.getEventManager = function () {
    return this._eventManager;
};
Level.prototype.cleanup = function () {
    createjs.Ticker.removeListener(this);
    this._player.cleanup();
};
Level.prototype.tick = function () {
    var currentTime, time, duration, newY;
    currentTime = createjs.Ticker.getTime();
    time = currentTime - this._cameraStartTime;
    duration = this._playerSettings.jumpDuration / 2;
    if (time < duration) {
        // Simple linear easing
        newY = this._cameraStartY + this._linear(time, 0, this._cameraEndY - this._cameraStartY, duration);
        this.y = -newY;
    } else {
        this.y = -this._cameraEndY;
        createjs.Ticker.removeListener(this);
    }
    if (gameIndex > 0)
        bgd.y = this.y;
};
Level.prototype._addPlayer = function () {
    var that = this;
    this._player = new simplejump.game.Player(this._playerSettings);
    this.addChild(this._player);
    this._player.x = this._levelSettings.levelWidth / 2 - this._playerSettings.playerWidth / 2;
    this._player.jump();
    this._player.getEventManager().addListener(this._player.PLAYER_FALLING, function () {
        that._playerFalling();
    });
    this._player.getEventManager().addListener(this._player.JUMP_COMPLETE, function () {
        that._jumpComplete();
    });
};
Level.prototype._generatePlatforms = function () {
    var lastPlatformX, lastPlatformY, platform, end, distance, direction, newX, newY, lastPlatformSettings;
    lastPlatformX = 0;
    lastPlatformY = 0;
    lastPlatformSettings = new simplejump.game.PlatformSettings();
    lastPlatformSettings.platformColor = this._platformSettings.platformColor;
    lastPlatformSettings.platformHeight = this._platformSettings.platformHeight;
    lastPlatformSettings.platformWidth = this._levelSettings.levelWidth;

    platform = new simplejump.game.Platform(lastPlatformSettings);
    platform.x = lastPlatformX = this._levelSettings.levelWidth / 2 - this._platformSettings.platformWidth / 2;
    platform.x = 0;
    this._lastPlatform = platform;
    this.addChild(platform);
    this._platforms.push(platform);
    end = false;
    while (!end) {
        distance = Math.random() * (this._playerSettings.jumpDistance - this._playerSettings.playerWidth);
        direction = Math.round(Math.random());
        newX = 0;
        if (direction === 0) {
            // left
            newX = lastPlatformX - distance;
            if (newX <= 0) {
                newX = 0;
            }
        } else {
            // right
            newX = lastPlatformX + distance;
            if (newX + this._platformSettings.platformWidth >= this._levelSettings.levelWidth) {
                newX = this._levelSettings.levelWidth - this._platformSettings.platformWidth;
            }
        }
        newY = lastPlatformY + Math.random() * (this._playerSettings.jumpHeight - this._playerSettings.playerHeight);
        if (newY - lastPlatformY < this._platformSettings.platformHeight) {
            newY = lastPlatformY + this._platformSettings.platformHeight;
        }
        if (newY >= this._levelSettings.levelHeight - this._platformSettings.platformHeight - this._playerSettings.playerHeight - this._playerSettings.jumpHeight) {
            newY = this._levelSettings.levelHeight - this._platformSettings.platformHeight - this._playerSettings.playerHeight - this._playerSettings.jumpHeight;
            end = true;
        }
        if (end) {
            lastOne = true; // PB
            platform = new simplejump.game.Platform(lastPlatformSettings);
            lastOne = false; // PB
            platform.x = 0;
        } else {
            platform = new simplejump.game.Platform(this._platformSettings);
            platform.x = newX;
        }

        this.addChild(platform);
        this._platforms.push(platform);
        platform.y = newY;
        lastPlatformX = newX;
        lastPlatformY = newY;
    }
};
Level.prototype._playerFalling = function () {
    var platform = this._checkIntersects();
    if (platform !== null) {
        this._player.y = platform.y + this._platformSettings.platformHeight;
        this._player.jump();
        this._moveCamera();
        this._updateScore(platform);
        this._checkGameOver(platform);
    }
    if (escapePressed) {
        this._eventManager.dispatchEvent(this.GAME_OVER);
        this._player.stopJump();
        return;
    }
};
Level.prototype._jumpComplete = function () {
    this._checkGameOver(null);
};
Level.prototype._checkIntersects = function () {
    var i, platform;
    for (i = this._platforms.length - 1; i >= 0; i--) {
        platform = this._platforms[i];
        if (platform.checkInteresects(this._player)) {
            firstBounce = false;
            return platform;
        }
    }
    return null;
};

Level.prototype._checkGameOver = function (platform) {
    if (escapePressed) {
        this._eventManager.dispatchEvent(this.GAME_OVER);
        this._player.stopJump();
        return;
    }
    if (platform === null) {
        platform = this._checkIntersects();
    }
    if (platform === null) {
        if (!firstBounce) {
            PlaySound("aargh01.mp3")
            this._eventManager.dispatchEvent(this.GAME_OVER);
            this._player.stopJump();
        }
    } else {
        if (platform === this._platforms[this._platforms.length - 1]) {
            this._playerWon = true;
            PlaySound("applause.mp3");
            this._eventManager.dispatchEvent(this.GAME_OVER);
            this._player.stopJump();
        } else {
            if (gameIndex == 2)
                PlaySound("frog.mp3");
            else if (gameIndex == 3)
                PlaySound("ufo.mp3");
            else
                PlaySound("bounce.mp3");
        }
    }
};
Level.prototype._updateScore = function (platform) {
    if (platform !== this._lastPlatform) {
        this._lastPlatform = platform;
        this._score += this._levelSettings.platformScorePoints;
        this._eventManager.dispatchEvent(this.SCORE_CHANGE);
    }
};
Level.prototype._linear = function (t, b, c, d) {
    return c * t / d + b;
};
Level.prototype._moveCamera = function () {
    this._cameraStartY = -this.y;
    this._cameraEndY = this._player.y - this._platformSettings.platformHeight;
    this._cameraStartTime = createjs.Ticker.getTime();
    createjs.Ticker.addListener(this);
};
window.simplejump = window.simplejump || {};
window.simplejump.game = window.simplejump.game || {};
window.simplejump.game.Level = function (levelSettings, playerSettings, platformSettings) {
    return new Level(levelSettings, playerSettings, platformSettings);
};

function GameView(stage) {
    this._eventManager = new simplejump.EventManager();
    this._game = null;
    this._playerWon = false;
    this._finalScore = 0;
    this.initialize();
}
GameView.prototype = new createjs.Container();
GameView.prototype.GAME_OVER = "gameOver";
GameView.prototype.startGame = function () {
    var that = this;
    this._game = new simplejump.game.Game();
    this.addChild(this._game);
    this._game.getEventManager().addListener(this._game.GAME_OVER, function () {
        that._gameOver();
    });
};
GameView.prototype.getPlayerWon = function () {
    return this._playerWon;
};
GameView.prototype.getFinalScore = function () {
    return this._finalScore;
};
GameView.prototype.getEventManager = function () {
    return this._eventManager;
};
var endTmr;

GameView.prototype._gameOver = function () {
    var that = this;
    this.removeChild(this._game);
    this._playerWon = this._game.getPlayerWon();
    this._finalScore = this._game.getFinalScore();
    this._eventManager.dispatchEvent(this.GAME_OVER);
    home.hidden = false; // PB
    if (this._playerWon) {
        Winner.hidden = false;
        endTmr = setTimeout(function () {
            if (escapePressed)
                showMenu();
            else
                finishTmr();
        }, 5000);
    } else {
        endTmr = setTimeout(function () {
            if (escapePressed)
                showMenu();
            else
                finishTmr();
        }, 3000);
    }
    if (escapePressed) {
        showMenu();
        clearTimeout(endTmr);
    }
};

window.simplejump = window.simplejump || {};
window.simplejump.view = window.simplejump.view || {};
window.simplejump.view.GameView = function (stage) {
    return new GameView(stage);
};



function Game() {
    this._eventManager = new simplejump.EventManager();
    this._playerSettings = new simplejump.game.PlayerSettings();
    this._platformSettings = new simplejump.game.PlatformSettings();
    this._levelSettings = new simplejump.game.LevelSettings();
    this._playerWon = false;
    this._levelHolder = new createjs.Container();
    this._level = new simplejump.game.Level(this._levelSettings, this._playerSettings, this._platformSettings);
    this._scoreBoard = null;
    this._score = 0;
    this.initialize();
    this._setupUI();
}
Game.prototype.GAME_OVER = "gameOver";
Game.prototype = new createjs.Container();
Game.prototype.getPlayerWon = function () {
    return this._playerWon;
};
Game.prototype.getFinalScore = function () {
    return this._score;
};
Game.prototype.getEventManager = function () {
    return this._eventManager;
};
Game.prototype._setupUI = function () {
    var that = this;
    this._levelHolder.addChild(this._level);
    this.addChild(this._levelHolder);
    this._levelHolder.y = 50;
    this._drawScoreBoard();
    this._level.getEventManager().addListener(this._level.SCORE_CHANGE, function () {
        that._updateScore();
    });
    this._level.getEventManager().addListener(this._level.GAME_OVER, function () {
        that._gameOver();
    });
};

Game.prototype._drawScoreBoard = function () {
    this._scoreBoard = new createjs.Text("", "35px Verdana", "#000000");
    this._scoreBoard.textAlign = "center";
    this._scoreBoard.textBaseline = "alphabetic";
    this._scoreBoard.x = this._levelSettings.levelWidth / 2;
    if (gameIndex < 2) {
        this._scoreBoard.y = window.innerHeight - 12; // PB was 35
        this._scoreBoard.scaleY = 1.5;
    } else {
        this._scoreBoard.y = window.innerHeight - 50; //12; // PB was 35
        this._scoreBoard.scaleY = -1.5;
    }
    //    var shape = new createjs.Shape();
    //    shape.graphics.beginFill("#afffff");
    //    shape.graphics.drawRect(0, 0, this._levelSettings.levelWidth, 50);
    // this.addChild(shape);
    this.addChild(this._scoreBoard);
};

Game.prototype._gameOver = function () {
    this._level.cleanup();
    this._playerWon = this._level.getPlayerWon();
    this._score = this._level.getScore();
    this._eventManager.dispatchEvent(this.GAME_OVER);
};

Game.prototype._updateScore = function () {
    this._score = this._level.getScore();
    this._scoreBoard.text = this._score.toString();
    this._scoreBoard.text = "";
    for (i = 0; i < this._score / 20; i++)
        this._scoreBoard.text += "😊";
};
window.simplejump = window.simplejump || {};
window.simplejump.game = window.simplejump.game || {};
window.simplejump.game.Game = function () {
    return new Game();
};

function EventManager() {
    this._listeners = [];
}

EventManager.prototype.addListener = function (type, fn) {
    var exists, i, l;
    exists = false;
    for (i = 0, l = this._listeners.length; i < l; i++) {
        if (this._listeners[i].type === type && this._listeners[i].fn === fn) {
            exists = true;
            break;
        }
    }
    if (!exists) {
        this._listeners.push({
            type: type,
            fn: fn
        });
    }
};

EventManager.prototype.removeListener = function (type, fn) {
    var exists, i, l;
    exists = false;
    for (i = 0, l = this._listeners.length; i < l; i++) {
        if (this._listeners[i].type === type && this._listeners[i].fn === fn) {
            exists = true;
            break;
        }
    }
    if (exists) {
        this._listeners.splice(i, 1);
    }
};

EventManager.prototype.dispatchEvent = function (type) {
    var i, l;
    for (i = 0, l = this._listeners.length; i < l; i++) {
        if (this._listeners[i].type === type) {
            this._listeners[i].fn();
        }
    }

};
window.simplejump = window.simplejump || {};
window.simplejump.EventManager = function () {
    return new EventManager();
};


function EndView(stage) {

    this._stage = stage;
    this._eventManager = new simplejump.EventManager();
    this._label = new createjs.Text("BACK TO START", "35px Verdana", "#000000");
    this._resultTxt = new createjs.Text("Game Over.", "200px Verdana", "#000000");
    this._scoreTxt = new createjs.Text("Final Score:", "35px Verdana", "#000000");
    this._outShape = new createjs.Shape();
    this._overShape = new createjs.Shape();
    this._pressShape = new createjs.Shape();
    this.initialize();
    this._setupUI();
}
EndView.prototype = new createjs.Container();
EndView.prototype.BACK_TO_START_CLICKED = "backToStartClicked";
EndView.prototype.setResult = function (won, score) {
    if (won) {
        this._resultTxt.text = ""; //"😊";
    } else {
        this._resultTxt.text = "😟";
    }
    this._scoreTxt.text = ""; // "Final Score: " + score;
    this._label.text = "";
};
EndView.prototype.getEventManager = function () {
    return this._eventManager;
};
EndView.prototype._setupUI = function () {
    var that, labelHeight;
    labelHeight = 35;
    that = this;
    endThat = this;
    this._resultTxt.textAlign = "center";
    this._resultTxt.textBaseline = "alphabetic";
    this._resultTxt.x = this._stage.canvas.width / 2;
    this.addChild(this._resultTxt);
    this._scoreTxt.textAlign = "center";
    this._scoreTxt.textBaseline = "alphabetic";
    this._scoreTxt.x = this._stage.canvas.width / 2;
    this.addChild(this._scoreTxt);
    this._label.textAlign = "center";
    this._label.textBaseline = "alphabetic";
    this._label.x = this._stage.canvas.width / 2;
    this._resultTxt.y = this._stage.canvas.height / 2 - 75 + labelHeight;
    this._scoreTxt.y = this._stage.canvas.height / 2 - 25 + labelHeight;
    this._label.y = this._stage.canvas.height / 2 + 25 + labelHeight;
    this.addChild(this._label);
    // out
    //    this._outShape.x = this._label.x - (this._label.getMeasuredWidth() + 40) / 2;
    //    this._outShape.y = this._stage.canvas.height / 2 + 25;
    //    this._outShape.graphics.beginFill("#87cefa");
    //    this._outShape.graphics.drawRect(0, 0, this._label.getMeasuredWidth() + 40, labelHeight + 10);
    //    // over
    //    this._overShape.x = this._outShape.x;
    //    this._overShape.y = this._outShape.y;
    //    this._overShape.graphics.beginFill("#00bfff");
    //    this._overShape.graphics.drawRect(0, 0, this._label.getMeasuredWidth() + 40, labelHeight + 10);
    //    // press
    //    this._pressShape.x = this._outShape.x;
    //    this._pressShape.y = this._outShape.y;
    //    this._pressShape.graphics.beginFill("#1e90ff");
    //    this._pressShape.graphics.drawRect(0, 0, this._label.getMeasuredWidth() + 40, labelHeight + 10);
    //    this.onMouseOut = function (event) {
    //        that.removeChildAt(0);
    //        that.addChildAt(that._outShape, 0);
    //    };
    //    this.onMouseOver = function (event) {
    //        that.removeChildAt(0);
    //        that.addChildAt(that._overShape, 0);
    //    };
    //    this.onPress = function (event) {
    //        that.removeChildAt(0);
    //        that.addChildAt(that._pressShape, 0);
    //    };
    //    this.onClick = function (event) {
    //        that.removeChildAt(0);
    //        that.addChildAt(that._overShape, 0);
    //        that._eventManager.dispatchEvent(that.BACK_TO_START_CLICKED);
    //    };
    //    this.addChildAt(this._outShape, 0);
};

window.simplejump = window.simplejump || {};
window.simplejump.view = window.simplejump.view || {};
window.simplejump.view.EndView = function (stage) {
    return new EndView(stage);
};


function countTmr() {
    var tmr = setTimeout(function () {
        startThat._eventManager.dispatchEvent(startThat.PLAY_CLICKED);
    }, 50);
}

function finishTmr() {
    var tmr = setTimeout(function () {
        Winner.hidden = true;
        if (splash.hidden)
            tmr = setTimeout(function () {
                endThat._eventManager.dispatchEvent(endThat.BACK_TO_START_CLICKED);
            }, 500);
    }, 50);
}

function StartView(stage) {
    this._stage = stage;
    this._label = new createjs.Text("", "70px Verdana", "#FFFFFF");
    this._overShape = new createjs.Shape();
    this._outShape = new createjs.Shape();
    this._pressShape = new createjs.Shape();
    this._eventManager = new simplejump.EventManager();
    this.initialize();
    this._setupUI();
}
StartView.prototype = new createjs.Container();
StartView.prototype.PLAY_CLICKED = "playClicked";
StartView.prototype.getEventManager = function () {
    return this._eventManager;
};


StartView.prototype._setupUI = function () {
    var that, labelHeight;
    that = this;
    startThat = this;
    labelHeight = 35;
    this._label.textAlign = "center";
    this._label.textBaseline = "alphabetic";
    this._label.x = this._stage.canvas.width / 2;
    this._label.y = this._stage.canvas.height / 2 - labelHeight / 2 + labelHeight;
    lbl = this._label;
    this.addChild(this._label);
    countTmr();

    // out
    //    this._outShape.x = this._label.x - (this._label.getMeasuredWidth() + 40) / 2;
    //    this._outShape.y = this._stage.canvas.height / 2 - labelHeight / 2;
    //    this._outShape.graphics.beginFill("#87cefa");
    //    this._outShape.graphics.drawRect(0, 0, this._label.getMeasuredWidth() + 40, labelHeight + 10);
    // over
    //this._overShape.x = this._outShape.x;
    // this._overShape.y = this._outShape.y;
    // this._overShape.graphics.beginFill("#00bfff");
    // this._overShape.graphics.drawRect(0, 0, this._label.getMeasuredWidth() + 40, labelHeight + 10);
    // press
    //    this._pressShape.x = this._outShape.x;
    //    this._pressShape.y = this._outShape.y;
    //    this._pressShape.graphics.beginFill("#1e90ff");
    //    this._pressShape.graphics.drawRect(0, 0, this._label.getMeasuredWidth() + 40, labelHeight + 10);
    //    this.onMouseOut = function (event) {
    //        that.removeChildAt(0);
    //        that.addChildAt(that._outShape, 0);
    //    };
    //    this.onMouseOver = function (event) {
    //        that.removeChildAt(0);
    //        that.addChildAt(that._overShape, 0);
    //    };
    //    this.onPress = function (event) {
    //        that.removeChildAt(0);
    //        that.addChildAt(that._pressShape, 0);
    //    };
    //    this.onClick = function (event) {
    //        that.removeChildAt(0);
    //        that.addChildAt(that._overShape, 0);
    //        that._eventManager.dispatchEvent(that.PLAY_CLICKED);
    //    };
    //    this.addChildAt(this._outShape, 0);
};
window.simplejump = window.simplejump || {};
window.simplejump.view = window.simplejump.view || {};
window.simplejump.view.StartView = function (stage) {
    return new StartView(stage);
};
