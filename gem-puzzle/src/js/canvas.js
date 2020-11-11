export class MyCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.styles = ["greenyellow", "yellow", "red", "purple"];
    this.textDraw = [];
    this.winConditionArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ""];
    this.rectObjects = [];
  }

  static getRandomInt(newMax) {
    return Math.floor(Math.random() * Math.floor(newMax));
  }

  initBasicField(valueArray = this.textDraw, size = 4) {
    this.textDraw = valueArray;
    console.log(this.textDraw);
    this.canvas.height = 480;
    this.canvas.width = 480;
    const context = this.canvas.getContext("2d");
    context.font = "22px Verdana";

    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        console.log(valueArray[i * 4 + j]);
        let rectObj = {
          num: i + j * 4,
          x: i * 120,
          y: j * 120,
          w: 120,
          h: 120,
          color: this.styles[MyCanvas.getRandomInt(4)],
          text: valueArray[i + j * 4],
        }

        this.rectObjects[i + j * 4] = (rectObj);

        this.drawRect(rectObj);
        this.strokeRect(rectObj);
        this.fillTextInRect(rectObj);
      }
    }
  }

  redrawCanvas(){
    const context = this.canvas.getContext("2d");
    context.clearRect(0, 0, 480, 480);
    for (let i = 0; i < 4; i += 1) {
      for (let j = 0; j < 4; j += 1) {
        const rectObj = this.getRectObj(i + j * 4);
        this.drawRect(rectObj);
        this.strokeRect(rectObj);
        this.fillTextInRect(rectObj);
      }
    }
  }

  drawRect(rectObj){
    console.log(rectObj);
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
    context.fillText(rectObj.text,rectObj.x + 60, 60 + rectObj.y);
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
    if (this.winConditionArray === this.textDraw) {
      return true;
    }
    if (this.winConditionArray == null || this.textDraw == null) {
      return false;
    }
    if (this.winConditionArray.length !== this.textDraw.length) {
      return false;
    }

    for (let i = 0; i < this.winConditionArray.length; ++i) {
      if (this.winConditionArray[i] !== this.textDraw[i]) {
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
      this.swapObject(currentCol,-4);
      return true;

    } else if (this.checkRight(currentCol)) {
      this.swapObject(currentCol, 1);
      return true;

    } else if (this.checkBottom(currentCol)){
      // this.swap(currentCol, 0, 120, 4);
      this.swapObject(currentCol, 4);
      return true;
    }
    return false;
  }

  getRectObj(currentCol) {
    return this.rectObjects.filter( obj => obj.num === currentCol)[0];
  }

  swapObject(currentCol,stepInArray) {
    // swap in array
    console.log("get cur col = " + currentCol);
    console.log(this.rectObjects[currentCol]);

   
    
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

    console.log("rectObjCur");
    console.log(rectObjCur);

    console.log("rectObjPrev");
    console.log(rectObjPrev);


    this.drawRect(rectObjCur);
    this.strokeRect(rectObjCur);
    this.fillTextInRect(rectObjCur);

    this.drawRect(rectObjPrev);
    this.strokeRect(rectObjPrev);
    this.fillTextInRect(rectObjPrev);



  }

  swap(currentCol, stepX, stepY, stepInArray) {
                // ------> x

      /*
      y
      ^
      |
      |
      |
      */
    const context = this.canvas.getContext("2d");
    const curY = Math.floor(currentCol / 4);
    const curX = currentCol % 4;
    // const curY = 15 - curX * 4;

    console.log("curX = " + curX);
    console.log("curY = " + curY);

    const pixelDataCur = context.getImageData(curX * 120 + 5, curY * 120 + 5, 1, 1).data;
    const pixelDataPrev = context.getImageData(curX * 120 + 5 + stepX, curY * 120 + 5 + stepY, 1, 1).data;


    context.clearRect(curX * 120, curY * 120, 120, 120);
    context.fillStyle = 'rgba('.concat(pixelDataPrev).concat(')');
    context.fillRect(curX * 120, curY * 120, 120, 120);
    context.strokeRect(curX * 120, curY * 120, 120, 120);

    context.clearRect(curX * 120 + stepX, curY * 120 + stepY, 120, 120);
    context.fillStyle = 'rgba('.concat(pixelDataCur).concat(')');
    context.fillRect(curX * 120 + stepX, curY * 120 + stepY, 120, 120);
    context.strokeRect(curX * 120 + stepX, curY * 120 + stepY, 120, 120);

    context.fillStyle = "#000";
    context.fillText(this.textDraw[currentCol], 120 * curX + 60 + stepX, 60 + 120 * curY + stepY);

    const tmpVal = this.textDraw[currentCol];
    this.textDraw[currentCol] = this.textDraw[currentCol + stepInArray];
    this.textDraw[currentCol + stepInArray] = tmpVal;
  }

  isCursorInCell(x, y, checkedCell){
    const curY = Math.floor(checkedCell / 4);
    const curX = checkedCell % 4;

    const minY = curY * 120;
    const minX = curX * 120;

    const isOnXLine = x >= minX && x <= minX + 120;
    const isOnYLine = y >= minY && y <= minY + 120;

    if (isOnXLine && isOnYLine) {
      return true;
    }
    return false;
  }
  
  checkLeft(currentCol) {
    if ( currentCol === (0 || 4 || 8 || 12)){
      return false;
    } else if (this.textDraw[currentCol - 1] === "") {
      return true;
    } 
    return false;
  }

  checkTop(currentCol){
    if ( currentCol === (0 || 1 || 2 || 3)){
      return false;
    } else if (this.textDraw[currentCol - 4] === "") {
      return true;
    } 
    return false;
  }

  checkRight(currentCol){
    if ( currentCol === (3 || 7 || 11 || 15)){
      return false;
    } else if (this.textDraw[currentCol + 1] === "") {
      return true;
    } 
    return false;
  }

  checkBottom(currentCol){
    if ( currentCol === (12 || 13 || 14 || 15)){
      return false;
    } else if (this.textDraw[currentCol + 4] === "") {
      return true;
    } 
    return false;
  }
}