const generatedCodes = new Set();

const generateUniqueCode = (length = 6) => {
  let code;
  do {
    code = Math.floor(100000 + Math.random() * 900000).toString();
  } while (generatedCodes.has(code));

  generatedCodes.add(code);
  return code;
};

module.exports = generateUniqueCode;
