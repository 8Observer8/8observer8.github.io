var snake, apple, squareSize, score, speed,
    updateDelay, direction, new_direction,
    addNew, cursors, scoreTextValue, speedTextValue,
    textStyle_Key, textStyle_Value;

var Game = {

    preload: function ()
    {
        // ����� �� ��������� ��� ����������� ������� ��� ������
        // � ����� ������, ��� ������ ��� ��������: ���� ��� ���� ������ � ������ ��� ������
        game.load.image('snake', './assets/images/snake.png');
        game.load.image('apple', './assets/images/apple.png');
    },

    create: function ()
    {
        // ����� ������� ����, �� ����� �������������� ���������� ����������, ����������� � ������ �����
        // �� ������� ��� ���������� �����������, ����� ��� ���� �������� � ������� update
        snake = [];                     // ���� ������ �������� ��� ��������� ��� ������ ����� ������
        apple = {};                     // ������ ��� ������
        squareSize = 15;                // ����� ������ ���� ����� ��������� (������ � ����� ��� ������). ���� ����������� ����� ������ 15x15 ��������
        score = 0;                      // ������� ����
        speed = 0;                      // �������� ����
        updateDelay = 0;                // ���������� ��� �������� �� �������� ����������
        direction = 'right';            // ����������� ����� ������
        new_direction = null;           // ����� ��� �������� ������ �����������
        addNew = false;                 // ����������, ������� ����������, ��� ��� ���� �������

        // �������� Phaser'�, ��� �� ����� ������������ ��� ���������� ���������� (������� �� ���������)
        cursors = game.input.keyboard.createCursorKeys();

        game.stage.backgroundColor = '#061f27';

        // ���������� ��������� ���� ��������� ������. ���� ������ ����� ����� ����� 10 ���������
        // �������� � ������� X=150 Y=150 � ����������� X �� ������ ��������
        for (var i = 0; i < 10; i++)
        {
            // ���������: ���������� X, ���������� Y, �����������
            snake[i] = game.add.sprite(150 + i * squareSize, 150, 'snake');
        }

        // ������ ������ ������
        this.generateApple();

        // ��������� ����� � ������� ����� ����
        textStyle_Key = { font: "bold 14px sans-serif", fill: "#46c0f9", align: "center" };
        textStyle_Value = { font: "bold 18px sans-serif", fill: "#fff", align: "center" };
        // ������� ����
        game.add.text(30, 20, "SCORE", textStyle_Key);
        scoreTextValue = game.add.text(90, 18, score.toString(), textStyle_Value);
        // �������� ����
        game.add.text(500, 20, "SPEED", textStyle_Key);
        speedTextValue = game.add.text(558, 18, speed.toString(), textStyle_Value);
    },

    update: function ()
    {
        // ����������� ������� ������-�������

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

        // �������, ������� ��������� �������� ����, ������� � ���� �������, ���������� �� �����
        // ���������� �������� ���� ����� ���� ����� �������� 10-�
        speed = Math.min(10, Math.floor(score / 5));
        // ��������� �������� �������� �� ������
        speedTextValue.text = '' + speed;

        // ��� ��� ������� update ����� ������� ������ ����� 60 ��� � ������, ��
        // ��� ����� ��������� ������� ������ ���� ����������� ������

        // ����������� ������� �� ������� ������ ����� ������� update
        updateDelay++;

        // ��������� ��� ����� ���� ������ ���� ������� ������ �������� (10 - �������� ����)
        // Do game stuff only if the counter is aliquot to (10 - the game speed).
        // ��� ������ �������� ���������� speed, ��� ���� ���������� ���� ��� � ��� ������� �������� ������
        if (updateDelay % (10 - speed) == 0)
        {
            // ������������ ������

            var firstCell = snake[snake.length - 1],
                lastCell = snake.shift(),
                oldLastCellx = lastCell.x,
                oldLastCelly = lastCell.y;

            // ���� ����� ����������� ���� ������� � ����������� ������� �������, �� ������ ������� ����������� ������
            if (new_direction)
            {
                direction = new_direction;
                new_direction = null;
            }

            // ������ ���������� ��������� ������ ������������ ������ ������ �������� �����������
            // �� ���� ������ ���������� ��������� ������, ����� ��� ������ ��������� ����� ������� ������

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

            // �������� ��������� ������ ������ �����
            // �������� �, ��� ������ ������
            snake.push(lastCell);
            firstCell = lastCell;

            // ����������� ������ ������, ���� ������ ���� �������
            // ������ ���� ������ ������ �� ������� ������������ ���������� �����
            // (��������� ����, � ���������� �������, ������������ ������ � ��������� ������ ������)
            if (addNew)
            {
                snake.unshift(game.add.sprite(oldLastCellx, oldLastCelly, 'snake'));
                addNew = false;
            }

            // ��������� ������������ � �������
            this.appleCollision();

            // ��������� ������������ ������ ������ �� ����� �����
            // �������� - ������ ������
            this.selfCollision(firstCell);

            // ��������� ������������ ������ ������ �� ������
            // �������� - ������ ������
            this.wallCollision(firstCell);
        }
    },

    generateApple: function ()
    {
        // �������� ��������� ����� �� ������� ����
        // X ����� 0 � 585 (39*15)
        // Y ����� 0 � 435 (29*15)
        var randomX = Math.floor(Math.random() * 40) * squareSize,
            randomY = Math.floor(Math.random() * 30) * squareSize;

        // ��������� ����� ������
        apple = game.add.sprite(randomX, randomY, 'apple');
    },

    appleCollision: function ()
    {
        // ���������, ��� ����� ����� ������ ��������� ������
        // �������� ����������� �� ����� ������� ������ ����������, �����
        // ������ ������, ���� ����� ������ �������� ������ ������
        for (var i = 0; i < snake.length; i++)
        {
            if (snake[i].x == apple.x && snake[i].y == apple.y)
            {
                // � �������� ������ �������, ����� ������ ������������, ��
                // ����� ���� ����� �������� � ���
                addNew = true;

                // ������� ������ ������
                apple.destroy();

                // ������ ����� ������
                this.generateApple();

                // ����������� ����� ������������ �����
                score++;

                // ��������� ���� �� �����
                scoreTextValue.text = score.toString();
            }
        }

    },

    selfCollision: function (head)
    {
        // ���������, ��� ������ ������ �� ��������� ���� �� ����� ������
        for (var i = 0; i < snake.length - 1; i++)
        {
            if (head.x == snake[i].x && head.y == snake[i].y)
            {
                // ���� ���������, �� ���������� ����� Game Over
                game.state.start('Game_Over');
            }
        }

    },

    wallCollision: function (head)
    {
        // ���������, ��� ������ ������ ��������� � �������� �������� ����
        if (head.x >= 600 || head.x < 0 || head.y >= 450 || head.y < 0)
        {
            // ���� ��� �� ���, ��� �� ��������� � �����. ������, ���������� ����� Game Over
            game.state.start('Game_Over');
        }
    }
};
