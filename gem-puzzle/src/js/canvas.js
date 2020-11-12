export class MyCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.styles = ["greenyellow", "yellow", "red", "purple"];
    this.textDraw = [];
    this.winConditionArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ""];
    this.rectObjects = [];
    this.size = null;
  }

  static getRandomInt(newMax) {
    return Math.floor(Math.random() * Math.floor(newMax));
  }

  initBasicField(valueArray, size, winCondition) {
    this.rectObjects = [];
    this.size = size;
    this.winConditionArray = winCondition;
    this.textDraw = valueArray;
    // console.log(this.textDraw);
    this.canvas.height = 480;
    this.canvas.width = 480;
    const context = this.canvas.getContext("2d");
    context.font = "22px Verdana";

    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        console.log(valueArray[i * size + j]);
        let rectObj = {
          num: i + j * this.size,
          x: i * 480 / this.size,
          y: j * 480 / this.size,
          w: 480 / this.size,
          h: 480 / this.size,
          color: this.styles[MyCanvas.getRandomInt(4)],
          text: valueArray[i + j * this.size],
        }

        this.rectObjects[i + j * this.size] = (rectObj);

        this.drawRect(rectObj);
        this.strokeRect(rectObj);
        this.fillTextInRect(rectObj);
      }
    }
  }

  redrawCanvas(managedObject = null){
    const context = this.canvas.getContext("2d");
    context.clearRect(0, 0, 480, 480);
    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        const rectObj = this.getRectObj(i + j * this.size);
        if (managedObject !== null && managedObject === rectObj) {
          continue;
        }
        this.drawRect(rectObj);
        this.strokeRect(rectObj);
        this.fillTextInRect(rectObj);
      }
    }
    if (managedObject !== null) {
      this.drawRect(managedObject);
      this.strokeRect(managedObject);
      this.fillTextInRect(managedObject);
    }
  }

  drawRect(rectObj){
    // console.log(rectObj);
    const context = this.canvas.getContext("2d");
    context.fillStyle = rectObj.color;
    context.clearRect(rectObj.x, rectObj.y, rectObj.w, rectObj.h);
    context.fillRect(rectObj.x, rectObj.y, rectObj.w, rectObj.h);
    
    // context.strokeRect(rectObj.x * rectObj.w, rectObj.y * rectObj.h, rectObj.w, rectObj.h);
  }

  strokeRect(rectObj){
    const context = this.canvas.getContext("2d");
    context.strokeRect(rectObj.x, rectObj.y, rectObj.w, rectObj.h);
  }

  fillTextInRect(rectObj) {
    const context = this.canvas.getContext("2d");
    context.fillStyle = "#000";
    context.fillText(rectObj.text,rectObj.x + rectObj.w / 2, rectObj.h / 2 + rectObj.y);
  }

  addWinText(step, time){
    const context = this.canvas.getContext("2d");
    context.font = "30px Verdana";
    context.clearRect(0, 0, 480, 480);
    context.fillStyle = "rgba(0,0,0,0)";
    context.fillRect(0, 0, 480, 480);
    context.fillStyle = "white";
    context.fillText("You win!!! Step Count:".concat(step), 0, 120);
    context.font = "24px Verdana";
    context.fillText(time, 0, 250);
  }

  checkWinCondition(){
    // console.log("winCondArray = " + this.winConditionArray);
    // console.log("textDraw = " + this.textDraw);
    const currentSituation = this.textDraw;// this.rectObjects.map(obj => obj.num);
    tmpArray.map(numb => numb.num)
    if (this.winConditionArray === currentSituation) {
      return true;
    }
    if (this.winConditionArray == null || currentSituation == null) {
      return false;
    }
    if (this.winConditionArray.length !== currentSituation.length) {
      return false;
    }

    for (let i = 0; i < this.winConditionArray.length; ++i) {
      if (this.winConditionArray[i] !== currentSituation[i]) {
        return false;
      } 
    }

    return true;
  }

  trySwap(currentCol) {
    if (this.checkLeft(currentCol)) {
      // this.swap(currentCol, -120, 0, -1);
      this.swapObject(currentCol, -1);
      return true;

    } else if (this.checkTop(currentCol)) {
      // this.swap(currentCol, 0, -120, -4);
      this.swapObject(currentCol,-this.size);
      return true;

    } else if (this.checkRight(currentCol)) {
      this.swapObject(currentCol, 1);
      return true;

    } else if (this.checkBottom(currentCol)){
      // this.swap(currentCol, 0, 120, 4);
      this.swapObject(currentCol, this.size);
      return true;
    }
    return false;
  }

  getRectObj(currentCol) {
    return this.rectObjects.filter( obj => obj.num === currentCol)[0];
  }

  swapObject(currentCol,stepInArray) {

    const rectObjCur = this.getRectObj(currentCol);
    const rectObjPrev = this.getRectObj(currentCol + stepInArray);
    const tmp = Object.assign({}, rectObjCur);

    rectObjCur.color = rectObjPrev.color;
    rectObjCur.text = rectObjPrev.text;

    rectObjPrev.color = tmp.color;
    rectObjPrev.text = tmp.text;

    const tmpVal = this.textDraw[currentCol];
    this.textDraw[currentCol] = this.textDraw[currentCol + stepInArray];
    this.textDraw[currentCol + stepInArray] = tmpVal;

    
    /* if (rectObjCur.x - rectObjPrev.x !== 0) {
      this.animatedSwapX(currentCol, currentCol + stepInArray);
    } else if (rectObjCur.y - rectObjPrev.y !== 0) {
      this.animatedSwapY();
    } */


    this.drawRect(rectObjCur);
    this.strokeRect(rectObjCur);
    this.fillTextInRect(rectObjCur);

    this.drawRect(rectObjPrev);
    this.strokeRect(rectObjPrev);
    this.fillTextInRect(rectObjPrev);
  }

  animatedSwapX(newCellWithNum, newEmptyCell) {
    const cellWithNum = this.getRectObj(newCellWithNum);
    const emptyCell = this.getRectObj(newEmptyCell);

    const isUp = cellWithNum.x - emptyCell.x < 0;
    const diff = Math.abs(cellWithNum.x - emptyCell.x);
    if (isUp) {
      for (let i = 0; i < diff; i += 1) {
        setTimeout( () => {
          cellWithNum.x += 1;
          emptyCell.x -= 1
          this.drawRect(cellWithNum);
          this.strokeRect(cellWithNum);
          this.fillTextInRect(cellWithNum);

         
          this.drawRect(emptyCell);
          this.strokeRect(emptyCell);
          this.fillTextInRect(emptyCell);
        }, 1 * i);
      }
    } else {
      for (let i = 0; i < diff; i += 1) {
        setTimeout(() => {
          cellWithNum.x -= 1;
          emptyCell.x += 1
          this.drawRect(cellWithNum);
          this.strokeRect(cellWithNum);
          this.fillTextInRect(cellWithNum);

          
          this.drawRect(emptyCell);
          this.strokeRect(emptyCell);
          this.fillTextInRect(emptyCell);
        }, 1 *i);
      } 
    }
    const tmp = cellWithNum.num;
    cellWithNum.num = ""
    emptyCell.num = tmp;
   
  }

  animatedSwapY(newCellWithNum, newEmptyCell) {

  }

  checkLeft(currentCol) {
    
    for (let i = 0; i <  this.size; i += 1) {
      if (currentCol === i * this.size) {
        return false;
      }
    }
    if (this.textDraw[currentCol - 1] === "") {
      return true;
    } 
    return false;
  }

  checkTop(currentCol){
    if ( currentCol < this.size){ // 0 1 2 3
      return false;
    } else if (this.textDraw[currentCol - this.size] === "") {
      return true;
    } 
    return false;
  }

  checkRight(currentCol){
    for (let i = 1; i <  this.size; i += 1) {
      if (currentCol === i * this.size - 1) {
        return false;
      }
    }
    if (this.textDraw[currentCol + 1] === "") {
      return true;
    } 
    return false;
  }

  checkBottom(currentCol){
    if ( currentCol > this.size * this.size - this.size){
      return false;
    } else if (this.textDraw[currentCol + this.size] === "") {
      return true;
    } 
    return false;
  }
}