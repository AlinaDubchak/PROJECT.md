'use strict';

class View {
    constructor() {
      this.main = document.querySelector('.main');
      this.points = document.getElementById('score');
      this.levels = document.getElementById('level');
      this.gameOver = document.getElementById('game-over');
      this.yourScore = document.getElementById('current-score');
      this.textScore = document.getElementById('your-score');
      this.start = document.getElementById('start');
      this.startAgain = document.getElementById('start-again');
      this.pause = document.getElementById('space');
      this.nextFigure = document.getElementById('next-piece');
      this.win = document.getElementById('win');
      this.startAgainBtn = document.getElementById('startAgain');
      this.prevNextFigure = document.getElementById('next-figure');
    }
  }
  
  const gameTimers = {
    isPaused: true,
    timerID: undefined,
  };
  
  class Options {
    constructor() {
      this.movingCells = 1;
      this.fixedCells = 2;
      this.freeCells = 0;
      this.rows = 20;
      this.colums = 10;
      this.score = 990;
      this.currentLevel = 1;
    }
  }
  
  const gameOptions = new Options();
  const visual = new View();
  
  const possibleLevels = {
    1: {
      speed: 1000,
      nextLevelScore: 100,
    },
    2: {
      speed: 750,
      nextLevelScore: 250,
    },
    3: {
      speed: 500,
      nextLevelScore: 400,
    },
    4: {
      speed: 250,
      nextLevelScore: 500,
    },
    5: {
      speed: 200,
      nextLevelScore: 1000,
    },
  };
  
  const figures = {
    I: [
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
      [0, 1, 0, 0],
    ],
    J: [
      [1, 1, 1],
      [0, 0, 1],
      [0, 0, 0],
    ],
    L: [
      [1, 1, 1],
      [1, 0, 0],
      [0, 0, 0],
    ],
  
    O: [
      [1, 1],
      [1, 1],
    ],
    T: [
      [1, 1, 1],
      [0, 1, 0],
      [0, 0, 0],
    ],
    S: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    Z: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
  };
  