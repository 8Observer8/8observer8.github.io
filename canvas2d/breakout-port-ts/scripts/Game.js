define(["require", "exports", "./Rect", "./Circle"], function (require, exports, Rect_1, Circle_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Game = /** @class */ (function () {
        function Game(canvasID) {
            var _this = this;
            this.paddleSpeed = 3;
            this.brickRowCount = 3;
            this.brickColumnCount = 5;
            this.brickWidth = 75;
            this.brickHeight = 20;
            this.brickPadding = 10;
            this.brickOffsetTop = 30;
            this.brickOffsetLeft = 30;
            this.bricks = [];
            this.score = 0;
            // Get canvas element
            var canvas = document.getElementById(canvasID);
            if (canvas === null) {
                console.log("Failed to get the canvas element with id = " + canvasID);
                return;
            }
            // Get rendering context
            this.ctx = canvas.getContext("2d");
            this.width = canvas.width;
            this.height = canvas.height;
            document.addEventListener("keydown", function (e) { return _this.KeyDownHandler(e); }, false);
            document.addEventListener("keyup", function (e) { return _this.KeyUpHandler(e); }, false);
            //document.addEventListener("mousemove", (e) => this.MouseMoveHandler(e), false);
            this.CreateScene();
            this.CreateBricks();
            this.Update();
        }
        Game.prototype.CreateScene = function () {
            this.paddle = new Rect_1.Rect(this.ctx, 0, 0, 50, 10, "#0095DD");
            this.paddle.position.set(this.width / 2 - this.paddle.width / 2, this.height - this.paddle.height - 10);
            var x0 = this.width / 2;
            var y0 = this.height - 30;
            this.ball = new Circle_1.Circle(this.ctx, x0, y0, 10, "#0095DD");
            this.dx = 2;
            this.dy = -2;
            this.rightPressed = false;
            this.leftPressed = false;
        };
        Game.prototype.CreateBricks = function () {
            this.bricks = [];
            for (var c = 0; c < this.brickColumnCount; c++) {
                this.bricks[c] = [];
                for (var r = 0; r < this.brickRowCount; r++) {
                    var x = (c * (this.brickWidth + this.brickPadding)) + this.brickOffsetLeft;
                    var y = (r * (this.brickHeight + this.brickPadding)) + this.brickOffsetTop;
                    //this.bricks[c][r] = { x: 0, y: 0 };
                    this.bricks[c][r] = new Rect_1.Rect(this.ctx, x, y, this.brickWidth, this.brickHeight, "#0095DD");
                }
            }
        };
        Game.prototype.Update = function () {
            var _this = this;
            requestAnimationFrame(function () { return _this.Update(); });
            this.KeyboardHandler();
            this.CheckCollisions();
            this.ball.position.x += this.dx;
            this.ball.position.y += this.dy;
            this.Draw();
        };
        Game.prototype.Draw = function () {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.paddle.Draw();
            this.ball.Draw();
            for (var c = 0; c < this.brickColumnCount; c++) {
                for (var r = 0; r < this.brickRowCount; r++) {
                    if (!this.bricks[c][r].visible) {
                        continue;
                    }
                    this.bricks[c][r].Draw();
                }
            }
            this.DrawScore();
        };
        Game.prototype.KeyboardHandler = function () {
            if (this.rightPressed && this.paddle.position.x < this.width - this.paddle.width) {
                this.paddle.position.x += this.paddleSpeed;
            }
            else if (this.leftPressed && this.paddle.position.x > 0) {
                this.paddle.position.x -= this.paddleSpeed;
            }
        };
        Game.prototype.KeyDownHandler = function (e) {
            if (e.keyCode == 39 || e.keyCode == 68) {
                this.rightPressed = true;
            }
            else if (e.keyCode == 37 || e.keyCode == 65) {
                this.leftPressed = true;
            }
        };
        Game.prototype.KeyUpHandler = function (e) {
            if (e.keyCode == 39 || e.keyCode == 68) {
                this.rightPressed = false;
            }
            else if (e.keyCode == 37 || e.keyCode == 65) {
                this.leftPressed = false;
            }
        };
        Game.prototype.MouseMoveHandler = function (e) {
            var relativeX = e.clientX - this.ctx.canvas.offsetLeft;
            if (relativeX > 0 && relativeX < this.width) {
                this.paddle.position.x = relativeX - this.paddle.width / 2;
            }
        };
        Game.prototype.DrawScore = function () {
            this.ctx.font = "16px Arial";
            this.ctx.fillStyle = "#0095DD";
            this.ctx.fillText("Score: " + this.score, 8, 20);
        };
        Game.prototype.CheckCollisions = function () {
            if (this.ball.position.x + this.dx < this.ball.radius ||
                this.ball.position.x + this.dx > this.width - this.ball.radius) {
                this.dx = -this.dx;
            }
            if (this.ball.position.y + this.dy < this.ball.radius) {
                this.dy = -this.dy;
            }
            else if (this.ball.position.y + this.dy > this.paddle.position.y - this.ball.radius) {
                if (this.paddle.position.x < this.ball.position.x &&
                    this.ball.position.x < this.paddle.position.x + this.paddle.width) {
                    this.dy = -this.dy;
                }
                else {
                    alert("GAME OVER");
                    this.CreateScene();
                }
            }
            var x = this.ball.position.x;
            var y = this.ball.position.y;
            for (var c = 0; c < this.brickColumnCount; c++) {
                for (var r = 0; r < this.brickRowCount; r++) {
                    var b = this.bricks[c][r];
                    if (!b.visible) {
                        continue;
                    }
                    if (b.position.x < x && x < b.position.x + this.brickWidth &&
                        b.position.y < y && y < b.position.y + this.brickHeight) {
                        this.dy = -this.dy;
                        b.visible = false;
                        this.score++;
                        if (this.score == this.brickRowCount * this.brickColumnCount) {
                            alert("YOU WIN, CONGRATULATIONS!");
                            this.CreateScene();
                            this.CreateBricks();
                        }
                    }
                }
            }
        };
        return Game;
    }());
    exports.Game = Game;
});
