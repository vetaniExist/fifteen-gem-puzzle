import {
  MyCanvas,
} from "./canvas";

import {
  getRandomInt,
  formatTime,
} from "./utils";

import {
  updateTimeEl,
  getTimeInnerText,
} from "./configurateLayout";


export class GamePuzzle {
  constructor(canvas) {
    this.startArray = [];
    this.canvasObj = new MyCanvas(canvas);
    this.stepCounter = 0;
    this.today = null;
    this.size = 4;
    this.audio = [];
  }

  initAudio(){
    let audio_swipe = document.createElement("audio");
    audio_swipe.setAttribute("src", "/src/assets/sounds/tink.wav");
    this.audio["swipe"] = audio_swipe;
  }

  configurateStartField() {
    let fieldOfCellValues = [];
    this.startArray = [];
    switch(this.size) {
      case 4: {
        fieldOfCellValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        console.log("configurate basic field");
        break;
      }
      case 3: {
        
      }
      case 8: {

      }
      default: {
        throw new Error("configurateStartField func err. This field size not implimented");
      }
    }

    for(let i = 0; i < this.size * this.size - 1; i += 1) {
      let randCeil = getRandomInt(fieldOfCellValues.length);
      this.startArray.push(fieldOfCellValues[randCeil]);
      fieldOfCellValues.splice(randCeil,1)
    }
    if (this.isSolved(this.startArray)) {
      this.startArray.push("");
    } else {
      console.log("restart");
      this.configurateStartField();
      
    }
      
  }

  isSolved(field) {
    console.log("isSolved");
    let inversesCounter = 0;
    for (let i = 1; i < this.size * this.size - 1; i += 1) {
      for (let j = 0; j < i; j += 1) {
        if (field[i] < field[j]) {
          inversesCounter += 1;
        }
      }
     
    }
    console.log("inversesCounter " + inversesCounter);
    console.log("inversesCounter % 2 === 0" + inversesCounter % 2 === 0)
    return inversesCounter % 2 === 0 ? true : false;
  }

  start() {
    console.log(this.canvasObj);

    this.initAudio();
    this.configurateStartField();
    
    this.canvasObj.initBasicField(this.startArray, 4);
    this.today = new Date();
    this.stepCounter = 0;
    this.startTimer();

    this.canvasObj.canvas.addEventListener("click", (event) => {
      console.log("it was click");
      const rect = this.canvasObj.canvas.getBoundingClientRect();

      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const currentBlockClick = GamePuzzle.getBucketY(y) + GamePuzzle.getBucketValue(x);

      console.log("Coordinate x: ".concat(x));
      console.log("Coordinate y: ".concat(y));
      console.log(this.canvasObj.checkLeft(currentBlockClick));
      console.log(this.canvasObj.checkTop(currentBlockClick));
      console.log(this.canvasObj.checkRight(currentBlockClick));
      console.log(this.canvasObj.checkBottom(currentBlockClick));
      console.log(currentBlockClick);

      if (this.canvasObj.trySwap(currentBlockClick)) {
        this.audio["swipe"].play();
        this.stepCounter += 1;
        this.updateTime()
        console.log("Step is correct. Count of steps = " + this.stepCounter);
        if(this.canvasObj.checkWinCondition()) {
          this.canvasObj.addWinText(this.stepCounter, this.checkTime());
        } 
      }
    });
  }

  updateTime(minutes, sec) {
    if (minutes === undefined || sec === undefined) {
      const timeElInner = getTimeInnerText();
      updateTimeEl(timeElInner.slice(0, timeElInner.length - this.stepCounter.toString(10).length).concat(this.stepCounter))
    } else {
      updateTimeEl(formatTime(minutes).concat(" : ").concat(formatTime(sec)).concat(" step: ").concat(this.stepCounter));
    }
  }

   startTimer() {
    const newDate = new Date();

    const itTookHours = newDate.getHours() - this.today.getHours();
    const itTookMinutes = newDate.getMinutes() - this.today.getMinutes() + itTookHours * 60;
    let itTookSec;
    if (itTookMinutes) {
      itTookSec = newDate.getSeconds();
    } else {
      itTookSec = newDate.getSeconds() - this.today.getSeconds();
    }
    this.updateTime(itTookMinutes, itTookSec);

    setTimeout(this.startTimer.bind(this), 1000);
  }

  checkTime() {
    const newDate = new Date();

    const itTookHours = newDate.getHours() - this.today.getHours();
    const itTookMinutes = newDate.getMinutes() - this.today.getMinutes() + itTookHours * 60;
    const itTookSec =  itTookMinutes ? newDate.getSeconds() - this.today.getSeconds() : newDate.getSeconds();

    return "it took: minutes: ".concat(formatTime(itTookMinutes)).concat(" seconds: ").concat(formatTime(itTookSec));
  }

  

  static getBucketValue(x) {
    if (x < 120) {
      return 0;
    }
    if (x >= 120 && x < 240) {
      return 1;
    }
    if (x >= 240 && x < 360) {
      return 2;
    }
    if (x >= 360 && x < 481) {
      return 3;
    }
    throw new Error("something goes wrong in GamePuzzle getBuchetY func");
  }

  static getBucketY(y) {
    switch (GamePuzzle.getBucketValue(y)) {
      case 0: {
        return 0;
      }
      case 1: {
        return 4;
      }
      case 2: {
        return 8;
      }
      case 3: {
        return 12;
      }
      default: {
        throw new Error("something goes wrong in GamePuzzle getBuchetY func");
      }
    }
  }
  
}

export default GamePuzzle;