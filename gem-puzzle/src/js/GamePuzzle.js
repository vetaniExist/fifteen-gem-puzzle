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
    this.canvas = canvas;
    this.canvasObj = new MyCanvas(this.canvas);
    this.canvasRect = null;
    this.stepCounter = 0;
    this.today = null;
    this.size = 4;
    this.audio = [];
    this.mouse = {
      x: 0,
      y: 0,
      isDown: false,
      moveX: 0,
      moveY:0,
    };
    this.mouseHandlerUp = null;
    this.mouseHandlerMove = null;
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
    // console.log("isSolved");
    let inversesCounter = 0;
    for (let i = 1; i < this.size * this.size - 1; i += 1) {
      for (let j = 0; j < i; j += 1) {
        if (field[i] < field[j]) {
          inversesCounter += 1;
        }
      }
     
    }
    // console.log("inversesCounter " + inversesCounter);
    // console.log("inversesCounter % 2 === 0" + inversesCounter % 2 === 0)
    return inversesCounter % 2 === 0 ? true : false;
  }

  getReplacedCanvas() {
    let el = document.getElementById('puzzle_canvas'),
    elClone = el.cloneNode(true);
    el.parentNode.replaceChild(elClone, el);
    return elClone;
  }

  restart(){ 
    this.startArray = [];
    this.canvas = this.getReplacedCanvas();
    this.canvasObj = new MyCanvas(this.canvas);
    this.canvasRect = null;
    this.stepCounter = 0;
    this.today = null;
    this.size = 4;
    this.audio = [];
    this.mouse = {
      x: 0,
      y: 0,
      isDown: false,
      moveX: 0,
      moveY:0,
      currCell: null,
    };
    this.mouseHandlerUp = null;
    this.mouseHandlerMove = null;
    console.log("restartewd");
    console.log(this);
  }

  start() {
    if (this.canvasRect !== null) {
      this.restart();
    }

    this.initAudio();
    this.configurateStartField();
    
    this.canvasObj.initBasicField(this.startArray, 4);
    this.getCanvasRect();
    this.today = new Date();
    this.stepCounter = 0;
    this.startTimer();

    this.canvasObj.canvas.addEventListener("mousedown", (event) =>{
      // запомнили координаты при нажатии, установили mouseMove в эту же позицию
      // const rect = this.canvasObj.canvas.getBoundingClientRect();
      console.log("this.mouse");
      console.log(this.mouse);
      this.mouse.x = event.clientX - this.canvasRect.left;
      this.mouse.y = event.clientY - this.canvasRect.top;

      this.mouse.moveX = this.mouse.x;
      this.mouse.moveY = this.mouse.y;

      this.currCell = this.canvasObj.getRectObj(GamePuzzle.getBucketY(this.mouse.y ) + GamePuzzle.getBucketValue(this.mouse.x));

      this.mouse.isDown = true;
      
      this.mouseHandlerUp =  this.onMouseUp.bind(this);
      this.mouseHandlerMove = this.onMouseMove.bind(this);

      document.getElementById('puzzle_canvas').addEventListener("mouseup", this.mouseHandlerUp);
      document.getElementById('puzzle_canvas').addEventListener("mousemove", this.mouseHandlerMove);
    });

    this.canvasObj.canvas.addEventListener("click", (event) => {
      const currentBlockClick = GamePuzzle.getBucketY(this.mouse.y ) + GamePuzzle.getBucketValue(this.mouse.x);

      console.log("Coordinate x: ".concat(this.mouse.x));
      console.log("Coordinate y: ".concat(this.mouse.y));
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

  getCanvasRect() {
    this.canvasRect = this.canvasObj.canvas.getBoundingClientRect();
  }

  onMouseMove(event) {
    console.log("this.mouse");
    console.log(this.mouse);
    if (this.mouse.isDown) {
      const rect = this.canvasObj.canvas.getBoundingClientRect();
      // const currentBlockClick = GamePuzzle.getBucketY(this.mouse.x) + GamePuzzle.getBucketValue(this.mouse.y);

      // this.canvasObj.isCursorInCell(this.mouse.moveX,this.mouse.moveY, currentBlockClick);
      this.mouse.moveX = event.clientX - rect.left;
      this.mouse.moveY = event.clientY - rect.top;

      this.currCell.x = this.mouse.moveX;
      this.currCell.y = this.mouse.moveY;

      console.log("find cell");
      console.log(this.currCell);
      this.canvasObj.redrawCanvas();

      console.log("move");
    }
  }

  onMouseUp(event = null){
    this.mouse.isDown = false;

    this.currCell.x 

    document.getElementById('puzzle_canvas').removeEventListener("mouseup", this.mouseHandlerUp);
    document.getElementById('puzzle_canvas').removeEventListener("mousemove", this.mouseHandlerMove);

    this.mouseHandlerMove = null;
    this.mouseHandlerUp = null;
  };

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