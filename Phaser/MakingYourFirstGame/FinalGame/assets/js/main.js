var game;

// �������� ������� game (600 �������� � ������ � 450 �������� � ������)
game = new Phaser.Game(600, 450, Phaser.AUTO, '');

// ������ �������� - �������� ������ ���������
// ������ �������� - ������, ������� ����� ������� ������ ������ ���������
game.state.add('Menu', Menu);

// ��������� ��������� "����"
game.state.add('Game', Game);

game.state.start('Menu');

game.state.add('Game_Over', Game_Over);