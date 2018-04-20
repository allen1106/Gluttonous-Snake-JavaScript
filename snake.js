function snakeGame() {
    var snake = new Object();

    snake.DirectionEnum = {
        UP : 'up',
        DOWN : 'down',
        LEFT : 'left',
        RIGHT : 'right'
    }

    snake.getLocation = function(x, y) {
        var location = new Object();
        location.X = x;
        location.Y = y;
        return location;
    }

    snake.changeNodeStyle = function(node, styleStr) {
        cellNum = node.Y * 50 + node.X;
        targetCell = document.getElementsByClassName('cell')[cellNum];
        targetCell.setAttribute('class', styleStr);
    }

    snake.generateFood = function() {
        temLocat = null;
        while(true) {
            flag = true;
            temLocat = snake.getLocation(Math.floor(Math.random()*50), Math.floor(Math.random()*50));
            for (i in snake.body) {
                if (snake.body[i].X == temLocat.X && snake.body[i].Y == temLocat.Y) {
                    flag = false;
                }
            }
            if (snake.head.X == temLocat.X && snake.head.Y == temLocat.Y) {
                flag = false;
            }
            if (flag) {
                break;
            }
        }
        return temLocat;
    }

    snake.startGame = function() {
        $snakeMap = document.getElementById('background');
        $snakeMap.innerHTML = '';
        for(var i=0; i<50; i++) {
            for(var j=0; j<50; j++) {
                var cellDiv = document.createElement("div");
                cellDiv.setAttribute("class", "cell");
                $snakeMap.appendChild(cellDiv);
            }
        }
        snake.score = 0;
        snake.length = 0;
        snake.head = snake.getLocation(0, 0);
        snake.body = [];
        snake.direction = snake.DirectionEnum.RIGHT;
        snake.food = snake.generateFood();
        snake.drawMap();
        document.onkeydown = snake.move;
        snake.snake_action = setInterval(snake.action, 500);
    }

    snake.endGame = function() {
    }

    snake.drawMap = function() {
        document.getElementById('score-box').innerText = snake.score;
        cells = document.getElementsByClassName('cell');
        for (var i=0; i<cells.length; i++) {
            cells[i].setAttribute('class', 'cell');
        }
        snake.changeNodeStyle(snake.head, 'cell snake-node');
        for (var i=0; i<snake.body.length; i++) {
            snake.changeNodeStyle(snake.body[i], 'cell snake-node');
        }
        snake.changeNodeStyle(snake.food, 'cell food-node');
    }

    snake.move = function(event) {
        if (event.keyCode) {
            if (event.keyCode == 37) {
                if (snake.direction != snake.DirectionEnum.RIGHT) {
                   snake.direction = snake.DirectionEnum.LEFT;
                }
            } else if (event.keyCode == 38) {
                if (snake.direction != snake.DirectionEnum.DOWN) {
                    snake.direction = snake.DirectionEnum.UP;
                }
            } else if (event.keyCode == 39) {
                if (snake.direction != snake.DirectionEnum.LEFT) {
                    snake.direction = snake.DirectionEnum.RIGHT;
                }
            } else if (event.keyCode == 40) {
                if (snake.direction != snake.DirectionEnum.UP) {
                    snake.direction = snake.DirectionEnum.DOWN;
                }
            }
        }
        snake.drawMap();
    }

    snake.action = function() {
        nextStep = null;
        if (snake.direction == snake.DirectionEnum.UP) {
            nextStep = snake.getLocation(snake.head.X, snake.head.Y - 1);
        } else if (snake.direction == snake.DirectionEnum.DOWN) {
            nextStep = snake.getLocation(snake.head.X, snake.head.Y + 1);
        } else if (snake.direction == snake.DirectionEnum.LEFT) {
            nextStep = snake.getLocation(snake.head.X - 1, snake.head.Y);
        } else if (snake.direction == snake.DirectionEnum.RIGHT) {
            nextStep = snake.getLocation(snake.head.X + 1, snake.head.Y);
        }

        /* is against the wall */
        if (nextStep.X < 0 || nextStep.X >= 50 || nextStep.Y < 0 || nextStep.Y >= 50) {
            clearInterval(snake.snake_action);
            return;
        }

        /* is head against the body */
        for (var i=0; i<snake.body.length; i++) {
            if (snake.body[i].X == nextStep.X && snake.body[i].Y == nextStep.Y) {
                clearInterval(snake.snake_action);
                return;
            }
        }

        /* against the food */
        if (snake.food.X == nextStep.X && snake.food.Y == nextStep.Y) {
            console.log('against the food');
            snake.score += 5;
            snake.length += 1;
            snake.food = snake.generateFood();
            console.log(snake.length);
            if (snake.length <= 40 && snake.length%5 == 0) {
                console.log(snake.length);
                clearInterval(snake.snake_action);
                snake.snake_action = setInterval(snake.action, 500 - 50*Math.floor(snake.length/5));
            }
        }

        /* remake the snake */
        for (var i=snake.length - 1; i>=0; i--) {
            if (i == 0) {
                snake.body[i] = snake.getLocation(snake.head.X, snake.head.Y);
            } else {
                snake.body[i] = snake.getLocation(snake.body[i-1].X, snake.body[i-1].Y);
            }
        }
        snake.head.X = nextStep.X;
        snake.head.Y = nextStep.Y;

        snake.drawMap();
    }
    return snake;
}

btn_pause = document.getElementById('pause');
btn_continue = document.getElementById('continue');
btn_start = document.getElementById('start');
btn_stop = document.getElementById('stop');
btn_pause.onclick = function() {
    clearInterval(snake.snake_action);
    this.className = "button pause hide";
    btn_continue.className = "button continue";
}

btn_continue.onclick = function() {
    snake.snake_action = setInterval(snake.action, 500);
    this.className = "button continue hide";
    btn_pause.className = "button pause";
}

btn_start.onclick = function() {
    clearInterval(snake.snake_action);
    snake.startGame();
    btn_continue.className = "button continue hide";
    btn_pause.className = "button pause";
}

snake = snakeGame();
snake.startGame();


/*
1. 根据长度调节速度 -- ok
2. 加一个暂停按钮
3. 显示分数 -- ok
4. 食物出现在蛇身 -- ok
*/
