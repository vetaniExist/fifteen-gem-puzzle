export function getRandomInt(newMax) {
  return Math.floor(Math.random() * Math.floor(newMax));
}

export function formatTime(num) {
  return (parseInt(num, 10) < 10 ? "0" : "") + num;
}

export function getRandomImage() {
  return `https://raw.githubusercontent.com/irinainina/image-data/master/box/${1 + getRandomInt(150)}.jpg`;
}

export default getRandomInt;
