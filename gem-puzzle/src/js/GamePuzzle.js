import {
  MyCanvas,
} from "./canvas";

import {
  getRandomInt,
  formatTime,
  getRandomImage,
} from "./utils";

import {
  updateTimeEl,
  getTimeInnerText,
} from "./configurateLayout";

import {
  PriorityQueue,
} from "./PriorityQueue";


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
      moveY: 0,
      currCell: null,
      isClickAviable: true,
    };
    this.mouseHandlerUp = null;
    this.mouseHandlerMove = null;
    this.mouseHandlerLeave = null;
    this.timer = null;
    this.gameWin = false;
  }

  setSize(newSize) {
    this.size = newSize;
  }

  getSize() {
    return this.size;
  }

  initAudio() {
    const audioSwipe = document.createElement("audio");
    audioSwipe.setAttribute("src", "/src/assets/sounds/tink.wav");
    this.audio.swipe = audioSwipe;
  }

  configurateStartField() {
    const fieldOfCellValues = [];
    this.startArray = [];
    for (let i = 1; i < this.size * this.size; i += 1) {
      fieldOfCellValues.push(i);
    }
    this.winCondition = fieldOfCellValues.slice();

    for (let i = 0; i < this.size * this.size - 1; i += 1) {
      const randCeil = getRandomInt(fieldOfCellValues.length);
      this.startArray.push(fieldOfCellValues[randCeil]);
      fieldOfCellValues.splice(randCeil, 1);
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
    const isOddSize = this.size % 2;
    if (isOddSize) {
      return !(inversesCounter % 2 === 0);
    }
    return inversesCounter % 2 === 0;
  }

  getReplacedCanvas() {
    const el = document.getElementById("puzzle_canvas");
    const elClone = el.cloneNode(true);
    el.parentNode.replaceChild(elClone, el);
    this.canvas = elClone;
    // return elClone;
  }

  restart() {
    this.startArray = [];
    // this.canvas = this.getReplacedCanvas();
    this.getReplacedCanvas();
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
      moveY: 0,
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
    // console.log("start with this nums:");
    // console.log(this.startArray);

    // console.log("start with this winCondition:");
    // console.log(this.winCondition);
    this.stepCounter = 0;
    this.canvasObj.initBasicField(this.startArray, this.size, this.winCondition);
    this.startGame();
  }

  startGame() {
    this.getCanvasRect();
    this.today = new Date();
    this.startTimer();

    this.canvasObj.canvas.addEventListener("mousedown", (event) => {
      // запомнили координаты при нажатии, установили mouseMove в эту же позицию
      console.log("this.mouse");
      console.log(this.mouse);
      this.mouse.x = event.clientX - this.canvasRect.left;
      this.mouse.y = event.clientY - this.canvasRect.top;

      this.mouse.moveX = this.mouse.x;
      this.mouse.moveY = this.mouse.y;

      this.currCell = this.canvasObj.getRectObj(this.getBucketY(this.mouse.y)
        + this.getBucketValue(this.mouse.x));

      this.mouse.isDown = true;

      this.mouseHandlerUp = this.onMouseUp.bind(this);
      this.mouseHandlerMove = this.onMouseMove.bind(this);
      this.mouseHandlerLeave = this.onMouseLeave.bind(this);

      document.getElementById("puzzle_canvas").addEventListener("mouseup", this.mouseHandlerUp);
      document.getElementById("puzzle_canvas").addEventListener("mousemove", this.mouseHandlerMove);
      document.getElementById("puzzle_canvas").addEventListener("mouseleave", this.mouseHandlerLeave);
    });

    this.canvasObj.canvas.addEventListener("click", () => {
      if (this.mouse.isClickAviable && !this.gameWin) {
        const currentBlockClick = this.getBucketY(this.mouse.y)
          + this.getBucketValue(this.mouse.x);
        if (this.canvasObj.trySwap(currentBlockClick)) {
          console.log("клик рабоатет");
          this.mouse.isClickAviable = false;
          setTimeout(() => {
            this.mouse.isClickAviable = true;
          }, 480 / this.size);
          this.audio.swipe.play();
          this.stepCounter += 1;
          this.updateTime();
          console.log("Step is correct. Count of steps = ".concat(this.stepCounter));
          setTimeout(() => {
            if (this.canvasObj.checkWinCondition()) {
              this.canvasObj.addWinText(this.stepCounter, this.checkTime());
              this.onMouseUp();
              this.gameWin = true;
              // this.restart();
            } else {
              this.saveGame();
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

  onMouseLeave() {
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

      if (Math.abs(this.mouse.moveX - this.mouse.x) > 25
        || Math.abs(this.mouse.moveY - this.mouse.y) > 25) {
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

  onMouseUp() {
    if (!this.gameWin) {
      this.mouse.isDown = false;

      const thisWasCell = this.getBucketY(this.mouse.y)
        + this.getBucketValue(this.mouse.x);
      const cellWeleftOff = this.getBucketY(this.mouse.moveY)
        + this.getBucketValue(this.mouse.moveX);

      if (this.mouse.moveX !== this.mouse.x || this.mouse.moveY !== this.mouse.y) {
        const leftCondition = this.canvasObj.checkLeft(thisWasCell) && thisWasCell - cellWeleftOff === 1;
        const topCondition = this.canvasObj.checkTop(thisWasCell) && thisWasCell - cellWeleftOff === this.size;
        const rightCondition = this.canvasObj.checkRight(thisWasCell) && thisWasCell - cellWeleftOff === -1;
        const bottomCondition = this.canvasObj.checkBottom(thisWasCell) && thisWasCell - cellWeleftOff === -this.size;
        const fullCondition = leftCondition || topCondition || rightCondition || bottomCondition;

        this.currCell.x = ((thisWasCell % this.size) * 480) / this.size;
        this.currCell.y = (Math.floor(thisWasCell / this.size) * 480) / this.size;
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
            } else {
              this.saveGame();
            }
          }, 480 / this.size);
        }
        this.canvasObj.redrawCanvas();
      }
      document.getElementById("puzzle_canvas").removeEventListener("mouseup", this.mouseHandlerUp);
      document.getElementById("puzzle_canvas").removeEventListener("mousemove", this.mouseHandlerMove);
      document.getElementById("puzzle_canvas").removeEventListener("mouseleave", this.mouseHandlerLeave);

      this.mouseHandlerMove = null;
      this.mouseHandlerUp = null;
    }
  }

  updateTime(minutes, sec) {
    if (minutes === undefined || sec === undefined) {
      const timeElInner = getTimeInnerText();
      updateTimeEl(timeElInner.slice(0, timeElInner.length - this.stepCounter.toString(10).length).concat(this.stepCounter));
    } else {
      updateTimeEl(formatTime(minutes).concat(" : ").concat(formatTime(sec)).concat(" step: ")
        .concat(this.stepCounter));
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
    const itTookSec = itTookMinutes ? newDate.getSeconds() - this.today.getSeconds() : newDate.getSeconds();

    return "it took: minutes: ".concat(formatTime(itTookMinutes)).concat(" seconds: ").concat(formatTime(itTookSec));
  }

  saveGame() {
    console.log("saveGame func");
    const canvasObjField = this.canvasObj.getRectObjects();
    const gamePuzzleCurrentGame = {
      canvasField: canvasObjField,
      winCondition: this.winCondition,
      step: this.stepCounter,
      size: this.size,
      startArray: this.startArray,
    }
    // canvasObjField.push(timeStep);
    localStorage.setItem("vetaniExistGamePuzzleCurrentGame", JSON.stringify(gamePuzzleCurrentGame));
    console.log(localStorage.getItem("vetaniExistGamePuzzleCurrentGame"));
  }

  loadGame() {
    const gamePuzzleCurrentGame = JSON.parse(localStorage.getItem("vetaniExistGamePuzzleCurrentGame"));
    if (gamePuzzleCurrentGame === "null") {
      return false;
    }
    this.canvasObj.setRectObjects(gamePuzzleCurrentGame.canvasField);
    this.winCondition = gamePuzzleCurrentGame.winCondition;
    this.size = gamePuzzleCurrentGame.size;
    this.stepCounter = gamePuzzleCurrentGame.step;
    const startArray = gamePuzzleCurrentGame.startArray;

    console.log("проверка");
    console.log(this.canvasObj.getRectObjects());
    console.log(gamePuzzleCurrentGame.canvasField);
    this.initAudio();
    this.canvasObj.initBasicField(startArray, this.size, this.winCondition, true);
    this.startGame();
  }

  ///////////////////////////
  autoSolvation() {
    const originalField = (this.canvasObj.getRectObjects()).slice();

    const emptyCellNum = this.getEmptyCellIndex(originalField);
    const priorityQueue = new PriorityQueue();
    const visited = [];

    const startNode = {
      field: originalField,
      leftCell: this.getLeftNeighbor(emptyCellNum),
      rightCell: this.getRightNeigbor(emptyCellNum),
      topCell: this.getTopNeighbor(emptyCellNum),
      bottomCell: this.getBottomNeigbor(emptyCellNum),
      prev: null,
      h: this.calculateH(originalField),
      g: 0,
    }

    priorityQueue.enqueue(startNode, startNode.g + startNode.h);
    visited.push(startNode.field);

    let iter = 0;
    let currentMinState = {...startNode};

    while(priorityQueue.length() !== 0) {
      if (iter >= 50000) {
        break;
      }
      iter++

      const priorityQueueItem = priorityQueue.dequeue();
      const currentNode = priorityQueueItem.element;

      // Проверяем детей слева
      if (currentNode.leftCell !== null) {
        const leftChild = this.getNode(currentNode, -1);
        if (!this.checkInVisitedArray(visited, leftChild.field)) {
          priorityQueue.enqueue(leftChild,  leftChild.h);
          visited.push(leftChild.field);
          if (leftChild.h < currentMinState.h) {
            currentMinState = {...leftChild};
          } 
          if(currentMinState.h === 0) {
            break;
          }
        }
      }

      // Проверим детей справа
      if (currentNode.rightCell !== null) {
        const rightChild = this.getNode(currentNode, 1);

        if (!this.checkInVisitedArray(visited, rightChild.field)) {
          priorityQueue.enqueue(rightChild, rightChild.h);
          visited.push(rightChild.field);
          if (rightChild.h < currentMinState.h) {
            currentMinState = {...rightChild};
          }
          if(currentMinState.h === 0) {
            break;
          }
        }
      }

      // Проверим детей сверху
      if (currentNode.topCell !== null) {
        const topChild = this.getNode(currentNode, -this.size);

        if (!this.checkInVisitedArray(visited, topChild.field)) {
          priorityQueue.enqueue(topChild, topChild.h);
          visited.push(topChild.field);
        }
        if (topChild.h < currentMinState.h) {
          currentMinState = {...topChild};
        }
        if(currentMinState.h === 0) {
          break;
        }
      }

      // Проверим детей снизу
      if (currentNode.bottomCell !== null) {
        const bottomChild = this.getNode(currentNode, this.size);

        if (!this.checkInVisitedArray(visited, bottomChild.field)) {
          priorityQueue.enqueue(bottomChild, bottomChild.h);
          visited.push(bottomChild.field);
        }
        if (bottomChild.h < currentMinState.h) {
          currentMinState ={...bottomChild};
        }
        if(currentMinState.h === 0) {
          break;
        }
      }
    }

    console.log("iter = " + iter);


    console.log("currentMinState");

    console.log(currentMinState);
    this.getSolvePath(currentMinState);
  }

  checkInVisitedArray(visited, field){
    //console.log(visited);
    for (let i = 0; i < visited.length; i += 1) {

      for(let j = 0; j < visited[i].length; j += 1) {
        if (visited[i][j] !== field[j]) {
          break;
        }
        if (j === visited[i].length - 1) {
          return true;
        }
      }
     
    }
    return false;
  }

  updateField(field, step) {
    const fieldCopy = field.slice();
    const emptyCellNum = this.getEmptyCellIndex(fieldCopy);

    fieldCopy[emptyCellNum + step] = fieldCopy[emptyCellNum];
    fieldCopy[emptyCellNum] = field[emptyCellNum + step];

    return fieldCopy;
  }

  getNode(prev, step) {
    const _field = this.updateField(prev.field.slice(), step);
    const emptyCellNum = this.getEmptyCellIndex(_field);

    return {
      field: _field,
      leftCell: this.getLeftNeighbor(emptyCellNum),
      rightCell: this.getRightNeigbor(emptyCellNum),
      topCell: this.getTopNeighbor(emptyCellNum),
      bottomCell: this.getBottomNeigbor(emptyCellNum),
      prev: prev,
      h: this.calculateH(_field),
      g: this.getDistanse(prev),
    }
  }

  getEmptyCellIndex(field) {
    let result = null;
    try {
      field.forEach((element, index) => {
        if (element.text === "") {
          result = index;
          throw result
        }
      });
    } catch (e) {
      return e;
    }
  }

  getLeftNeighbor(emptyCellNum) {
    for (let i = 0; i <= this.size; i += 1) {
      if (emptyCellNum === i * this.size) {
        return null;
      }
    }
    return emptyCellNum - 1;
  }

  getRightNeigbor(emptyCellNum) {
    for (let i = 1; i <= this.size; i += 1) {
      if (emptyCellNum === i * this.size - 1) {
        return null;
      }
    }
    return emptyCellNum + 1;
  }

  getTopNeighbor(emptyCellNum) {
    if (emptyCellNum <= this.size) {
      return null;
    }
    return emptyCellNum - this.size;
  }

  getBottomNeigbor(emptyCellNum) {
    if (emptyCellNum >= this.size * this.size - this.size) {
      return null;
    }

    return emptyCellNum + this.size;
  }

  calculateH(field) {
    let counterOfInconsistency = 0;
    for (let i = 0; i < this.size * this.size - 1; i += 1) {
      const cellText = parseInt(field[i].text, 10);
      if (cellText !== i + 1) {
        counterOfInconsistency += 1;
      }
    }
    const cellText = field[this.size * this.size - 1].text;
    if (cellText !== "") {
      counterOfInconsistency += 1;
    }
    return counterOfInconsistency;
  }
  

  getDistanse(ansestor) {
    if (ansestor.prev !== null) {
      return this.getDistanse(ansestor.prev) + 1;
    }
    return 1;
  }

  getSolvePath(node) {
    const cellSize = 480 / this.size;
    const steps = [];
    while (node.prev !== null) {
      const prevField = node.prev.field;
      steps.unshift(this.getDifference(node.field, prevField));
      node = node.prev;
    }
 
    for (let i = 0; i < steps.length; i += 1) {
      setTimeout(() => {
        const cellNum = this.canvasObj.getRectObjNumByValue(steps[i]);
        this.canvasObj.trySwap(cellNum);
      }, i * cellSize + 300 * i);
    }
  }

  getDifference(curField, prevField) {
    console.log("getDifference");
    for (let i = 0; i < curField.length; i += 1) {

      if (curField[i].text !== prevField[i].text) {
        if (prevField[i].text === "") {
          return curField[i].text;
        } else {
          return prevField[i].text;
        }
      }
    }
  }

  getBucketValue(x) {
    const cellWidth = 480 / this.size;
    if (x < cellWidth) {
      return 0;
    }
    for (let i = cellWidth; i < 480; i += cellWidth) {
      if (x >= i && x < i + cellWidth) {
        return i / cellWidth;
      }
    }

    throw new Error("something goes wrong in GamePuzzle getBuchetY func");
  }

  getBucketY(y) {
    const row = this.getBucketValue(y, this.size);
    return row * this.size;
  }

  addImageOnBoard() {
    console.log("testFunc");  
    this.canvasObj.setImage();

  }
}

export default GamePuzzle;
