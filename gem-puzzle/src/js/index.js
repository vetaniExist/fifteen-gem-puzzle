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
  gamePuzzle.start();
});