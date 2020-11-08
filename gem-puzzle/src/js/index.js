// import '../css/style.css';
// import '../css/style.scss';
import {
  configurateLayout,
  canvas,
} from "./configurateLayout";

import {
  MyCanvas,
} from "./canvas";

import {
  GamePuzzle,
} from "./GamePuzzle";

/* const helloArr = require("./moduleOne.js");

class TestClass {
  constructor() {
    const msg = "Using ES2015+ syntax";
    console.log(msg);
  }
}
const test = new TestClass();

// Пример массива
console.log(helloArr);
/* пример подключения модуля */
// let mod = moduleOne(2, 3);
// console.log(mod);

const layout = configurateLayout();
const canvasElement = new MyCanvas(canvas);
const gamePuzzle = new GamePuzzle(canvasElement);

window.addEventListener("load", () => {
  console.log("hello webpack");
  layout;
  let basicArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, "", 16];
  gamePuzzle.setStartArray( basicArray );
  console.log("canvEl = ");
  console.log(canvasElement);
  gamePuzzle.start();
});
