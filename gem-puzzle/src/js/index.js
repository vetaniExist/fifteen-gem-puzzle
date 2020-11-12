import {
  configurateLayout,
  canvas,
  buttonStart,
  initializeControlButtons,
} from "./configurateLayout";

import {
  GamePuzzle,
} from "./GamePuzzle";

const gamePuzzle = new GamePuzzle(canvas);

window.addEventListener("load", () => {
  console.log("hello webpack");
  initializeControlButtons();
  configurateLayout();
});

buttonStart.addEventListener("click", () => {
  gamePuzzle.start();
});

