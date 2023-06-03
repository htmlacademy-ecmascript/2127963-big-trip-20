const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const getLastWord = (expression) => {
  const words = expression.trim().split(' ');
  const word = words[words.length - 1];
  return word;

};

/*function updateItem(items, update) {
  return items.map((item) => item.id === update.id ? update : item);
}*/

export { getRandomInteger, getRandomArrayElement, getLastWord/*, updateItem*/ };
