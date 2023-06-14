const getLastWord = (expression) => {
  const words = expression.trim().split(' ');
  const word = words[words.length - 1];
  return word;

};

export { getLastWord };
