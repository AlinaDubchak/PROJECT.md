'use strict';

const view = {
  main: document.querySelector('.main'),
  points: document.getElementById('score'),
  levels: document.getElementById('level'),
  gameOver: document.getElementById('game-over'),
  yourScore: document.getElementById('current-score'),
  textScore: document.getElementById('your-score'),
  start: document.getElementById('start'),
  startAgain: document.getElementById('start-again'),
  pause: document.getElementById('space'),
  nextFigure: document.getElementById('next-piece'),
  win: document.getElementById('win'),
  startAgainBtn: document.getElementById('startAgain'),
  prevNextFigure: document.getElementById('next-figure'),
  };
  
  const gameTimers = {
    isPaused: true,
    timerID: undefined,
  };
  
  const options = {
    movingCells: 1,
    fixedCells: 2,
    freeCells: 0,
    rows: 20,
    colums: 10,
    score: 0,
    currentLevel: 1,
  };
  
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
  