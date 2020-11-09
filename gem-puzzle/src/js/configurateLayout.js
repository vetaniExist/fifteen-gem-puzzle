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
const canvas = createEl("canvas");
const controlButtonsDiv = createEl("div");

const buttonStart = configurateButton("start");
const buttonBestScore = configurateButton("best score");

function configurateLayout() {
  wrapper.classList.add("wrapper");
  canvas.setAttribute("id", "puzzle_canvas");

  controlButtonsDiv.classList.add("control_buttons_div");
  // button_start.setAttribute("hidden", true);

  controlButtonsDiv.appendChild(buttonStart);
  controlButtonsDiv.appendChild(buttonBestScore);

  canvasDiv.appendChild(canvas);

  wrapper.appendChild(canvasDiv);
  wrapper.appendChild(controlButtonsDiv);

  document.body.appendChild(wrapper);
}

module.exports = {
  configurateLayout,
  canvas,
  buttonStart,
};
