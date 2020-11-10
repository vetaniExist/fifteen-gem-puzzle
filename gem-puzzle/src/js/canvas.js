export class MyCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.styles = ["greenyellow", "yellow", "red", "purple"];
    this.textDraw = [];
    this.winConditionArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, ""];
  }

  static getRandomInt(newMax) {
    return Math.floor(Math.random() * Math.floor(newMax));
  }

  initBasicField(valueArray, size) {
    this.textDraw = valueArray;
    console.log(this.textDraw);
    this.canvas.height = 480;
    this.canvas.width = 480;
    const context = this.canvas.getContext("2d");
    context.font = "22px Verdana";

    for (let i = 0; i < size; i += 1) {
      for (let j = 0; j < size; j += 1) {
        console.log(valueArray[i * 4 + j]);

        context.fillStyle = this.styles[MyCanvas.getRandomInt(4)];
        context.fillRect(i * 120, j * 120, 120, 120);
        context.strokeRect(i * 120, j * 120, 120, 120);

        context.fillStyle = "#000";
        context.fillText(valueArray[i + j * 4], 120 * i + 60, 60 + 120 * j);
      }
    }
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
    console.log("winCondArray = " + this.winConditionArray);
    console.log("textDraw = " + this.textDraw);
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
      this.swap(currentCol, -120, 0, -1);
      return true;

    } else if (this.checkTop(currentCol)) {
      this.swap(currentCol, 0, -120, -4);
      return true;

    } else if (this.checkRight(currentCol)) {
      this.swap(currentCol, 120, 0, 1);
      return true;

    } else if (this.checkBottom(currentCol)){
      this.swap(currentCol, 0, 120, 4);
      return true;
    }
    return false;
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