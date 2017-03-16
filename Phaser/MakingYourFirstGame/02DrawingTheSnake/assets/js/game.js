var snake, apple, squareSize, score, speed,
    updateDelay, direction, new_direction,
    addNew, cursors, scoreTextValue, speedTextValue,
    textStyle_Key, textStyle_Value;

var Game = {

    preload: function ()
    {
        // Здесь мы загружаем все необходимые ресурсы для уровня
        // В нашем случае, это просто два квадрата: один для тела змейки и другой для яблока
        game.load.image('snake', './assets/images/snake.png');
        game.load.image('apple', './assets/images/apple.png');
    },

    create: function ()
    {
        // Перед стартом игры, мы здесь инициализируем глобальные переменные, объявленные в начале файла
        // Мы сделали эти переменные глобальными, чтобы они были доступны в функции update
        snake = [];                     // Это работает как стек, хранящий части нашей змейки
        apple = {};                     // Объект для яблока
        squareSize = 15;                // Длина сторон всех наших квадратов (яблока и части для змейки). Наши изображения имеют размер 15x15 пикселей
        score = 0;                      // Игровые очки
        speed = 0;                      // Скорость движения змейки
        updateDelay = 0;                // Переменная для контроля за частотой обновления
        direction = 'right';            // Направление нашей змейки
        new_direction = null;           // Буфер для хранения нового направления
        addNew = false;                 // Переменная, которая показывает, что еда была съедена

        // Сообщить Phaser'у, что мы хотим использовать для управления клавиатуру (клавиши со стрелками)
        cursors = game.input.keyboard.createCursorKeys();

        game.stage.backgroundColor = '#061f27';

        // Генерируем начальный стек элементов змейки. Наша змейка будет иметь длину 10 элементов
        // Начинаем с позиции X=150 Y=150 и увеличиваем X на каждой итерации
        for (var i = 0; i < 10; i++)
        {
            // Параметры: координата X, координата Y, изображение
            snake[i] = game.add.sprite(150 + i * squareSize, 150, 'snake');
        }

        // Создаём первое яблоко
        this.generateApple();

        // Добавляем текст в верхнюю часть игры
        textStyle_Key = { font: "bold 14px sans-serif", fill: "#46c0f9", align: "center" };
        textStyle_Value = { font: "bold 18px sans-serif", fill: "#fff", align: "center" };
        // Игровые очки
        game.add.text(30, 20, "SCORE", textStyle_Key);
        scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
        // Скорость змейки
        game.add.text(500, 20, "SPEED", textStyle_Key);
        speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);
    },

    update: function ()
    {
        // Функция update вызывается постоянно с высокой частотой (где-то около 60 кадров в секунду)
        // обновляя игровое поле
        // Мы пока оставим тело этой функции пустым
    },

    generateApple: function ()
    {
        // Выбираем случайное место на игровом поле
        // X между 0 и 585 (39*15)
        // Y между 0 и 435 (29*15)
        var randomX = Math.floor(Math.random() * 40) * squareSize,
            randomY = Math.floor(Math.random() * 30) * squareSize;

        // Добавляем новое яблоко
        apple = game.add.sprite(randomX, randomY, 'apple');
    }
};
