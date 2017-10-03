(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
/// <reference path="./libs/phaser.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Boot = /** @class */ (function (_super) {
    __extends(Boot, _super);
    function Boot() {
        return _super.call(this) || this;
    }
    Boot.prototype.preload = function () {
        this.load.image("megatron", "./assets/megatron.png");
        this.game.load.physics("physicsInfo", "./assets/physics.json");
    };
    Boot.prototype.create = function () {
        this.game.state.start("Level");
    };
    return Boot;
}(Phaser.State));
exports.Boot = Boot;
},{}],2:[function(require,module,exports){
"use strict";
/// <reference path="./libs/phaser.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Boot_1 = require("./Boot");
var Level_1 = require("./Level");
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game() {
        var _this = _super.call(this, 800, 600, Phaser.AUTO, "content") || this;
        _this.state.add("Boot", Boot_1.Boot, false);
        _this.state.add("Level", Level_1.Level, false);
        _this.state.start("Boot");
        return _this;
    }
    return Game;
}(Phaser.Game));
exports.Game = Game;
},{"./Boot":1,"./Level":3}],3:[function(require,module,exports){
"use strict";
/// <reference path="./libs/phaser.d.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Level = /** @class */ (function (_super) {
    __extends(Level, _super);
    function Level() {
        return _super.call(this) || this;
    }
    Level.prototype.create = function () {
        // #1
        // this._player1 = this.game.add.sprite(this.game.width / 2, 150, "megatron");
        // this._player2 = this.game.add.sprite(this.game.width / 2, this.game.height, "megatron");
        var _this = this;
        // this.game.physics.startSystem(Phaser.Physics.P2JS);
        // // Enabled physics on our sprites
        // this.game.physics.p2.enable([this._player1, this._player2]);
        // // Make our one body motionless
        // this._player1.body.static = true;
        // // Now create a sprite between our two bodies, parameters are rest length, stiffness and damping
        // // Rest length is the length of the spring at rest ( where it's not under pressure )
        // // Stiffness is the resistance to movement of the spring
        // // Damping determines how fast the spring loses it's "boing"  Our low damping keeps our spring "boinging"
        // // Boing is a word I made up to describe the up and down motion of a spring doing it's spring thing
        // this.game.physics.p2.createSpring(this._player1, this._player2, 200, 2, 0.3);
        // // Lets loop a timed event every 10 seconds that moves the one end of our spring back to the start
        // // Mostly just so people that didn't see it run the first time in the browser have something to see!
        // this.game.time.events.loop(Phaser.Timer.SECOND * 5, () =>
        // {
        //     this._player2.body.x = this.game.width / 2;
        //     this._player2.body.y = this.game.height;
        // }, this);
        // #2
        this._player1 = this.game.add.sprite(0, 0, "megatron");
        this._player2 = this.game.add.sprite(0, 0, "megatron");
        // Being lazy, positioning sprite after creation so we have a valid width/height
        this._player1.position.set(this._player1.width / 2, 150);
        // Now another sprite on the right side of the screen, down slightly
        this._player2.position.set(this.game.width / 2, 150);
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        // Passing in true while enabling physics on an object causes the debug renderer to draw the physics body
        this.game.physics.p2.enable([this._player1, this._player2], true);
        // You need to call clearShapes() to get rid of the existing bounding box
        this._player1.body.clearShapes();
        this._player2.body.clearShapes();
        // Now load the polygon bounding data we created externally
        this._player1.body.loadPolygon("physicsInfo", "megatron");
        this._player2.body.loadPolygon("physicsInfo", "megatron");
        // Now let's get this party started
        this._player2.body.moveLeft(80);
        // Finally, when the collision occurs, move back to the beginning and start over
        this._player2.body.onBeginContact.add(function (body, bodyB, shapeA, shapeB, equation) {
            _this._player2.body.x = _this.game.width / 2;
            _this._player2.body.y = 150;
        }, this);
    };
    return Level;
}(Phaser.State));
exports.Level = Level;
},{}],4:[function(require,module,exports){
"use strict";
exports.__esModule = true;
var Game_1 = require("./Game");
var Program = /** @class */ (function () {
    function Program() {
    }
    Program.Main = function () {
        new Game_1.Game();
    };
    return Program;
}());
exports.Program = Program;
window.onload = function () {
    Program.Main();
};
},{"./Game":2}]},{},[4])

//# sourceMappingURL=bundle.js.map
