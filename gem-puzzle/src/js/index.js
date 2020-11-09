import {
  configurateLayout,
  canvas,
  buttonStart,
} from "./configurateLayout";

import {
  GamePuzzle,
} from "./GamePuzzle";

const gamePuzzle = new GamePuzzle(canvas);

window.addEventListener("load", () => {
  console.log("hello webpack");
  configurateLayout();
});

buttonStart.addEventListener("click", () => {
  const basicArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, "", 15];
  gamePuzzle.setStartArray(basicArray);
  gamePuzzle.start();
});