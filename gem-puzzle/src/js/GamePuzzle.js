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
    this.winCondition = [];
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
      currCell: null,
      isClickAviable: true,
    };
    this.mouseHandlerUp = null;
    this.mouseHandlerMove = null;
  }

  setSize(newSize){
    this.size = newSize;
  }

  getSize() {
    return this.size;
  }

  initAudio(){
    let audio_swipe = document.createElement("audio");
    audio_swipe.setAttribute("src", "/src/assets/sounds/tink.wav");
    this.audio["swipe"] = audio_swipe;
  }

  configurateStartField() {
    let fieldOfCellValues = [];
    this.startArray = [];
    for (let i = 1; i < this.size * this.size; i += 1) {
      fieldOfCellValues.push(i);
    }
    this.winCondition = fieldOfCellValues.slice();
    
    for(let i = 0; i < this.size * this.size - 1; i += 1) {
      let randCeil = getRandomInt(fieldOfCellValues.length);
      this.startArray.push(fieldOfCellValues[randCeil]);
      fieldOfCellValues.splice(randCeil,1)
    }
    if (this.isSolved(this.startArray)) {
      this.startArray.push("");
      this.winCondition.push("");
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
    inversesCounter += this.size;
    let isOddSize = this.size % 2;
    if (isOddSize) {
      return inversesCounter % 2 === 0 ? false : true;
    }
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
    // this.size = 4;
    this.audio = [];
    this.mouse = {
      x: 0,
      y: 0,
      isDown: false,
      moveX: 0,
      moveY:0,
      currCell: null,
      isClickAviable: true,
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
    console.log("start with this nums:");
    console.log(this.startArray);

    console.log("start with this winCondition:");
    console.log(this.winCondition);

    this.canvasObj.initBasicField(this.startArray, this.size, this.winCondition);
    this.getCanvasRect();
    this.today = new Date();
    this.stepCounter = 0;
    this.startTimer();

    this.canvasObj.canvas.addEventListener("mousedown", (event) =>{
      // запомнили координаты при нажатии, установили mouseMove в эту же позицию
      console.log("this.mouse");
      console.log(this.mouse);
      this.mouse.x = event.clientX - this.canvasRect.left;
      this.mouse.y = event.clientY - this.canvasRect.top;

      this.mouse.moveX = this.mouse.x;
      this.mouse.moveY = this.mouse.y;

      this.currCell = this.canvasObj.getRectObj(GamePuzzle.getBucketY(this.mouse.y, this.size) + GamePuzzle.getBucketValue(this.mouse.x, this.size));

      this.mouse.isDown = true;
      
      this.mouseHandlerUp =  this.onMouseUp.bind(this);
      this.mouseHandlerMove = this.onMouseMove.bind(this);

      document.getElementById('puzzle_canvas').addEventListener("mouseup", this.mouseHandlerUp);
      document.getElementById('puzzle_canvas').addEventListener("mousemove", this.mouseHandlerMove);
    });

    this.canvasObj.canvas.addEventListener("click", (event) => {
      if (this.mouse.isClickAviable) {
        const currentBlockClick = GamePuzzle.getBucketY(this.mouse.y, this.size) + GamePuzzle.getBucketValue(this.mouse.x, this.size);
        if (this.canvasObj.trySwap(currentBlockClick)) {
          this.audio["swipe"].play();
          this.stepCounter += 1;
          this.updateTime()
          console.log("Step is correct. Count of steps = " + this.stepCounter);
          if(this.canvasObj.checkWinCondition()) {
            this.canvasObj.addWinText(this.stepCounter, this.checkTime());
          } 
        }
      } else {
        this.mouse.isClickAviable = true;
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

      this.mouse.moveX = event.clientX - rect.left;
      this.mouse.moveY = event.clientY - rect.top;

      if (Math.abs(this.mouse.moveX - this.mouse.x) > 25 || Math.abs(this.mouse.moveY - this.mouse.y) > 25) {
        this.mouse.isClickAviable = false;
        console.log("Math.abs(this.mouse.moveX - this.mouse.x)");
        console.log(Math.abs(this.mouse.moveX - this.mouse.x));

        console.log("Math.abs(this.mouse.moveY - this.mouse.y)");
        console.log(Math.abs(this.mouse.moveY - this.mouse.y));

        this.currCell.x = this.mouse.moveX;
        this.currCell.y = this.mouse.moveY;
  
        console.log("find cell");
        console.log(this.currCell);
        this.canvasObj.redrawCanvas(this.currCell);
  
        console.log("move");
      }
    }
  }

  onMouseUp(event = null){
    this.mouse.isDown = false;

    const thisWasCell   = GamePuzzle.getBucketY(this.mouse.y, this.size) + GamePuzzle.getBucketValue(this.mouse.x, this.size);
    const cellWeleftOff = GamePuzzle.getBucketY(this.mouse.moveY, this.size) + GamePuzzle.getBucketValue(this.mouse.moveX, this.size);

    if (this.mouse.moveX !== this.mouse.x || this.mouse.moveY !== this.mouse.y) {
      const leftCondition   = this.canvasObj.checkLeft(thisWasCell) && thisWasCell - cellWeleftOff   === 1;
      const topCondition    = this.canvasObj.checkTop(thisWasCell) && thisWasCell - cellWeleftOff    === this.size;
      const rightCondition  = this.canvasObj.checkRight(thisWasCell) && thisWasCell - cellWeleftOff  === -1;
      const bottomCondition = this.canvasObj.checkBottom(thisWasCell) && thisWasCell - cellWeleftOff === -this.size;
  
      console.log("leftCondition " + leftCondition);
      console.log("topCondition " + topCondition);
      console.log("rightCondition " + rightCondition);
      console.log("bottomCondition " + bottomCondition);
  
      if (leftCondition) {
        this.canvasObj.swapObject(thisWasCell, -1);
      } else if (topCondition) {
        this.canvasObj.swapObject(thisWasCell,-this.size);
      } else if (rightCondition) {
        this.canvasObj.swapObject(thisWasCell, 1);
      } else if (bottomCondition) {
        this.canvasObj.swapObject(thisWasCell, this.size);
      }
  
      this.currCell.x = (thisWasCell % this.size) * 480 / this.size;
      this.currCell.y = Math.floor(thisWasCell / this.size) * 480 / this.size;
      this.canvasObj.redrawCanvas();
    }
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

  

  static getBucketValue(x , size) {
    const cellWidth = 480 / size; 
    if (x < cellWidth) {
      return 0;
    }
    for (let i = cellWidth; i < 480 ; i += cellWidth) {
      if ( x >= i && x < i + cellWidth) {
        return i / cellWidth;
      }
    }
    /*if (x < 120) {
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
    } */
    throw new Error("something goes wrong in GamePuzzle getBuchetY func");
  }

  static getBucketY(y, size) {
    const row = GamePuzzle.getBucketValue(y, size);
    return row * size;
    /* switch (GamePuzzle.getBucketValue(y, size)) {
      case 0: {
        return 0;
      }
      case 1: {
        console.log("getBucketY" + size);
        return size;
      }
      case 2: {
        console.log("getBucketY" + size * 2);
        return size * 2;
      }
      case 3: {
        console.log("getBucketY" + size * 3);
        return size * 3;
      }
      default: {
        throw new Error("something goes wrong in GamePuzzle getBuchetY func");
      }
    }*/
  }
  
}

export default GamePuzzle;