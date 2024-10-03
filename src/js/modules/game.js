import {Snake} from "./snake.js";
import {Food} from "./food.js";

export class Game {
    snake = null;
    context = null;
    positionsCount = null;
    positionsSize = null;
    score = null;
    scoreElement = null;
    interval = null;
    isPaused = false;
    pauseButton = null;

    constructor(context, settings) {
        this.context = context;
        this.positionsCount = settings.positionsCount;
        this.positionsSize = settings.positionsSize;

        this.scoreElement = document.getElementById('score');
        this.pauseButton = document.getElementById('pause');

        document.getElementById('start').onclick = () => {
            this.startGame();
        }

        document.getElementById('pause').onclick = () => {
            this.togglePause();
        }
    }

    startGame() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.score = 0;
        this.scoreElement.innerText = this.score;
        this.food = new Food(this.context, this.positionsCount, this.positionsSize);
        this.snake = new Snake(this.context, this.positionsCount, this.positionsSize);
        this.food.setNewFoodPosition();

        this.isPaused = false;
        this.pauseButton.innerText = 'Пауза';
        this.interval = setInterval(this.gameProcess.bind(this), 100);
    }

    togglePause() {
        if (this.isPaused) {
            this.isPaused = false;
            this.pauseButton.innerText = 'Пауза';
            this.interval = setInterval(this.gameProcess.bind(this), 100);
        } else {
            this.isPaused = true;
            this.pauseButton.innerText = 'Продолжить';
            clearInterval(this.interval);
        }
    }

    gameProcess() {
        if (this.isPaused) return;

        this.context.clearRect(0, 0, this.positionsCount * this.positionsSize, this.positionsCount * this.positionsSize);
        // this.showGrid();
        this.food.showFood()
        let result = this.snake.showSnake(this.food.foodPosition);
        if (result) {
            if (result.collision) {
                this.endGame()
            } else if (result.gotFood) {
                this.score += 1;
                this.scoreElement.innerText = this.score;
                this.food.setNewFoodPosition();
            }
        }
    }

    endGame() {
        clearInterval(this.interval);

        this.context.fillstyle = 'black';
        this.context.font = 'bold 48px Arial';
        this.context.textAlign = 'center';
        this.context.fillText(`Вы набрали: ${this.score} очков!`,
            (this.positionsCount * this.positionsSize) / 2, (this.positionsCount * this.positionsSize) / 2);
        this.pauseButton.innerText = 'Пауза';
    }

    showGrid() {
        const size = this.positionsCount * this.positionsSize;
        for (let x = 0; x <= size; x += this.positionsSize) {
            this.context.moveTo(0.5 + x + this.positionsSize, 0);
            this.context.lineTo(0.5 + x + this.positionsSize, size + this.positionsSize);
        }

        for (let x = 0; x <= size; x += this.positionsSize) {
            this.context.moveTo(0, 0.5 + x + this.positionsSize);
            this.context.lineTo(size + this.positionsSize, 0.5 + x + this.positionsSize);
        }
        this.context.strokeStyle = "black";
        this.context.stroke();
    }
}