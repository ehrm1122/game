'use strict';

import * as sound from './sound.js';
const CARROT_SIZE = 80;

export default class Field {
  constructor(carrotCount, bugCount) {
    this.carrotCount = carrotCount;
    this.bugCount = bugCount;
    this.gameField = document.querySelector('.game__field');
    this.gameFieldRect = this.gameField.getBoundingClientRect();
    this.gameField.addEventListener('click', this.onClick);
  }
  
  setClickListener(onItemClick) { 
    // setClickListener함수를 통해서 onItemClick을 인자로 받아와
    // 그러면 this.onItemClick에는 main.js의 함수 onItemClik의 정보가 초기화, 즉 저장이 된다.
    this.onItemClick = onItemClick;
    console.log(this.onItemClick);
  }
  
  init() {
    this.gameField.innerHTML = ``;
    this._addItem('carrot', this.carrotCount, 'img/carrot.png');
    this._addItem('bug', this.bugCount, 'img/bug.png');
  }

  _addItem(className, count, imgPath) {
    const x1 = 0;
    const y1 = 0;
    const x2 = this.gameFieldRect.width - CARROT_SIZE;
    const y2 = this.gameFieldRect.height - CARROT_SIZE;
  
    for(let i = 0; i<count; i++) {
      const item = document.createElement('img');
      item.setAttribute('class', className);
      item.setAttribute('src', imgPath);
      const x = randomCoordinate(x1, x2);
      const y = randomCoordinate(y1, y2);
      item.style.position = 'absolute';
      item.style.left = `${x}px`;
      item.style.top = `${y}px`;
      this.gameField.appendChild(item);
    }
  }

  onClick = (event) => {
    const target = event.target;
    if(target.matches('.carrot')){
      target.remove();
      sound.playCarrot();
      this.onItemClick && this.onItemClick('carrot'); 
    } else if(target.matches('.bug')){
      this.onItemClick && this.onItemClick('bug');
    } 
  };
}

function randomCoordinate(min, max) {
  return Math.random() * (max - min) + min;
}


