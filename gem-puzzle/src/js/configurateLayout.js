const wrapper = document.createElement("div");
const canvas = document.createElement("canvas");
const controlButtonsDiv = document.createElement("div");

const buttonStart = configurateButton("start");

function configurateLayout() {
  wrapper.classList.add("wrapper");
  canvas.setAttribute("id", "puzzle_canvas");

  controlButtonsDiv.classList.add("control_buttons_div");
  // button_start.setAttribute("hidden", true);

  controlButtonsDiv.appendChild(buttonStart);

  wrapper.appendChild(canvas);
  wrapper.appendChild(controlButtonsDiv);

  document.body.appendChild(wrapper);
}

function configurateButton(newInnnerText) {
  const newButton = document.createElement("button");
  newButton.classList.add("basic_button");
  newButton.innerText = newInnnerText;
  return newButton;
}

module.exports = {
  configurateLayout,
};
