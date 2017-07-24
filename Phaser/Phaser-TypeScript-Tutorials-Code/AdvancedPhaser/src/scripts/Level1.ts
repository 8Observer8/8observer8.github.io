/// <reference path="../../node_modules/@develephant/types-phaser/phaser/index.d.ts" />

import * as PlayerModule from "./Player";
import Player = PlayerModule.Castlevania.Player;

export namespace Castlevania
{
    export class Level1 extends Phaser.State
    {

        background: Phaser.Sprite;
        music: Phaser.Sound;
        player: Player;

        create()
        {
            this.physics.startSystem(Phaser.Physics.ARCADE);
            this.background = this.add.sprite(0, 0, 'level1');
            this.music = this.add.audio('music', 1, false);
            this.music.play();
            this.player = new Player(this.game, 130, 332);
        }
    }
}