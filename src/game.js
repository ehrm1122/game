'use strict';

import Field from './field.js';
import * as sound from './sound.js';

export const Reason = Object.freeze({
  win: 'win',
  lose: 'lose',
  cancel: 'cancel'
});

export class GameBuilder {
  gameDuration(duration) {
    this.gameDuration = duration;
    return this;
  }

  carrotCount(num) {
    this.carrotCount = num;
    return this;
  }

  bugCount(num) {
    this.bugCount = num;
    return this;
  }

  build() {
    return new Game(
      this.gameDuration,
      this.carrotCount,
      this.bugCount
    );
  }
}

class Game {
  constructor(gameDuration, carrotCount, bugCount) {
    this.gameDuration = gameDuration;
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;

    this.gameTimer = document.querySelector('.game__timer');
    this.gameScore = document.querySelector('.game__score');
    this.gameBtn = document.querySelector('.game__button');
    this.gameBtn.addEventListener('click', () => {
      if(this.started){
        this.stop(Reason.cancel);
      } else {
        this.start();
      }
    });

    this.gameField = new Field(carrotCount, bugCount);
    this.gameField.setClickListener(this.onItemClick);

    this.started = false;
    this.score = 0;
    this.timer = undefined;
  }

  setGameStopListener(onGameStop) {
    this.onGameStop = onGameStop;
    console.log(this.onGameStop);
  }

  start() {
    sound.playBg();
    this.started = true;
    this.initGame();
    this.showTimerAndScore();
    this.startGameTimer();
    this.showStopButton();
  }
  
  stop(reason) {
    this.started = false;
    this.stopGameTimer();
    this.hideGameButton();
    sound.stopBg();
    this.onGameStop && this.onGameStop(reason);
  }

  onItemClick = (item) => {
    if(!this.started){
      return;
    }
    if(item === 'carrot'){
      this.score++;
      this.currentScore();
      if(this.carrotCount === this.score){
        this.stop(Reason.win);
      }
    } else if(item === 'bug') {
      this.stop(Reason.lose);
    }
  }

  initGame() {
    this.score = 0;
    this.gameScore.innerText = this.carrotCount;
    this.gameField.init();
  }
  
  showTimerAndScore() {
    this.gameTimer.style.visibility = 'visible';
    this.gameScore.style.visibility = 'visible';
  }
    
  
  startGameTimer() {
    let remainingTime = this.gameDuration;
    this.updaterTimer(remainingTime);
    this.timer = setInterval(() => {
      if(remainingTime <= 0){
        clearInterval(this.timer);
        this.stop(this.carrotCount === this.score? Reason.win : Reason.lose);
        return;
      }
      this.updaterTimer(--remainingTime);
    }, 1000);
  }
  
  updaterTimer(time) {
    const minutes = Math.floor(time / 60);
    const secs = time % 60;
    this.gameTimer.innerText = `${minutes}:${secs}`;
  }
  
  currentScore() {
    this.gameScore.innerText = this.carrotCount - this.score;
  }
  
  stopGameTimer() {
    clearInterval(this.timer);
  }
  
  showStopButton() {
    const icon = this.gameBtn.querySelector('.fas');
    icon.classList.remove('fa-play');
    icon.classList.add('fa-stop');
    this.gameBtn.style.visibility = 'visible';
  }
  
  hideGameButton() {
    this.gameBtn.style.visibility = 'hidden';
  }
}