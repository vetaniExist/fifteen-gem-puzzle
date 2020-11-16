import wav from "../assets/sounds/tink.wav";
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
  popupDiv,
} from "./configurateLayout";

import {
  PriorityQueue,
} from "./PriorityQueue";

import {
  Timer,
} from "./timer";

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
    this.audio = {
      sounds: [],
      volume: 0.1,
      isAviable: true,
    };

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
    this.cTimer = new Timer();
    this.gameWin = false;

    this.initAudio();
  }

  setSize(newSize) {
    this.size = newSize;
  }

  getSize() {
    return this.size;
  }

  initAudio() {
    const audioSwipe =  document.createElement("audio");
    audioSwipe.src = wav;
   
    this.audio.sounds.swipe = audioSwipe;
    this.audio.volume = this.audio.volume ? this.audio.volume : 0.2;
  }

  playAudio() {
    // this.audio.sounds.swipe.currentTime = 0;
    if (this.audio.isAviable) {
      this.audio.sounds.swipe.volume = this.audio.volume;
      this.audio.sounds.swipe.play();
    }
  }

  audioVolumeUp() {
    if (this.audio.volume < 1) {
      this.audio.volume += 0.1;
      if (this.audio.volume > 1) {
        this.audio.volume = 1;
      }
    }
    this.audio.isAviable = true;
    return this.audio.volume > 0;
  }

  audioVolumeDown() {
    if (this.audio.volume > 0) {
      this.audio.volume -= 0.1;
      if (this.audio.volume < 0) {
        this.audio.volume = 0;
      }
    }
    if (this.audio.volume) {
      this.audio.isAviable = true;
    } else {
      this.audio.isAviable = false;
    }
    return this.audio.volume > 0;
  }

  audioOnOf() {
    this.audio.isAviable = !this.audio.isAviable;
    return this.audio.isAviable;
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
    this.getReplacedCanvas();
    this.canvasObj = new MyCanvas(this.canvas);
    this.canvasRect = null;
    this.stepCounter = 0;
    this.today = null;
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
    this.timer = null;
    this.cTimer.restart();
    this.cTimer = new Timer();
  }

  start() {
    if (this.canvasRect !== null) {
      this.restart();
    }

    this.configurateStartField();
    this.stepCounter = 0;
    this.canvasObj.initBasicField(this.startArray, this.size, this.winCondition);
    this.cTimer.startTimer();
    this.startGame();
  }

  startGame() {
    this.getCanvasRect();
    this.today = new Date();
    this.updateTime();

    this.canvasObj.canvas.addEventListener("mousedown", (event) => {
      // запомнили координаты при нажатии, установили mouseMove в эту же позицию
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
          this.mouse.isClickAviable = false;
          setTimeout(() => {
            this.mouse.isClickAviable = true;
          }, 480 / this.size);
          this.playAudio();
          // this.audio.swipe.play();
          this.stepCounter += 1;
          this.updateTime();
          setTimeout(() => {
            if (this.canvasObj.checkWinCondition()) {
              this.cTimer.stop();
              this.canvasObj.addWinText(this.stepCounter, this.checkTime());
              this.onMouseUp();
              this.gameWin = true;
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
      this.currCell.x = this.mouse.x * this.canvasObj.getCanvasInnerWidthHeightCoef();
      this.currCell.y = this.mouse.y * this.canvasObj.getCanvasInnerWidthHeightCoef();
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
        /* console.log("Math.abs(this.mouse.moveX - this.mouse.x)");
        console.log(Math.abs(this.mouse.moveX - this.mouse.x));

        console.log("Math.abs(this.mouse.moveY - this.mouse.y)");
        console.log(Math.abs(this.mouse.moveY - this.mouse.y)); */

        this.currCell.x = this.mouse.moveX * this.canvasObj.getCanvasInnerWidthHeightCoef();
        this.currCell.y = this.mouse.moveY * this.canvasObj.getCanvasInnerWidthHeightCoef();
        this.canvasObj.redrawCanvas(this.currCell);
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

        this.currCell.x = (((thisWasCell % this.size) * 480) / this.size) * this.canvasObj.getCanvasInnerWidthHeightCoef();
        this.currCell.y = ((Math.floor(thisWasCell / this.size) * 480) / this.size) * this.canvasObj.getCanvasInnerWidthHeightCoef();
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

  updateTime() {
    const timeElInner = getTimeInnerText().slice(0, 7);
    const stepString = " steps: " + this.stepCounter;
    updateTimeEl(timeElInner.concat(stepString));
  }

  checkTime() {
    const itTookMinutes = this.cTimer.getMinutes();
    const itTookSec = this.cTimer.getSeconds();
    return "it took: minutes: ".concat(formatTime(itTookMinutes)).concat(" seconds: ").concat(formatTime(itTookSec));
  }

  saveGame() {
    const canvasObjField = this.canvasObj.getRectObjects();
    const gamePuzzleCurrentGame = {
      canvasField: canvasObjField,
      winCondition: this.winCondition,
      step: this.stepCounter,
      size: this.size,
      startArray: this.startArray,
    };
    // canvasObjField.push(time);
    localStorage.setItem("vetaniExistGamePuzzleCurrentGame", JSON.stringify(gamePuzzleCurrentGame));
  }

  loadGame() {
    const gamePuzzleCurrentGame = JSON.parse(localStorage.getItem("vetaniExistGamePuzzleCurrentGame"));
    if (gamePuzzleCurrentGame !== "null") {
      this.canvasObj.setRectObjects(gamePuzzleCurrentGame.canvasField);
      this.winCondition = gamePuzzleCurrentGame.winCondition;
      this.size = gamePuzzleCurrentGame.size;
      this.stepCounter = gamePuzzleCurrentGame.step;

      // this.initAudio();
      this.canvasObj.initBasicField(gamePuzzleCurrentGame.startArray, this.size, this.winCondition, true);
      this.startGame();
    }
  }

  autoSolvation() {

    setTimeout(() => {
      document.body.appendChild(popupDiv);
    }, 0);

    setTimeout(() => {
      this.gameWin = true;
      const originalField = (this.canvasObj.getRectObjects()).slice();

      const emptyCellNum = GamePuzzle.getEmptyCellIndex(originalField);
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
      };

      priorityQueue.enqueue(startNode, startNode.g + startNode.h);
      visited.push(startNode.field);

      let iter = 0;
      let currentMinState = { ...startNode };

      while (priorityQueue.length() !== 0) {
        if (iter >= 50000) {
          break;
        }
        iter += 1;

        const priorityQueueItem = priorityQueue.dequeue();
        const currentNode = priorityQueueItem.element;

        // Проверяем детей слева
        if (currentNode.leftCell !== null) {
          const leftChild = this.getNode(currentNode, -1);
          if (!GamePuzzle.checkInVisitedArray(visited, leftChild.field)) {
            priorityQueue.enqueue(leftChild, leftChild.h);
            visited.push(leftChild.field);
            if (leftChild.h < currentMinState.h) {
              currentMinState = { ...leftChild };
            }
            if (currentMinState.h === 0) {
              break;
            }
          }
        }

        // Проверим детей справа
        if (currentNode.rightCell !== null) {
          const rightChild = this.getNode(currentNode, 1);

          if (!GamePuzzle.checkInVisitedArray(visited, rightChild.field)) {
            priorityQueue.enqueue(rightChild, rightChild.h);
            visited.push(rightChild.field);
            if (rightChild.h < currentMinState.h) {
              currentMinState = { ...rightChild };
            }
            if (currentMinState.h === 0) {
              break;
            }
          }
        }

        // Проверим детей сверху
        if (currentNode.topCell !== null) {
          const topChild = this.getNode(currentNode, -this.size);

          if (!GamePuzzle.checkInVisitedArray(visited, topChild.field)) {
            priorityQueue.enqueue(topChild, topChild.h);
            visited.push(topChild.field);
          }
          if (topChild.h < currentMinState.h) {
            currentMinState = { ...topChild };
          }
          if (currentMinState.h === 0) {
            break;
          }
        }

        // Проверим детей снизу
        if (currentNode.bottomCell !== null) {
          const bottomChild = this.getNode(currentNode, this.size);

          if (!GamePuzzle.checkInVisitedArray(visited, bottomChild.field)) {
            priorityQueue.enqueue(bottomChild, bottomChild.h);
            visited.push(bottomChild.field);
          }
          if (bottomChild.h < currentMinState.h) {
            currentMinState = { ...bottomChild };
          }
          if (currentMinState.h === 0) {
            break;
          }
        }
      }

      this.getSolvePath(currentMinState);
    }, 25);

  }

  static checkInVisitedArray(visited, field) {
    for (let i = 0; i < visited.length; i += 1) {
      for (let j = 0; j < visited[i].length; j += 1) {
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

  static updateField(field, step) {
    const fieldCopy = field.slice();
    const emptyCellNum = GamePuzzle.getEmptyCellIndex(fieldCopy);

    fieldCopy[emptyCellNum + step] = fieldCopy[emptyCellNum];
    fieldCopy[emptyCellNum] = field[emptyCellNum + step];

    return fieldCopy;
  }

  getNode(prev, step) {
    const newField = GamePuzzle.updateField(prev.field.slice(), step);
    const emptyCellNum = GamePuzzle.getEmptyCellIndex(newField);

    return {
      field: newField,
      leftCell: this.getLeftNeighbor(emptyCellNum),
      rightCell: this.getRightNeigbor(emptyCellNum),
      topCell: this.getTopNeighbor(emptyCellNum),
      bottomCell: this.getBottomNeigbor(emptyCellNum),
      prev,
      h: this.calculateH(newField),
      g: this.getDistanse(prev),
    };
  }

  static getEmptyCellIndex(field) {
    let result = null;
    try {
      field.forEach((element, index) => {
        if (element.text === "") {
          result = index;
          throw result;
        }
      });
    } catch (e) {
      return e;
    }
    return result;//
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
    // hidePopup();
    const cellSize = this.canvasObj.canvas.width / this.size;
    let steps = [];
    let curNode = node;
    while (curNode.prev !== null) {
      const prevField = curNode.prev.field;
      const curField = curNode.field;
      steps.unshift(GamePuzzle.getDifference(curField, prevField));
      curNode = curNode.prev;
    }

    for (let i = 0; i < steps.length; i += 1) {
      setTimeout(() => {
        if (this.gameWin) {
          if (i === 0) {
            document.body.removeChild(popupDiv);
          }
          const cellNum = this.canvasObj.getRectObjNumByValue(steps[i]);
          this.canvasObj.trySwap(cellNum);
          this.playAudio();
          this.stepCounter += 1;
          this.updateTime();
          console.log(cellSize);
        } else {
          steps = [];
          return;
        }
      }, i * cellSize + 300 * i);
    }
  }

  static getDifference(curField, prevField) {
    for (let i = 0; i < curField.length; i += 1) {
      if (curField[i].text !== prevField[i].text) {
        if (prevField[i].text === "") {
          return curField[i].text;
        }
        return prevField[i].text;
      }
    }
    return null;
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
    this.canvasObj.setImage();
  }
}

export default GamePuzzle;
