var Game_Over = {

    preload: function ()
    {
        // Загружаем рисунок
        game.load.image('gameover', './assets/images/gameover.png');
    },

    create: function ()
    {
        // Создаём кнопку для старта игры, как мы делали в скрипте main.js
        this.add.button(0, 0, 'gameover', this.startGame, this);

        // Выводим на экран сколько мы набрали очков
        game.add.text(235, 350, "LAST SCORE", { font: "bold 16px sans-serif", fill: "#46c0f9", align: "center" });
        game.add.text(350, 348, score.toString(), { font: "bold 20px sans-serif", fill: "#fff", align: "center" });
    },

    startGame: function ()
    {
        // Меняем текущее состояние обратно на состояние "Игра"
        // Change the state back to Game.
        this.state.start('Game');
    }
};
