import {
  configurateLayout,
  canvas,
  buttonStart,
  buttonAutoSolvation,
  buttonLoadLastGame,
  buttonSettingField3x3,
  buttonSettingField4x4,
  buttonSettingField8x8,
  initializeControlButtons,
  buttonForImages,
  buttonSettingVolumeOnOf,
  buttonSettingVolumeOnOfSwitch,
  buttonSettingVolumeDown,
  buttonSettingVolumeUp,
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

buttonLoadLastGame.addEventListener("click", () => {
  gamePuzzle.loadGame();
});

buttonAutoSolvation.addEventListener("click", () => {
  gamePuzzle.autoSolvation();
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

buttonForImages.addEventListener("click", () => {
  gamePuzzle.addImageOnBoard();
});

buttonSettingVolumeOnOf.addEventListener("click", () => {
  buttonSettingVolumeOnOfSwitch(gamePuzzle.audioOnOf());
});

buttonSettingVolumeDown.addEventListener("click", () => {
  buttonSettingVolumeOnOfSwitch(gamePuzzle.audioVolumeDown());
});

buttonSettingVolumeUp.addEventListener("click", () => {
  buttonSettingVolumeOnOfSwitch(gamePuzzle.audioVolumeUp());
});
