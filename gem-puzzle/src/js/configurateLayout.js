function configurateButton(newInnnerText) {
  const newButton = document.createElement("button");
  newButton.classList.add("basic_button");
  newButton.innerText = newInnnerText;
  return newButton;
}

const wrapper = document.createElement("div");
const canvas = document.createElement("canvas");
const controlButtonsDiv = document.createElement("div");

const buttonStart = configurateButton("start");
const buttonBestScore = configurateButton("best score");

function configurateLayout() {
  wrapper.classList.add("wrapper");
  canvas.setAttribute("id", "puzzle_canvas");

  controlButtonsDiv.classList.add("control_buttons_div");
  // button_start.setAttribute("hidden", true);

  controlButtonsDiv.appendChild(buttonStart);
  controlButtonsDiv.appendChild(buttonBestScore);

  wrapper.appendChild(canvas);
  wrapper.appendChild(controlButtonsDiv);

  document.body.appendChild(wrapper);
}

module.exports = {
  configurateLayout,
  canvas,
};
