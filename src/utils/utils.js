const getLastWord = (expression) => {
  const words = expression.trim().split(' ');
  const word = words[words.length - 1];
  return word;

};

const capitalizeFirstLetter = (string) => `${string[0].toUpperCase()}${string.slice(1)}`;

export { getLastWord, capitalizeFirstLetter };
