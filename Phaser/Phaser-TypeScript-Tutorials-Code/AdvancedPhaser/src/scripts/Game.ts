/// <reference path="../../node_modules/@develephant/types-phaser/phaser/index.d.ts" />

import * as BootModule from "./Boot";
import Boot = BootModule.Castlevania.Boot;

import * as PreloaderModule from "./Preloader";
import Preloader = PreloaderModule.Castlevania.Preloader;

import * as MainMenuModule from "./MainMenu";
import MainMenu = MainMenuModule.Castlevania.MainMenu;

import * as Level1Module from "./Level1";
import Level1 = Level1Module.Castlevania.Level1;

namespace Castlevania
{
    export class Game extends Phaser.Game
    {
        constructor()
        {
            super(800, 600, Phaser.AUTO, '');
            this.state.add('Boot', Boot, false);
            this.state.add('Preloader', Preloader, false);
            this.state.add('MainMenu', MainMenu, false);
            this.state.add('Level1', Level1, false);
            this.state.start('Boot');
        }
    }
}

window.onload = () =>
{
    new Castlevania.Game();
};