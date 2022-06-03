'use strict';

const sound = function(source) {
  const audio = new Audio();
  audio.preload = 'auto';
  audio.src = source;
  return audio;
};

const playMusic = audio => audio.play();
const stopMusic = audio => audio.pause();
const beginMusic = audio => audio.currentTime = 0;

const mainSound = sound('./sound/mainSound.mp3');
mainSound.loop;

const scoreSound = name => {
  const audio = sound('./sound/scoreSound.mp3');
  audio.volume = 0.8;
  return audio;
};

const defeatSound = sound('./sound/defeatSound.mp3');
const victorySound = sound('./sound/victorySound.mp3');

