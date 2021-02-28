'use strict';
import PopUp from './popup.js';
import { GameBuilder, Reason } from './game.js';
import * as sound from './sound.js';

const game = new GameBuilder()
.gameDuration(10)
.carrotCount(12)
.bugCount(10)
.build();

game.setGameStopListener((reason) => {
  let message;
  switch(reason) {
    case Reason.cancel : 
      message = 'REPLAY❓';
      sound.playAlert();
      break;

    case Reason.win : 
      message = 'Win🎉';
      sound.playWin();
      break;
    
    case Reason.lose : 
      message = 'lose💣';
      sound.playBug();
      break;
    
    default: 
      throw new Error('not valid reason');

  }
  gameFinishBanner.showWithText(message);
});

const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListenr(() => {
  game.start();
});
