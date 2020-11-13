import {
  configurateLayout,
  canvas,
  buttonStart,
  buttonSettingField3x3,
  buttonSettingField4x4,
  buttonSettingField8x8,
  initializeControlButtons,
} from "./configurateLayout";

import {
  GamePuzzle,
} from "./GamePuzzle";

const gamePuzzle = new GamePuzzle(canvas);

window.addEventListener("load", () => {
  initializeControlButtons();
  configurateLayout();
});

buttonStart.addEventListener("click", () => {
  gamePuzzle.start();
});

buttonSettingField3x3.addEventListener("click", () => {
  gamePuzzle.setSize(3);
  gamePuzzle.start();
});

buttonSettingField4x4.addEventListener("click", () => {
  gamePuzzle.setSize(4);
  gamePuzzle.start();
});

buttonSettingField8x8.addEventListener("click", () => {
  gamePuzzle.setSize(8);
  gamePuzzle.start();
});
