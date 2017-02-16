﻿var loadState = {
    preload: function () {
        // Add a 'loading...' label on the screen
        var loadingLabel = game.add.text(game.world.centerX, 150, 'loading...',
                            { font: '30px Arial', fill: '#ffffff' });
        loadingLabel.anchor.setTo(0.5, 0.5);
        // Display the progress bar
        var progressBar = game.add.sprite(game.world.centerX, 200, 'progressBar');
        progressBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(progressBar);
        // Load all our assets
        //game.load.image('player', '../../assets/player.png');
        game.load.spritesheet('player', './assets/player2.png', 20, 20);
        game.load.image('enemy', './assets/enemy.png');
        game.load.image('coin', './assets/coin.png');
        //game.load.image('wallV', '../../assets/wallVertical.png');
        //game.load.image('wallH', '../../assets/wallHorizontal.png');
        // Load a new asset that we will use in the menu state
        game.load.image('background', './assets/background.png');

        // Sound when the player jumps
        game.load.audio('jump', ['./assets/jump.ogg', 'assets/jump.mp3']);
        // Sound when the player takes a coin
        game.load.audio('coin', ['./assets/coin.ogg', 'assets/coin.mp3']);
        // Sound when the player dies
        game.load.audio('dead', ['./assets/dead.ogg', 'assets/dead.mp3']);

        game.load.image('pixel', './assets/pixel.png');
        
        game.load.spritesheet('mute', './assets/muteButton.png', 28, 22);

        game.load.image('tileset', './assets/tileset.png');
        game.load.tilemap('map', './assets/coin_game_map.json', null, Phaser.Tilemap.TILED_JSON);
    },
    create: function ()
    {
        // Go to the menu state
        game.state.start('menu');
    }
};
