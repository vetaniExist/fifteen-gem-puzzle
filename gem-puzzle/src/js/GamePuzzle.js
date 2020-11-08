class GamePuzzle {
  constructor(canvasObj) {
    this.startArray = [];
    this.canvasObj = canvasObj;
  }

  setStartArray(newStartArray) {
    this.startArray = newStartArray;
  }

  getStartArray() {
    return this.startArray;
  }

  start() {
    console.log(this.canvasObj);
    this.canvasObj.initBasicField(this.startArray, 4);

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

      this.canvasObj.trySwap(currentBlockClick);
    });
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

module.exports = {
  GamePuzzle,
};
