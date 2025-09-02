const fs = require("fs");

const russianText = fs.readFileSync("./data/russian.txt", "utf8");
const russianWords = russianText
  .split("\n")
  .map((word) => word.replace(/\r/g, "").trim())
  .filter((word) => word.length > 0);

const englishText = fs.readFileSync("./data/english.txt", "utf8");
const englishWords = englishText
  .split("\n")
  .map((word) => word.replace(/\r/g, "").trim())
  .filter((word) => word.length > 0);

const jsContent = `
export const russianWords = ${JSON.stringify(russianWords, null, 2)};
export const englishWords = ${JSON.stringify(englishWords, null, 2)};
`;
fs.writeFileSync("./data/data.js", jsContent);
console.log("Файлы успешно конвертированы в data.js");
