import {
  configurateLayout,
  canvas,
  buttonStart,
  buttonSettingField3x3,
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

buttonSettingField3x3.addEventListener("click", () => {
  gamePuzzle.setSize(3);
  console.log(gamePuzzle.getSize());
  gamePuzzle.start();
});

