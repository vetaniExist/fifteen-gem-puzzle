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

  getRectObjects() {
    return this.rectObjects;
  }

  setRectObjects(newRectObjects) {
    console.log("get this obj");
    console.log(newRectObjects);
    this.rectObjects = newRectObjects;
    console.log("after setter ");
    console.log(this.rectObjects);
  }

  initBasicField(valueArray, size, winCondition, isLoad = false) {
    if (!isLoad) {
      this.rectObjects = [];
    }
    this.size = size;
    this.winConditionArray = winCondition;
    this.textDraw = valueArray;
    this.canvas.height = 480;
    this.canvas.width = 480;
    const context = this.canvas.getContext("2d");
    context.font = "22px Verdana";

    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        if (!isLoad) {
          const rectObj = {
            num: i + j * this.size,
            x: (i * 480) / this.size,
            y: (j * 480) / this.size,
            w: 480 / this.size,
            h: 480 / this.size,
            color: this.styles[MyCanvas.getRandomInt(4)],
            text: valueArray[i + j * this.size],
          };
  
          this.rectObjects[i + j * this.size] = (rectObj);

          this.drawRect(rectObj);
          this.strokeRect(rectObj);
          this.fillTextInRect(rectObj);
        } else {
          console.log("init this field");
          console.log(this.rectObjects)
          this.drawRect(this.rectObjects[i + j * this.size]);
          this.strokeRect(this.rectObjects[i + j * this.size]);
          this.fillTextInRect(this.rectObjects[i + j * this.size]);
        }
      }
    }
    console.log("start: ");
    console.log(this.rectObjects);
  }

  redrawCanvas(managedObject = null) {
    const context = this.canvas.getContext("2d");
    context.clearRect(0, 0, 480, 480);
    for (let i = 0; i < this.size; i += 1) {
      for (let j = 0; j < this.size; j += 1) {
        const rectObj = this.getRectObj(i + j * this.size);
        if (!(managedObject !== null && managedObject === rectObj)) {
          this.drawRect(rectObj);
          this.strokeRect(rectObj);
          this.fillTextInRect(rectObj);
        }
      }
    }
    if (managedObject !== null) {
      this.drawRect(managedObject);
      this.strokeRect(managedObject);
      this.fillTextInRect(managedObject);
    }
  }

  rectClear(rectObj) {
    const context = this.canvas.getContext("2d");
    context.fillStyle = "rgba(0,0,0,0)";
    context.clearRect(rectObj.x, rectObj.y, rectObj.w, rectObj.h);
  }

  drawRect(rectObj) {
    const context = this.canvas.getContext("2d");
    context.fillStyle = "rgba(0,0,0,0)";
    context.clearRect(rectObj.x, rectObj.y, rectObj.w, rectObj.h);
    context.fillStyle = rectObj.color;
    context.fillRect(rectObj.x, rectObj.y, rectObj.w, rectObj.h);
  }

  strokeRect(rectObj) {
    const context = this.canvas.getContext("2d");
    context.strokeRect(rectObj.x, rectObj.y, rectObj.w, rectObj.h);
  }

  fillTextInRect(rectObj) {
    const context = this.canvas.getContext("2d");
    context.fillStyle = "#000";
    context.fillText(rectObj.text, rectObj.x + rectObj.w / 2, rectObj.h / 2 + rectObj.y);
  }

  addWinText(step, time) {
    this.rectObjects = [];
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

  checkWinCondition() {
    const currentSituation = this.textDraw;// this.rectObjects.map(obj => obj.num);

    if (this.winConditionArray === currentSituation) {
      return true;
    }
    if (this.winConditionArray == null || currentSituation == null) {
      return false;
    }
    if (this.winConditionArray.length !== currentSituation.length) {
      return false;
    }

    for (let i = 0; i < this.winConditionArray.length; i += 1) {
      if (this.winConditionArray[i] !== currentSituation[i]) {
        return false;
      }
    }

    return true;
  }

  trySwap(currentCol) {
    if (this.checkLeft(currentCol)) {
      this.swapObject(currentCol, -1);
      return true;
    }
    if (this.checkTop(currentCol)) {
      this.swapObject(currentCol, -this.size);
      return true;
    }
    if (this.checkRight(currentCol)) {
      this.swapObject(currentCol, 1);
      return true;
    }
    if (this.checkBottom(currentCol)) {
      this.swapObject(currentCol, this.size);
      return true;
    }
    return false;
  }

  getRectObj(currentCol) {
    return this.rectObjects[currentCol];
  }

  swapObjectProperties(currentCol, stepInArray) {
    const rectObjCur = this.getRectObj(currentCol);
    const rectObjPrev = this.getRectObj(currentCol + stepInArray);
    const tmp = Object.assign({}, rectObjCur);

    rectObjCur.num = rectObjPrev.num;
    rectObjCur.x = rectObjPrev.x;
    rectObjCur.y = rectObjPrev.y;
    rectObjCur.w = rectObjPrev.w;
    rectObjCur.h = rectObjPrev.h;
    rectObjCur.color = rectObjPrev.color;
    rectObjCur.text = rectObjPrev.text;

    rectObjPrev.num = tmp.num;
    rectObjPrev.x = tmp.x;
    rectObjPrev.y = tmp.y;
    rectObjPrev.w = tmp.w;
    rectObjPrev.h = tmp.h;
    rectObjPrev.color = tmp.color;
    rectObjPrev.text = tmp.text;
  }

  swapOnX(currentCol, stepInArray, step) {
    const rectObjCur = this.getRectObj(currentCol);
    const rectObjPrev = this.getRectObj(currentCol + stepInArray);
    for (let i = 0; i < rectObjCur.w; i += 1) {
      setTimeout(() => {
        this.rectClear(rectObjCur);
        this.rectClear(rectObjPrev);
        rectObjCur.x += step;
        rectObjPrev.x -= step;

        this.drawRect(rectObjPrev);
        this.strokeRect(rectObjPrev);
        this.fillTextInRect(rectObjPrev);

        this.drawRect(rectObjCur);
        this.strokeRect(rectObjCur);
        this.fillTextInRect(rectObjCur);
        if (i === rectObjCur.w - 1) {
          console.log("after: ");
          console.log(this.rectObjects);
          this.swapObjectProperties(currentCol, stepInArray);
          console.log("after2: ");
          console.log(this.rectObjects);
        }
      }, 1 * i);
    }
  }

  swapOnY(currentCol, stepInArray, step) {
    const rectObjCur = this.getRectObj(currentCol);
    const rectObjPrev = this.getRectObj(currentCol + stepInArray);
    for (let i = 0; i < rectObjCur.h; i += 1) {
      setTimeout(() => {
        this.rectClear(rectObjCur);
        this.rectClear(rectObjPrev);
        rectObjCur.y += step;
        rectObjPrev.y -= step;

        this.drawRect(rectObjPrev);
        this.strokeRect(rectObjPrev);
        this.fillTextInRect(rectObjPrev);

        this.drawRect(rectObjCur);
        this.strokeRect(rectObjCur);
        this.fillTextInRect(rectObjCur);
        if (i === rectObjCur.w - 1) {
          console.log("after: ");
          console.log(this.rectObjects);
          this.swapObjectProperties(currentCol, stepInArray);
          console.log("after2: ");
          console.log(this.rectObjects);
        }
      }, 1 * i);
    }
  }

  swapObject(currentCol, stepInArray) {
    const rectObjCur = this.getRectObj(currentCol);
    const rectObjPrev = this.getRectObj(currentCol + stepInArray);

    const tmpVal = this.textDraw[currentCol];
    this.textDraw[currentCol] = this.textDraw[currentCol + stepInArray];
    this.textDraw[currentCol + stepInArray] = tmpVal;

    const isUpX = rectObjCur.x - rectObjPrev.x < 0;
    const isUpY = rectObjCur.y - rectObjPrev.y < 0;
    const isDownX = rectObjCur.x - rectObjPrev.x > 0;
    const isDownY = rectObjCur.y - rectObjPrev.y > 0;

    if (isUpX) {
      this.swapOnX(currentCol, stepInArray, 1);
    } else if (isDownX) {
      this.swapOnX(currentCol, stepInArray, -1);
    } else if (isUpY) {
      this.swapOnY(currentCol, stepInArray, 1);
    } else if (isDownY) {
      this.swapOnY(currentCol, stepInArray, -1);
    }
  }

  checkLeft(currentCol) {
    for (let i = 0; i < this.size; i += 1) {
      if (currentCol === i * this.size) {
        return false;
      }
    }
    if (this.textDraw[currentCol - 1] === "") {
      return true;
    }
    return false;
  }

  checkTop(currentCol) {
    if (currentCol < this.size) { // 0 1 2 3
      return false;
    }

    if (this.textDraw[currentCol - this.size] === "") {
      return true;
    }
    return false;
  }

  checkRight(currentCol) {
    for (let i = 1; i < this.size; i += 1) {
      if (currentCol === i * this.size - 1) {
        return false;
      }
    }
    if (this.textDraw[currentCol + 1] === "") {
      return true;
    }
    return false;
  }

  checkBottom(currentCol) {
    if (currentCol > this.size * this.size - this.size) {
      return false;
    }
    if (this.textDraw[currentCol + this.size] === "") {
      return true;
    }
    return false;
  }
}
export default MyCanvas;
