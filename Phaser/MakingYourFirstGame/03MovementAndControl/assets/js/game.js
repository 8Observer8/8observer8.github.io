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
        // Обработчики нажания клавиш стрелок. Пока мы не проверяем изменения направлений, которые губительны для игрока

        if (cursors.right.isDown && direction != 'left')
        {
            new_direction = 'right';
        }
        else if (cursors.left.isDown && direction != 'right')
        {
            new_direction = 'left';
        }
        else if (cursors.up.isDown && direction != 'down')
        {
            new_direction = 'up';
        }
        else if (cursors.down.isDown && direction != 'up')
        {
            new_direction = 'down';
        }

        // Формула, которая вычисляет скорость, которая в свою очередь, базируется на очках
        // Наибольшая скорость может быть равна максимум 10-и
        speed = Math.min(10, Math.floor(score / 5));
        // Обновляем значение скорости на экране
        speedTextValue.text = '' + speed;

        // Так как функция update имеет частому вызова около 60 раз в секунд, то
        // нам нужно уменьшить скорость вызова кода перемещения змейки

        // Увеличиваем счётчик на единицу каждый вызов функции update
        updateDelay++;

        // Выполняем эту часть кода только если счётчик кратен значению (10 - скорость игры)
        // Do game stuff only if the counter is aliquot to (10 - the game speed).
        // Чем больше значение переменной speed, тем чаще вызывается этот код и тем быстрее движется змейка
        if (updateDelay % (10 - speed) == 0)
        {
            // Передвижение змейки

            var firstCell = snake[snake.length - 1],
                lastCell = snake.shift(),
                oldLastCellx = lastCell.x,
                oldLastCelly = lastCell.y;

            // Если новое направление было выбрано в обработчике нажатия клавиши, то меняем текущее направление змейки
            if (new_direction)
            {
                direction = new_direction;
                new_direction = null;
            }

            // Меняем координаты последней ячейки относительно головы змейки согласно направлению
            // То есть меняем координаты последней ячейки, чтобы эта ячейка оказалась перед головой змейки

            if (direction == 'right')
            {
                lastCell.x = firstCell.x + 15;
                lastCell.y = firstCell.y;
            }
            else if (direction == 'left')
            {
                lastCell.x = firstCell.x - 15;
                lastCell.y = firstCell.y;
            }
            else if (direction == 'up')
            {
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y - 15;
            }
            else if (direction == 'down')
            {
                lastCell.x = firstCell.x;
                lastCell.y = firstCell.y + 15;
            }

            // Помещаем последнюю ячейку наверх стека
            // Помечаем её, как первую ячейку

            snake.push(lastCell);
            firstCell = lastCell;
        }
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
