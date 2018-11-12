console.clear();
console.log('start');


/****** Snake! *****/

function snakeClass(startX, startY, snakeLength, fullBlockSize) {
    this.fullBlockSize = fullBlockSize;
    this.body = [{x: startX, y: startY, color: 'orange'}];
    this.movingDirection = 'left';
    this.snakeBlockIdPrefix = 'eazy_snake_block_id_';

    let color = '';
    for (let i = 1; i < snakeLength; i++) {
        color = this.getBlockColor(color);
        this.body[i] = { x: this.body[i - 1].x + 1, y: startY, color: color }
    }
}

snakeClass.prototype.getBlockColor = function (prevColor) {
    return prevColor === 'grey' ? 'yellow' : 'grey';
}

snakeClass.prototype.draw = function () {

    this.fullBlockSize = this.fullBlockSize ? this.fullBlockSize : 1;

    let snakeBlockId = '',
        snakeBlock;

    for (let id = 0; id < this.body.length; id++) {
        snakeBlockId = this.snakeBlockIdPrefix + id;
        snakeBlock = document.getElementById(snakeBlockId);

        if (!snakeBlock) {
            snakeBlock = document.createElement('div');
            snakeBlock.id = snakeBlockId;
            snakeBlock.className = 'snakeBlock';

            if (id === 0) {
                snakeBlock.style.zIndex = 1;
            }

            document.getElementById(this.fieldDivId).appendChild(snakeBlock);
        }

        snakeBlock.style.left = (this.body[id].x * this.fullBlockSize) + 'px';
        snakeBlock.style.top = (this.body[id].y * this.fullBlockSize) + 'px';
        snakeBlock.style.backgroundColor = this.body[id].color;
    }
}

snakeClass.prototype.calculateMovement = function () {
    for (let id = this.body.length - 1; id > 0; id--) {
        this.body[id].x = this.body[id - 1].x;
        this.body[id].y = this.body[id - 1].y;
    }

    if (this.newMovingDirection) {
        this.movingDirection = this.newMovingDirection;
    }

    if (this.movingDirection === 'up') {
        this.body[0].y = this.body[0].y - 1;
        if (this.body[0].y < 0) {
            this.body[0].y = this.body[0].y + this.fieldHeight;
        }
    } else if (this.movingDirection === 'down') {
        this.body[0].y = this.body[0].y + 1;
        if (this.body[0].y >= this.fieldHeight) {
            this.body[0].y = this.body[0].y - this.fieldHeight;
        }
    } else if (this.movingDirection === 'left') {
        this.body[0].x = this.body[0].x - 1;
        if (this.body[0].x < 0) {
            this.body[0].x = this.body[0].x + this.fieldWidth;
        }
    } else {
        this.body[0].x = this.body[0].x + 1;
        if (this.body[0].x >= this.fieldWidth) {
            this.body[0].x = this.body[0].x - this.fieldWidth;
        }
    }
}

snakeClass.prototype.move = function () {
    this.calculateMovement();
    this.draw();
}

snakeClass.prototype.isEatYummy = function (yummy) {
    if (yummy) {
        if (this.body[0].x === yummy.x && this.body[0].y === yummy.y) {
            this.body.push({
                x: yummy.x,
                y: yummy.y,
                color: this.getBlockColor(this.body[this.body.length - 1].color)
            });
            return true;
        }
    }
    return false;
}

snakeClass.prototype.setMovementDirection = function (direction) {
    if ((this.movingDirection === 'up' && direction === 'down') ||
        (this.movingDirection === 'down' && direction === 'up') ||
        (this.movingDirection === 'left' && direction === 'right') ||
        (this.movingDirection === 'right' && direction === 'left')) {
        return;
    }
    this.newMovingDirection = direction;
}

snakeClass.prototype.isBiteItself = function () {
    for (let i = 1; i < this.body.length; i++) {
        if (this.body[0].x === this.body[i].x && this.body[0].y === this.body[i].y) {
            return true;
        }
    }
}

/******* Game ********/

function snakeGameClass() {
    let clientWidth = document.documentElement.clientWidth,
        clientHeight = document.documentElement.clientHeight,
        minWidth = 30,
        minHeight = 50;

    this.isGameRuning = false;
    this.blockSize = 5;
    this.borderSize = 1;
    this.moveSpeed = 100;
    this.fullBlockSize = this.blockSize + (this.borderSize * 2);
    this.fieldDivId = 'eazy_snake_field';
    this.fieldHeaderId = 'eazy_snake_header';
    this.snakeBlockIdPrefix = 'eazy_snake_block_id_';
    this.fieldWidth = clientWidth / (this.fullBlockSize * 3) > minWidth ? clientWidth / 3 / this.fullBlockSize : minWidth;
    this.fieldHeight = clientHeight / (this.fullBlockSize * 3) > minHeight ? clientHeight / 3 / this.fullBlockSize : minHeight;
    this.yummyCreateTry = 0;
    this.speed = 0;
    this.speeds = [200, 190, 180, 170, 160, 150, 140, 130, 120, 110, 100, 90, 80, 70, 60, 50, 40, 30, 20, 10];


    const startX = 5,
        startY = 5,
        startSnakeLength = 4,
        style = document.createElement('style');

    style.type = 'text/css';
    style.innerHTML = '.snakeBlock {' +
        'position: absolute; ' +
        'border: ' + this.borderSize + 'px solid black;' +
        'width: ' + this.blockSize + 'px; ' +
        'height: ' + this.blockSize + 'px; ' +
        '}';

    document.getElementsByTagName('head')[0].appendChild(style);

    this.snakeObj = new snakeClass(startX, startY, startSnakeLength);

    /* TODO maybe should do setters */
    this.snakeObj.fullBlockSize = this.fullBlockSize;
    this.snakeObj.snakeBlockIdPrefix = this.snakeBlockIdPrefix;
    this.snakeObj.fieldDivId = this.fieldDivId;
    this.snakeObj.fieldWidth = this.fieldWidth;
    this.snakeObj.fieldHeight = this.fieldHeight;

    this.drawHeader();
    this.drawField();
    this.snakeObj.draw();
}

/**
 * Change text to drawing squares
 *
 * ***** ***** ***** ***** ***         *
 * *     *   * *     *     *  *   **  **
 * ***** ***** ***   ***   *   *       *
 *     * *     *     *     *   *  **   *
 * ***** *     ***** ***** *****     *****
 */
snakeGameClass.prototype.drawHeader = function () {
    let header = document.getElementById(this.fieldDivId),
        headerHeightPx, headerHeadBlocks = 3;

    if (!header) {
        header = document.createElement('div');
        header.id = this.fieldHeaderId;
        document.getElementsByTagName('body')[0].appendChild(header);
    }

    header.innerHTML = '';

    header.style.width = this.fieldWidth * this.fullBlockSize + 'px';
    headerHeightPx = headerHeadBlocks * this.fullBlockSize;
    header.style.height = headerHeightPx + 'px';
    header.style.left = (document.documentElement.clientWidth - this.fieldWidth * this.fullBlockSize) / 2 + 'px';
    header.style.top = (((document.documentElement.clientHeight - this.fieldHeight * this.fullBlockSize) / 2) - headerHeightPx ) + 'px';
    header.style.border = '1px solid black';
    header.style.position = 'fixed';
    header.style.display = 'inline-block';
    header.style.backgroundColor = 'rgba(0,255,255,0.7)';
}

snakeGameClass.prototype.drawField = function () {
    let field = document.getElementById(this.fieldDivId);

    if (!field) {
        field = document.createElement('div');
        field.id = this.fieldDivId;
        document.getElementsByTagName('body')[0].appendChild(field);
    }

    field.innerHTML = '';

    field.style.width = this.fieldWidth * this.fullBlockSize + 'px';
    field.style.height = this.fieldHeight * this.fullBlockSize + 'px';
    field.style.left = (document.documentElement.clientWidth - this.fieldWidth * this.fullBlockSize) / 2 + 'px';
    field.style.top = (document.documentElement.clientHeight - this.fieldHeight * this.fullBlockSize) / 2 + 'px';
    field.style.border = '1px solid black';
    field.style.position = 'fixed';
    field.style.display = 'inline-block';
    field.style.backgroundColor = 'rgba(255,255,255,0.7)';
}

/*TODO should change this */
snakeGameClass.prototype.run = function () {
    var game = this;
    setTimeout(function () {
        if (game.isGameRuning) {
            game.makeIteration();
            game.run();
        }
    }, this.speeds[this.speed]);
}

snakeGameClass.prototype.makeIteration = function () {
    if (!this.isSnakeDie()) {
        this.checkSnakeEateYummy();
        this.createYummy();
        if (this.yummy) {
            this.drawYummy();
        }
        this.snakeObj.move();
    }
}

/*TODO change this*/
snakeGameClass.prototype.isSnakeDie = function () {
    if (this.snakeObj.isBiteItself()) {
        alert('gg');
        this.isGameRuning = false;
        return true;
    }
    return false;
}

snakeGameClass.prototype.checkSnakeEateYummy = function () {
    if (this.snakeObj.isEatYummy(this.yummy)) {
        this.yummy = null;
    }
}

snakeGameClass.prototype.drawYummy = function () {
    let yummyBlock = document.getElementById(this.yummy.id);

    if (!yummyBlock) {
        yummyBlock = document.createElement('div');
        yummyBlock.id = this.yummy.id;
        yummyBlock.className = 'snakeBlock';
        document.getElementById(this.fieldDivId).appendChild(yummyBlock);
    }

    let color = yummyBlock.style.backgroundColor === 'red' ? 'purple' : 'red';

    yummyBlock.style.left = this.yummy.x * this.fullBlockSize + 'px';
    yummyBlock.style.top = this.yummy.y * this.fullBlockSize + 'px';
    yummyBlock.style.backgroundColor = color;
}

snakeGameClass.prototype.canCreateYummyByCoord = function (x, y) {
    let canCreate = true;

    for (let id = 0; id < this.snakeObj.body.length; id++) {
        if (this.snakeObj.body[id].x === x && this.snakeObj.body[id].y === y) {
            canCreate = false;
        }
    }

    return canCreate;
}

snakeGameClass.prototype.createYummy = function () {
    if (!this.yummy) {
        let x = this.getRandomInt(this.fieldWidth),
            y = this.getRandomInt(this.fieldHeight);

        if (this.canCreateYummyByCoord(x, y)) {
            this.yummy = {
                x: x,
                y: y,
                id: this.snakeBlockIdPrefix + this.snakeObj.body.length
            }
            this.yummyCreateTry = 0;
        } else {
            this.yummyCreateTry++;
            if (this.yummyCreateTry > 100) {
                this.isGameRuning = false;
                alert('Can\'t create yummy. You win!');
            } else {
                this.createYummy();
            }
        }
    }
}

snakeGameClass.prototype.getRandomInt = function (max, min = 0) {
    return Math.floor(min + Math.floor(Math.random() * Math.floor(max - min)));
}

snakeGameClass.prototype.setMovementDirection = function (direction) {
    this.snakeObj.setMovementDirection(direction);
}

/******* Let's go! ******/

/*
document.getElementsByTagName('body')[0].style.backgroundImage = 'url("https://bipbap.ru/wp-content/uploads/2017/12/3bcf49273613bc88bc79040f08fd422008c52624.jpg")';
*/

const game = new snakeGameClass();

function myKeyCheck(e) {
    console.log(e.keyCode);

    // w = 119, a = 97, s = 115, d = 100
    // ц ф ы в i = 1094, 1092, 1099, 1074, 1110
    if ([119, 97, 115, 100, 1094, 1092, 1099, 1074, 1110].indexOf(e.keyCode) !== -1) {
        if ([119, 1094].indexOf(e.keyCode) !== -1) {
            game.setMovementDirection('up');
        } else if ([115, 1099, 1110].indexOf(e.keyCode) !== -1) {
            game.setMovementDirection('down');
        } else if ([97, 1092].indexOf(e.keyCode) !== -1) {
            game.setMovementDirection('left');
        } else {
            game.setMovementDirection('right');
        }

        if (!game.isGameRuning) {
            game.isGameRuning = true;
            game.run();
        }
    } else if (e.keyCode === 32) {
        game.isGameRuning = false;
    }
}

document.addEventListener('keypress', myKeyCheck);