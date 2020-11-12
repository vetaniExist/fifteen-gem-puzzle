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
    this.mouseHandlerLeave = null;
    this.timer = null;
    this.gameWin = false;
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
    let inversesCounter = 0;
    for (let i = 1; i < this.size * this.size - 1; i += 1) {
      for (let j = 0; j < i; j += 1) {
        if (field[i] < field[j]) {
          inversesCounter += 1;
        }
      }
     
    }

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
    this.mouseHandlerLeave = null;
    this.gameWin = false;
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
      this.mouseHandlerLeave = this.onMouseLeave.bind(this);

      document.getElementById('puzzle_canvas').addEventListener("mouseup", this.mouseHandlerUp);
      document.getElementById('puzzle_canvas').addEventListener("mousemove", this.mouseHandlerMove);
      document.getElementById('puzzle_canvas').addEventListener("mouseleave", this.mouseHandlerLeave);
    });

    this.canvasObj.canvas.addEventListener("click", (event) => {
      if (this.mouse.isClickAviable && !this.gameWin) {
        const currentBlockClick = GamePuzzle.getBucketY(this.mouse.y, this.size) + GamePuzzle.getBucketValue(this.mouse.x, this.size);
        if (this.canvasObj.trySwap(currentBlockClick)) {
          this.mouse.isClickAviable = false;
          setTimeout(() => {
            this.mouse.isClickAviable = true;
          }, 480 / this.size);
          this.audio["swipe"].play();
          this.stepCounter += 1;
          this.updateTime();
          console.log("Step is correct. Count of steps = " + this.stepCounter);
          setTimeout(() => {
            if (this.canvasObj.checkWinCondition()) {
              this.canvasObj.addWinText(this.stepCounter, this.checkTime());
              this.onMouseUp();
              this.gameWin = true;
              // this.restart();
            } 
          }, 480 / this.size);
        }
      } else {
        this.mouse.isClickAviable = true;
      }
    });
  }

  getCanvasRect() {
    this.canvasRect = this.canvasObj.canvas.getBoundingClientRect();
  }

  onMouseLeave(event) {
    if (this.mouse.isDown && !this.gameWin) {
      this.currCell.x = this.mouse.x;
      this.currCell.y = this.mouse.y;
      console.log("Покинули пределы канваса");
      this.canvasObj.redrawCanvas(this.currCell);
    }
  }

  onMouseMove(event) {
    if (this.mouse.isDown && !this.gameWin) {
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
    if (!this.gameWin) {
      this.mouse.isDown = false;

      const thisWasCell   = GamePuzzle.getBucketY(this.mouse.y, this.size) + GamePuzzle.getBucketValue(this.mouse.x, this.size);
      const cellWeleftOff = GamePuzzle.getBucketY(this.mouse.moveY, this.size) + GamePuzzle.getBucketValue(this.mouse.moveX, this.size);
  
      if (this.mouse.moveX !== this.mouse.x || this.mouse.moveY !== this.mouse.y) {
        const leftCondition   = this.canvasObj.checkLeft(thisWasCell) && thisWasCell - cellWeleftOff   === 1;
        const topCondition    = this.canvasObj.checkTop(thisWasCell) && thisWasCell - cellWeleftOff    === this.size;
        const rightCondition  = this.canvasObj.checkRight(thisWasCell) && thisWasCell - cellWeleftOff  === -1;
        const bottomCondition = this.canvasObj.checkBottom(thisWasCell) && thisWasCell - cellWeleftOff === -this.size;
        const fullCondition = leftCondition || topCondition || rightCondition || bottomCondition;
    
        console.log("leftCondition " + leftCondition);
        console.log("topCondition " + topCondition);
        console.log("rightCondition " + rightCondition);
        console.log("bottomCondition " + bottomCondition);
  
        this.currCell.x = (thisWasCell % this.size) * 480 / this.size;
        this.currCell.y = Math.floor(thisWasCell / this.size) * 480 / this.size;
        if (fullCondition && !this.gameWin) {
          this.canvasObj.trySwap(thisWasCell);
          this.stepCounter += 1;
          this.updateTime();
          setTimeout(() => {
            if (this.canvasObj.checkWinCondition()) {
              this.canvasObj.addWinText(this.stepCounter, this.checkTime());
              this.onMouseUp();
              this.gameWin = true;
              // this.restart();
            } 
          }, 480 / this.size);
          
        }
        this.canvasObj.redrawCanvas();
      }
      document.getElementById('puzzle_canvas').removeEventListener("mouseup", this.mouseHandlerUp);
      document.getElementById('puzzle_canvas').removeEventListener("mousemove", this.mouseHandlerMove);
      document.getElementById('puzzle_canvas').removeEventListener("mouseleave", this.mouseHandlerLeave);
  
      this.mouseHandlerMove = null;
      this.mouseHandlerUp = null;
    }
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
    this.timer = this.startTimer.bind(this);
    if (!this.gameWin) {
      setTimeout(this.timer, 1000);
    }
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

    throw new Error("something goes wrong in GamePuzzle getBuchetY func");
  }

  static getBucketY(y, size) {
    const row = GamePuzzle.getBucketValue(y, size);
    return row * size;
  }
  
}

export default GamePuzzle;