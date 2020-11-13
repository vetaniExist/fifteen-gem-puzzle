export function getRandomInt(newMax) {
  return Math.floor(Math.random() * Math.floor(newMax));
}

export function formatTime(num) {
  return (parseInt(num, 10) < 10 ? "0" : "") + num;
}

export default getRandomInt;
