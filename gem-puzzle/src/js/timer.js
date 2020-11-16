import {
  updateTimeEl,
  getTimeInnerText,
} from "./configurateLayout";

import {
  formatTime,
} from "./utils";

export class Timer {
  constructor() {
    this.minutes = 0;
    this.seconds = -1;
    this.timer = null;
    this.isActive = true;
  }

  restart() {
    this.seconds = -1;
    this.minutes = 0;
    this.isActive = false;
  }
  
  stop(){
    this.isActive = false;
  }

  startTimer() {
    if (this.isActive) {
      clearTimeout(this.timer);
      this.seconds += 1;

      if (this.seconds === 60) {
        this.seconds = 0;
        this.minutes += 1;
      }

      const timeElInner = getTimeInnerText();

      const notTime = timeElInner.slice(7)
      const currTime = formatTime(this.minutes) + " : " + formatTime(this.seconds);
      updateTimeEl(currTime.concat(notTime));

      this.timer = this.startTimer.bind(this);
      setTimeout(this.timer, 1000);
    }

  }

  getMinutes() {
    return this.minutes;
  }

  getSeconds() {
    return this.seconds;
  }

  setMinutes(newMin) {
    this.minutes = newMin;
  }

  setSeconds(newSec) {
    this.seconds = newSec;
  }
}

export default Timer;
