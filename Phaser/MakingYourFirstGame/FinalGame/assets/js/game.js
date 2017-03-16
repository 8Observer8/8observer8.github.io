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
        snake = [];                     // Этот список работает как хранилище для частей нашей змейки
        apple = {};                     // Объект для яблока
        squareSize = 15;                // Длина сторон всех наших квадратов (яблока и части для змейки). Наши изображения имеют размер 15x15 пикселей
        score = 0;                      // Игровые очки
        speed = 0;                      // Скорость игры
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
        // Скорость игры
        game.add.text(500, 20, "SPEED", textStyle_Key);
        speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);
    },

    update: function ()
    {
        // Обработчики нажания клавиш-стрелок

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

        // Формула, которая вычисляет скорость игры, которая в свою очередь, базируется на очках
        // Наибольшая скорость игры может быть равна максимум 10-и
        speed = Math.min(10, Math.floor(score / 5));
        // Обновляем значение скорости на экране
        speedTextValue.text = '' + speed;

        // Так как функция update имеет частому вызова около 60 раз в секунд, то
        // нам нужно уменьшить частоту вызова кода перемещения змейки

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

            // Если новое направление было выбрано в обработчике нажания клавишы, то меняем текущее направление змейки
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
            // Момечаем её, как первую ячейку
            snake.push(lastCell);
            firstCell = lastCell;

            // Увеличиваем размер змейки, если яблоко было съедено
            // Создаём блок позади змейки со старыми координатами последнего блока
            // (последний блок, к настоящему моменту, переместился вместе с остальной частью змейки)
            if (addNew)
            {
                snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
                addNew = false;
            }

            // Проверяем столкновение с яблоком
            this.appleCollision();

            // Проверяем столкновение головы змейки со своим телом
            // Параметр - голова змейки
            this.selfCollision(firstCell);

            // Проверяем столкновение головы змейки со стеной
            // Параметр - голова змейки
            this.wallCollision(firstCell);
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
    },

    appleCollision: function ()
    {
        // Проверяем, что любая часть змейки пересекла яблоко
        // Проверка пересечения со всеми частями змейки необходима, чтобы
        // учесть случай, если новое яблоко появится внутри змейки
        for (var i = 0; i < snake.length; i++)
        {
            if (snake[i].x == apple.x && snake[i].y == apple.y)
            {
                // В следущий момент времени, когда змейка переместится, то
                // новый блок будет добавлен к ней
                addNew = true;

                // Удаляем старое яблоко
                apple.destroy();

                // Создаём новое яблоко
                this.generateApple();

                // Увеличиваем число заработанных очков
                score++;

                // Обновняем очки на табло
                scoreTextValue.text = score.toString();
            }
        }

    },

    selfCollision: function (head)
    {
        // Проверяем, что голова змейки не пересекла одну из своих частей
        for (var i = 0; i < snake.length - 1; i++)
        {
            if (head.x == snake[i].x && head.y == snake[i].y)
            {
                // Если пересекла, то показываем экран Game Over
                game.state.start('Game_Over');
            }
        }

    },

    wallCollision: function (head)
    {
        // Проверяем, что голова змейки находится в границах игрового поля
        if (head.x >= 600 || head.x < 0 || head.y >= 450 || head.y < 0)
        {
            // Если это не так, что мы врезались в стену. Значит, показываем экран Game Over
            game.state.start('Game_Over');
        }
    }
};
