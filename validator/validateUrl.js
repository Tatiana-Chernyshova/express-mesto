const validator = require('validator');

const validateUrl = (value) => {
  const result = validator.isURL(value);
  if (result) {
    return value;
  }
  throw new Error('Ошибка проверки URL');
};

module.exports = validateUrl;
