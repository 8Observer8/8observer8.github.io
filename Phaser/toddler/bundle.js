!function t(e,i,r){function n(s,a){if(!i[s]){if(!e[s]){var h="function"==typeof require&&require;if(!a&&h)return h(s,!0);if(o)return o(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var u=i[s]={exports:{}};e[s][0].call(u.exports,function(t){var i=e[s][1][t];return n(i||t)},u,u.exports,t,e,i,r)}return i[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)n(r[s]);return n}({1:[function(t,e,i){"use strict";var r=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])};return function(e,i){function r(){this.constructor=e}t(e,i),e.prototype=null===i?Object.create(i):(r.prototype=i.prototype,new r)}}();Object.defineProperty(i,"__esModule",{value:!0});!function(t){var e=function(t){function e(e,i,r){return t.call(this,e,i,r,"arrow")||this}return r(e,t),e}(Phaser.Sprite);t.Arrow=e}(i.ToddlerGame||(i.ToddlerGame={}))},{}],2:[function(t,e,i){"use strict";var r=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])};return function(e,i){function r(){this.constructor=e}t(e,i),e.prototype=null===i?Object.create(i):(r.prototype=i.prototype,new r)}}();Object.defineProperty(i,"__esModule",{value:!0});var n,o=t("./GameState").ToddlerGame.GameState;!function(t){var e=function(t){function e(){var e=t.call(this,640,360,Phaser.AUTO,"")||this;return e.state.add("GameState",o),e.state.start("GameState"),e}return r(e,t),e}(Phaser.Game);t.Game=e}(n=i.ToddlerGame||(i.ToddlerGame={})),window.onload=function(){new n.Game}},{"./GameState":3}],3:[function(t,e,i){"use strict";var r=this&&this.__extends||function(){var t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i])};return function(e,i){function r(){this.constructor=e}t(e,i),e.prototype=null===i?Object.create(i):(r.prototype=i.prototype,new r)}}();Object.defineProperty(i,"__esModule",{value:!0});var n=t("./Arrow").ToddlerGame.Arrow;!function(t){var e=function(t){function e(){return null!==t&&t.apply(this,arguments)||this}return r(e,t),e.prototype.init=function(){this.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL,this.scale.pageAlignHorizontally=!0,this.scale.pageAlignVertically=!0},e.prototype.preload=function(){this.load.image("background","./assets/images/background.png"),this.load.image("arrow","./assets/images/arrow.png"),this.load.spritesheet("chicken","./assets/images/chicken_spritesheet.png",131,200,3),this.load.spritesheet("horse","./assets/images/horse_spritesheet.png",212,200,3),this.load.spritesheet("pig","./assets/images/pig_spritesheet.png",297,200,3),this.load.spritesheet("sheep","./assets/images/sheep_spritesheet.png",244,200,3),this.load.audio("chickenSound",["./assets/audio/chicken.ogg","./assets/audio/chicken.mp3"]),this.load.audio("horseSound",["./assets/audio/horse.ogg","./assets/audio/horse.mp3"]),this.load.audio("pigSound",["./assets/audio/pig.ogg","./assets/audio/pig.mp3"]),this.load.audio("sheepSound",["./assets/audio/sheep.ogg","./assets/audio/sheep.mp3"])},e.prototype.create=function(){var t=this;this.background=this.game.add.sprite(0,0,"background");var e=[{key:"chicken",text:"CHICKEN",sound:"chickenSound"},{key:"horse",text:"HORSE",sound:"horseSound"},{key:"pig",text:"PIG",sound:"pigSound"},{key:"sheep",text:"SHEEP",sound:"sheepSound"}];this.animals=this.game.add.group();var i;e.forEach(function(e){(i=t.animals.create(-1e3,t.game.world.centerY,e.key,0)).text=e.text,i.sound=t.game.add.audio(e.sound),i.anchor.setTo(.5),i.animations.add("animate",[0,1,2,1,0,1],3,!1),i.inputEnabled=!0,i.input.pixelPerfectClick=!0,i.events.onInputDown.add(t.animateAnimal,t)}),this.currentAnimal=this.animals.next(),this.currentAnimal.position.set(this.game.world.centerX,this.game.world.centerY),this.showText(this.currentAnimal),this.leftArrow=new n(this.game,60,this.game.world.centerY),this.game.add.existing(this.leftArrow),this.leftArrow.anchor.setTo(.5),this.leftArrow.scale.x=-1,this.leftArrow.direction=-1,this.leftArrow.inputEnabled=!0,this.leftArrow.input.pixelPerfectClick=!0,this.leftArrow.events.onInputDown.add(this.switchAnimal,this),this.rightArrow=new n(this.game,this.game.world.width-60,this.game.world.centerY),this.game.add.existing(this.rightArrow),this.rightArrow.anchor.setTo(.5),this.rightArrow.direction=1,this.rightArrow.inputEnabled=!0,this.rightArrow.input.pixelPerfectClick=!0,this.rightArrow.events.onInputDown.add(this.switchAnimal,this)},e.prototype.animateAnimal=function(t){t.play("animate"),t.sound.play()},e.prototype.switchAnimal=function(t){var e=this;if(this.isMoving)return!1;this.isMoving=!0,this.animalText.visible=!1;var i,r;t.direction>0?((i=this.animals.next()).x=-i.width/2,r=640+this.currentAnimal.width/2):((i=this.animals.previous()).x=640+i.width/2,r=-this.currentAnimal.width/2);var n=this.add.tween(i);n.to({x:this.game.world.centerX},1e3),n.onComplete.add(function(){e.isMoving=!1,e.showText(i)}),n.start(),this.add.tween(this.currentAnimal).to({x:r},1e3).start(),this.currentAnimal=i},e.prototype.showText=function(t){if(!this.animalText){var e={font:"bold 30pt Arial",fill:"#D0171B",align:"center"};this.animalText=this.game.add.text(this.game.width/2,.85*this.game.height,"",e),this.animalText.anchor.set(.5,.5)}this.animalText.setText(t.text),this.animalText.visible=!0},e}(Phaser.State);t.GameState=e}(i.ToddlerGame||(i.ToddlerGame={}))},{"./Arrow":1}]},{},[2]);
//# sourceMappingURL=bundle.js.map