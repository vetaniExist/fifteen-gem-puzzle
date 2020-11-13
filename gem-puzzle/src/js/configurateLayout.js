function createEl(elName) {
  try {
    return document.createElement(elName);
  } catch (err) {
    throw new Error("Error in createEl func. Trying to do ".concat(elName).concat(" html tag").concat(" Errr log: ").concat(err));
  }
}

function configurateButton(newInnnerText) {
  const newButton = createEl("button");
  newButton.classList.add("basic_button");
  newButton.innerText = newInnnerText;
  return newButton;
}

const wrapper = createEl("div");
const canvasDiv = createEl("div");
const time = createEl("time");
const canvas = createEl("canvas");
const controlButtonsDiv = createEl("div");

const buttonStart = configurateButton("start");
const buttonSetting = configurateButton("setting");
const buttonBestScore = configurateButton("best score");

const buttonSettingFieldSize = configurateButton("field size");
const buttomSettingVolume = configurateButton("volume");

const buttonSettingField3x3 = configurateButton("3x3");
const buttonSettingField4x4 = configurateButton("4x4");
const buttonSettingField8x8 = configurateButton("8x8");

const buttonSettingVolumeUp = configurateButton("volume up");
const buttonSettingVolumeDown = configurateButton("volume down");

const buttonSettingBack = configurateButton("back");

function configurateLayout() {
  wrapper.classList.add("wrapper");
  canvas.setAttribute("id", "puzzle_canvas");
  canvasDiv.classList.add("canvas_div");
  time.classList.add("time");

  controlButtonsDiv.classList.add("control_buttons_div");

  controlButtonsDiv.appendChild(buttonStart);
  controlButtonsDiv.appendChild(buttonSetting);
  controlButtonsDiv.appendChild(buttonBestScore);

  canvasDiv.appendChild(time);
  canvasDiv.appendChild(canvas);

  wrapper.appendChild(canvasDiv);
  wrapper.appendChild(controlButtonsDiv);

  document.body.appendChild(wrapper);
}

function updateTimeEl(newTimeContent) {
  time.innerText = newTimeContent;
}

function getTimeInnerText() {
  return time.innerText;
}

function settingLayout() {
  controlButtonsDiv.innerHTML = "";
  controlButtonsDiv.appendChild(buttonSettingFieldSize);
  controlButtonsDiv.appendChild(buttomSettingVolume);
  controlButtonsDiv.appendChild(buttonSettingBack);
}

function settingFieldSize() {
  controlButtonsDiv.innerHTML = "";
  controlButtonsDiv.appendChild(buttonSettingField3x3);
  controlButtonsDiv.appendChild(buttonSettingField4x4);
  controlButtonsDiv.appendChild(buttonSettingField8x8);

  controlButtonsDiv.appendChild(buttonSetting);
}

function settingVolome() {
  controlButtonsDiv.innerHTML = "";
  controlButtonsDiv.appendChild(buttonSettingVolumeUp);
  controlButtonsDiv.appendChild(buttonSettingVolumeDown);

  controlButtonsDiv.appendChild(buttonSetting);
}

function settingStartPosition() {
  controlButtonsDiv.innerHTML = "";
  controlButtonsDiv.appendChild(buttonStart);
  controlButtonsDiv.appendChild(buttonSetting);
  controlButtonsDiv.appendChild(buttonBestScore);
}

function initializeControlButtons() {
  buttonSetting.addEventListener("click", () => {
    settingLayout();
  });

  buttonSettingBack.addEventListener("click", () => {
    settingStartPosition();
  });

  buttonSettingFieldSize.addEventListener("click", () => {
    settingFieldSize();
  });

  buttomSettingVolume.addEventListener("click", () => {
    settingVolome();
  });
}

module.exports = {
  configurateLayout,
  canvas,
  buttonStart,
  buttonSettingField3x3,
  buttonSettingField4x4,
  buttonSettingField8x8,
  updateTimeEl,
  getTimeInnerText,
  initializeControlButtons,
};
